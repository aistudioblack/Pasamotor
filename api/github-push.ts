import { glob } from "glob";
import fs from "fs";
import path from "path";

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
    // Fine-grained token'lar sadece o repoya erişebilir, genel kullanıcı profiline erişemeyebilir.
    // Bu yüzden direkt ilgili repoya erişim yetkisini test etmek en güvenli yöntemdir.
    await octokit.repos.get({ owner, repo });
    console.log("[GitHub SDK] Depo erişim testi başarılı!");
  } catch (e: any) {
    console.error(`[GitHub SDK] Depo (${owner}/${repo}) erişim hatası:`, e.message || e);
    
    // Eğer 404 (Not Found) aldıysak, bunun sebebi çoğunlukla deponun seçilmemiş veya private olmasıdır.
    // Eğer 401 (Unauthorized) aldıysak, token tamamen geçersizdir.
    let detailMsg = e.message || "Bilinmeyen hata";
    if (e.status === 404) {
      detailMsg = "Depo Bulunamadı (404) - Token bu depoya erişmek için yetkilendirilmemiş olabilir. Fine-grained PAT ayarlarında 'Only select repositories' kısmından bu depoyu seçtiğinizden emin olun.";
    } else if (e.status === 401) {
      detailMsg = "Geçersiz Kimlik Bilgileri (401) - Token hatalı, süresi dolmuş veya silinmiş.";
    }

    try {
      // Fallback as general auth test if repo doesn't exist yet or other reason
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
    "test-*.mjs",
    "test-*.js",
    "test-*.ts",
    "scripts/create-admin.ts",
    "**/scripts/create-admin.ts",
    "firebase-applet-config.json",
    "firebase-blueprint.json"
  ];

  const gitignorePatterns: string[] = [...defaultIgnore];
  try {
    const gitignorePath = path.join(process.cwd(), ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
      const lines = gitignoreContent.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        // Boş satırları veya yorumları atla
        if (!trimmed || trimmed.startsWith("#")) continue;
        
        // !.env.example gibi negation'ları atla
        if (trimmed.startsWith("!")) continue;

        // Glob formatına dönüştürme
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

  // Benzersiz elemanlardan oluşan ignore listesi
  const finalIgnore = Array.from(new Set(gitignorePatterns));

  // Get all files
  const files = await glob("**/*", {
    ignore: finalIgnore,
    nodir: true,
    cwd: process.cwd()
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
    // If branch doesn't exist, we'll start from scratch (but typically we assume repo is empty or branch doesn't exist)
    if (e.status === 409 || e.status === 404) {
      // Empty repo or branch not found
    } else {
      throw new Error("Depo bilgilerini alırken hata: " + e.message);
    }
  }

  // Eğer depo tamamen boşsa, düşük seviyeli Git veritabanı API'leri (createBlob, createTree vb.) "Git Repository is empty" hatası verir.
  // Bu durumda depoyu standart createOrUpdateFileContents API'si ile initialize edip bir README.md dosyası oluşturmalıyız.
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
      
      // Bilgileri yeniden çekelim
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
      throw new Error("Boş GitHub deposu otomatik olarak başlatılamadı. Lütfen GitHub web arayüzünde depoda en az bir dosya (örn. README.md veya .gitignore) oluşturup tekrar deneyin. Detay: " + (initErr.message || "Bilinmeyen hata"));
    }
  }

  const treeData = [];

  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    // read as base64 for images etc, utf-8 for text
    const ext = path.extname(file).toLowerCase();
    const isBinary = [".png", ".jpg", ".jpeg", ".gif", ".ico", ".webp", ".svg", ".eot", ".ttf", ".woff", ".woff2"].includes(ext);
    
    let content = "";
    let encoding: "utf-8" | "base64" = "utf-8";

    if (isBinary) {
       content = fs.readFileSync(filePath, "base64");
       encoding = "base64";
    } else {
       content = fs.readFileSync(filePath, "utf-8");
    }

    let blobSha = "";
    let retryCount = 0;
    while (retryCount < 3) {
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
        console.warn(`Retry ${retryCount} for blob ${file} due to: ${err.message}`);
        if (retryCount >= 3) {
          console.error("Error creating blob natively for", file, err);
          // throw new Error(`Blob oluşturma hatası (${file}): ` + err.message);
        } else {
          await new Promise(r => setTimeout(r, 1500));
        }
      }
    }
    
    if (blobSha) {
      treeData.push({
        path: file.replace(/\\/g, "/"),
        mode: "100644" as const,
        type: "blob" as const,
        sha: blobSha
      });
    } else {
      console.warn(`Skipping file from commit due to blob creation failure: ${file}`);
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

  const newTree = await octokit.git.createTree(createTreeParams);

  // Create Commit
  const createCommitParams: any = {
    owner,
    repo,
    message: "Update from Admin Panel (SDK Push) - " + new Date().toISOString(),
    tree: newTree.data.sha,
    parents: latestCommitSha ? [latestCommitSha] : []
  };

  const newCommit = await octokit.git.createCommit(createCommitParams);

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
    // Branch didn't exist, create it
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: newCommit.data.sha
    });
  }
}
