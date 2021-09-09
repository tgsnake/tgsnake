import fs from "fs"
import path from "path"

const pipe = (...fns:any[]) => (x:any) => fns.reduce((v, f) => f(v), x)

const flattenArray = (input:any) =>
  input.reduce((acc:any, item:any) => [...acc, ...(Array.isArray(item) ? item : [item])], [])

const map = (fn:any) => (input:any) => input.map(fn)

const walkDir = (fullPath:any) => {
  return fs.statSync(fullPath).isFile() ? fullPath : getAllFilesRecursively(fullPath)
}

const pathJoinPrefix = (prefix:any) => (extraPath:any) => path.join(prefix, extraPath)

export default function getAllFilesRecursively (folder:any) {
  return pipe(fs.readdirSync, map(pipe(pathJoinPrefix(folder), walkDir)), flattenArray)(folder)
} 