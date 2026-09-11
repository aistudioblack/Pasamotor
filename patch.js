const fs = require('fs');
let code = fs.readFileSync('api/github-push.ts', 'utf8');

code = code.replace(
  'const newTree = await octokit.git.createTree(createTreeParams);',
  `
  let newTree;
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
  `
);

code = code.replace(
  'const newCommit = await octokit.git.createCommit(createCommitParams);',
  `
  let newCommit;
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
  `
);

fs.writeFileSync('api/github-push.ts', code);
