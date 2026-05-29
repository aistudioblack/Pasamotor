import { Octokit } from "@octokit/rest";
import { glob } from "glob";
import fs from "fs";
import path from "path";

export async function pushToGithubSdk(githubUrl: string, token: string) {
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

  const octokit = new Octokit({ auth: token });
  
  // Test authentication
  try {
    await octokit.users.getAuthenticated();
  } catch (e: any) {
    throw new Error("GitHub SDK Doğrulama Hatası: Token geçersiz, süresi dolmuş veya hatalı. Lütfen kontrol edin.");
  }

  // Get all files
  const files = await glob("**/*", {
    ignore: [
      "node_modules/**",
      ".git/**",
      "dist/**",
      ".env",
      "build/**",
      "package-lock.json"
    ],
    nodir: true,
    cwd: process.cwd()
  });

  const branch = "main";
  
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

    try {
      const blob = await octokit.git.createBlob({
        owner,
        repo,
        content,
        encoding
      });
      
      treeData.push({
        path: file.replace(/\\/g, "/"),
        mode: "100644" as const,
        type: "blob" as const,
        sha: blob.data.sha
      });
    } catch (err: any) {
       console.error("Error creating blob for", file, err);
       throw new Error(`Blob oluşturma hatası (${file}): ` + err.message);
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
