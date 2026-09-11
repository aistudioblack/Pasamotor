import { glob } from "glob";
import fs from "fs";
import path from "path";
import crypto from "crypto";

function computeGitBlobSha(buf: Buffer): string {
  const header = Buffer.from(`blob ${buf.length}\0`);
  return crypto.createHash("sha1").update(Buffer.concat([header, buf])).digest("hex");
}

export async function pushToGithubSdk(githubUrl: string, token: string) {
  token = (token || "").trim();
  githubUrl = (githubUrl || "").trim();
  
  let owner = "";
  let repo = "";
  try {
    const urlObj = new URL(githubUrl);
    const parts = urlObj.pathname.split("/").filter(Boolean);
    owner = parts[0];
    repo = parts[1].replace(".git", "");
  } catch (e) {
    throw new Error("Geçersiz GitHub URL formatı. Örnek: https://github.com/kullanici/repo.git");
  }

  if (!owner || !repo) {
    throw new Error("URL'den depo sahibi veya adı çıkarılamadı.");
  }

  // Token maskeleme ve doğrulama logları (Sadece güvenli kısımları yazdırıyoruz)
  const maskedToken = token.length > 12 
    ? `${token.substring(0, 10)}...${token.substring(token.length - 4)}` 
    : "Çok kısa veya geçersiz token";
  console.log(`[GitHub SDK] İşlem başlatılıyor. Hedef Repo: ${owner}/${repo}, Token: ${maskedToken} (Uzunluk: ${token.length})`);

  if (token.length < 10) {
    throw new Error("Sağlanan GitHub Token geçersiz veya çok kısa görünüyor. Lütfen doğru kopyaladığınızdan emin olun.");
  }

  const { Octokit } = await new Function('return import("@octokit/rest")')();
  const octokit = new Octokit({ auth: token });
  
  // Test authentication and repo access
  try {
    await octokit.repos.get({ owner, repo });
    console.log("[GitHub SDK] Depo erişim testi başarılı!");
  } catch (e: any) {
    console.error(`[GitHub SDK] Depo (${owner}/${repo}) erişim hatası:`, e.message || e);
    
    let detailMsg = e.message || "Bilinmeyen hata";
    if (e.status === 404) {
      detailMsg = "Depo Bulunamadı (404) - Token bu depoya erişmek için yetkilendirilmemiş olabilir. Fine-grained PAT ayarlarında 'Only select repositories' kısmından bu depoyu seçtiğinizden emin olun.";
    } else if (e.status === 401) {
      detailMsg = "Geçersiz Kimlik Bilgileri (401) - Token hatalı, süresi dolmuş veya silinmiş.";
    }

    try {
      const authUser = await octokit.users.getAuthenticated();
      console.log(`[GitHub SDK] Genel kullanıcı testi başarılı! Kullanıcı: ${authUser.data.login}`);
    } catch (innerErr: any) {
      console.error("[GitHub SDK] Genel kullanıcı doğrulama hatası:", innerErr.message || innerErr);
      throw new Error(`GitHub SDK Doğrulama Hatası: Token geçersiz, süresi dolmuş veya bu depo için yetkilendirilmemiş.\n\nDetay: ${detailMsg}\n\nLütfen Fine-grained PAT ayarlarınızda:\n1. 'Resource owner' kısmının doğru hesap/organizasyon olduğunu,\n2. 'Repository access' kısmında 'Only select repositories' seçilip bu deponun seçildiğini,\n3. 'Repository permissions > Contents' izninin 'Read & Write' olduğunu kontrol edin.`);
    }
  }

  // .gitignore dosyasını okuyup dinamik ignore listesi oluşturma
  const defaultIgnore = [
    "node_modules/**",
    "**/node_modules/**",
    ".git/**",
    "**/.git/**",
    "dist/**",
    "**/dist/**",
    ".env*",
    "**/.env*",
    "*.mjs",
    "**/*.mjs",
    "*test*.js",
    "test-*.js",
    "test-*.ts",
    "check-*.mjs",
    "reset-*.mjs",
    "check-users.mjs",
    "reset-super-admin.mjs",
    "scripts/**",
    "**/scripts/**",
    "firebase-applet-config.json",
    "firebase-blueprint.json",
    ".img_cache/**",
    "**/.img_cache/**",
    ".agents/**",
    "**/.agents/**",
    "*.log",
    "**/*.log",
    "bun.lock",
    "db-check.ts"
  ];

  const gitignorePatterns: string[] = [...defaultIgnore];
  try {
    const gitignorePath = path.join(process.cwd(), ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
      const lines = gitignoreContent.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        if (trimmed.startsWith("!")) continue;

        let pattern = trimmed;
        if (pattern.startsWith("/")) {
          pattern = pattern.substring(1);
        }
        
        if (pattern.endsWith("/")) {
          gitignorePatterns.push(`${pattern}**`);
          gitignorePatterns.push(`**/${pattern}**`);
        } else {
          gitignorePatterns.push(pattern);
          gitignorePatterns.push(`**/${pattern}`);
        }
      }
    }
  } catch (err) {
    console.warn("Dinamik .gitignore okunurken hata oluştu, varsayılan listeyle devam ediliyor:", err);
  }

  const finalIgnore = Array.from(new Set(gitignorePatterns));

  // Get all project files
  const files = await glob("**/*", {
    ignore: finalIgnore,
    nodir: true,
    cwd: process.cwd(),
    dot: true
  });

  // Get the default branch
  let branch = "main";
  try {
    const repoInfo = await octokit.repos.get({
      owner,
      repo
    });
    branch = repoInfo.data.default_branch || "main";
  } catch (e: any) {
    console.warn("Varsayılan dal alınamadı, 'main' kullanılacak:", e.message);
  }
  
  // Get repository references
  let baseTree = "";
  let latestCommitSha = "";

  try {
    const refData = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`
    });
    latestCommitSha = refData.data.object.sha;

    const commitData = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSha
    });
    baseTree = commitData.data.tree.sha;
  } catch (e: any) {
    if (e.status === 409 || e.status === 404) {
      // Empty repo or branch not found
    } else {
      throw new Error("Depo bilgilerini alırken hata: " + e.message);
    }
  }

  // Eğer depo tamamen boşsa, düşük seviyeli Git API'leri hata vermemesi için README oluşturup başlatılır
  if (!latestCommitSha) {
    console.log("[GitHub SDK] Depo boş veya ana dal bulunamadı. Depo otomatik olarak başlatılıyor...");
    try {
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: "README.md",
        message: "Initial commit (Repository initialized by Admin Panel)",
        content: Buffer.from("# Pasamotor\n\nPasamotor application repository.").toString("base64"),
        branch: branch
      });
      console.log("[GitHub SDK] Depo başarıyla başlatıldı ve README.md oluşturuldu.");
      
      const refData = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${branch}`
      });
      latestCommitSha = refData.data.object.sha;

      const commitData = await octokit.git.getCommit({
        owner,
        repo,
        commit_sha: latestCommitSha
      });
      baseTree = commitData.data.tree.sha;
    } catch (initErr: any) {
      console.error("[GitHub SDK] Depo başlatılamadı:", initErr.message || initErr);
      throw new Error("Boş GitHub deposu otomatik olarak başlatılamadı. Detay: " + (initErr.message || "Bilinmeyen hata"));
    }
  }

  // Uzak depodaki mevcut blob SHA haritasını alarak aynı dosyaların tekrar yüklenmesini önleme
  const remoteBlobMap = new Map<string, string>();
  if (baseTree) {
    try {
      const remoteTreeData = await octokit.git.getTree({
        owner,
        repo,
        tree_sha: baseTree,
        recursive: "true"
      });
      if (remoteTreeData?.data?.tree) {
        for (const item of remoteTreeData.data.tree) {
          if (item.type === "blob" && item.path && item.sha) {
            remoteBlobMap.set(item.path, item.sha);
          }
        }
      }
      console.log(`[GitHub SDK] Uzak ağaçtan ${remoteBlobMap.size} adet mevcut dosya referansı alındı.`);
    } catch (treeFetchErr: any) {
      console.warn("[GitHub SDK] Uzak dosya ağacı önbelleği alınamadı, tüm dosyalar doğrudan doğrulanacak:", treeFetchErr?.message);
    }
  }

  const treeData: any[] = [];
  const filesToUpload: { file: string; filePath: string; buf: Buffer; sha: string; isBinary: boolean }[] = [];

  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    
    // Path Traversal Security Check (Zero Trust)
    const normalizedPath = path.resolve(filePath);
    if (!normalizedPath.startsWith(process.cwd())) {
      console.warn(`[Security] Path Traversal Attempt Blocked: ${file}`);
      continue;
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const buf = fs.readFileSync(filePath);
    if (buf.length > 25 * 1024 * 1024) {
      console.warn(`[GitHub SDK] Dosya 25MB sınırını aştığı için atlandı: ${file}`);
      continue;
    }

    const sha = computeGitBlobSha(buf);
    const normalizedRelativePath = file.replace(/\\/g, "/");
    const remoteSha = remoteBlobMap.get(normalizedRelativePath);

    if (remoteSha && remoteSha === sha) {
      // Dosya uzak depoda zaten birebir aynı hash ile mevcut, blob oluşturmaya gerek yok
      treeData.push({
        path: normalizedRelativePath,
        mode: "100644" as const,
        type: "blob" as const,
        sha
      });
    } else {
      const ext = path.extname(file).toLowerCase();
      const isBinary = [".png", ".jpg", ".jpeg", ".gif", ".ico", ".webp", ".svg", ".eot", ".ttf", ".woff", ".woff2", ".mp3", ".mp4", ".pdf", ".zip", ".webm"].includes(ext);
      filesToUpload.push({
        file,
        filePath,
        buf,
        sha,
        isBinary
      });
    }
  }

  console.log(`[GitHub SDK] Toplam dosya: ${files.length}. Değişmeyen dosya: ${treeData.length}, Yüklenecek: ${filesToUpload.length}`);

  const uploadSingleFile = async (item: typeof filesToUpload[0]) => {
    let retryCount = 0;
    let blobSha = "";
    const encoding = item.isBinary ? "base64" : "utf-8";
    const content = item.isBinary ? item.buf.toString("base64") : item.buf.toString("utf-8");

    while (retryCount < 4) {
      try {
        const blob = await octokit.git.createBlob({
          owner,
          repo,
          content,
          encoding
        });
        blobSha = blob.data.sha;
        break;
      } catch (err: any) {
        retryCount++;
        console.warn(`[GitHub SDK] Yeniden deneme ${retryCount}/4 (${item.file}): ${err.message}`);
        if (retryCount >= 4) {
          console.error(`[GitHub SDK] Dosya yüklenemedi: ${item.file}`, err);
          throw new Error(`GitHub'a dosya yüklenirken hata oluştu (${item.file}): ${err.message}`);
        } else {
          await new Promise(r => setTimeout(r, 1000 * retryCount));
        }
      }
    }

    return {
      path: item.file.replace(/\\/g, "/"),
      mode: "100644" as const,
      type: "blob" as const,
      sha: blobSha || item.sha
    };
  };

  // Küçük dosyaları 3'lü paketler halinde, büyük dosyaları (>1MB) tekli olarak yükleyerek GitHub API 500 hatalarını önleme
  const CHUNK_SIZE = 1;
  for (let i = 0; i < filesToUpload.length; i += CHUNK_SIZE) {
    const chunk = filesToUpload.slice(i, i + CHUNK_SIZE);
    const results = await Promise.all(chunk.map(uploadSingleFile));
    for (const r of results) {
      if (r) treeData.push(r);
    }
  }

  // Create new Tree
  const createTreeParams: any = {
    owner,
    repo,
    tree: treeData
  };
  
  if (baseTree) {
    createTreeParams.base_tree = baseTree;
  }

  
  let newTree: any;
  let treeRetry = 0;
  while(treeRetry < 3) {
    try {
      newTree = await octokit.git.createTree(createTreeParams);
      break;
    } catch(err: any) {
      treeRetry++;
      if(treeRetry >= 3) throw new Error("createTree failed: " + err.message);
      await new Promise(r => setTimeout(r, 2000 * treeRetry));
    }
  }
  

  // Create Commit
  const createCommitParams: any = {
    owner,
    repo,
    message: "Update from Admin Panel (SDK Push) - " + new Date().toISOString(),
    tree: newTree.data.sha,
    parents: latestCommitSha ? [latestCommitSha] : []
  };

  
  let newCommit: any;
  let commitRetry = 0;
  while(commitRetry < 3) {
    try {
      newCommit = await octokit.git.createCommit(createCommitParams);
      break;
    } catch(err: any) {
      commitRetry++;
      if(commitRetry >= 3) throw new Error("createCommit failed: " + err.message);
      await new Promise(r => setTimeout(r, 2000 * commitRetry));
    }
  }
  

  // Update Ref
  if (latestCommitSha) {
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.data.sha,
      force: true
    });
  } else {
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: newCommit.data.sha
    });
  }
  console.log(`[GitHub SDK] Push işlemi başarıyla tamamlandı! Commit: ${newCommit.data.sha}`);
}
