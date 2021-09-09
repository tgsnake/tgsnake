const { exec } = require("child_process"); 
const fs = require("fs")
let dir = exec("echo \"Working dir : "+process.cwd()+"/webdocs\"",{cwd : "./webdocs"})
dir.stdout.on("data",(code)=>{
  console.log(code.toString())
})
dir.stderr.on("data",(code)=>{
  console.log(code.toString())
})
dir.on("close",(code)=>{
  if(code === 0){
    let nextBuild = exec("yarn build && yarn export",{cwd : "./webdocs"})
    nextBuild.stdout.on("data",(nextCode)=>{
      console.log(nextCode.toString())
    })
    nextBuild.stderr.on("data",(nextCode)=>{
      console.log(nextCode.toString())
    })
    nextBuild.on("close",(nextCode)=>{
      if(code === 0){
        fs.writeFileSync(process.cwd()+"/docs/CNAME","tgsnake.js.org") 
        fs.writeFileSync(process.cwd()+"/docs/.nojekyll","") 
      }
    })
  }
})