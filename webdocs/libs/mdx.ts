import fs from "fs"
import { bundleMDX } from 'mdx-bundler'
import Image from "next/image"
import Link from "next/link" 
import path from "path"
import headings from "rehype-autolink-headings"
import gfm from "remark-gfm"
import slug from "rehype-slug"
import rehypePrismPlus from "rehype-prism-plus"
import katex from "rehype-katex"
import math from "remark-math"
import * as Modules from "./modules" 
import getAllFilesRecursively from './files'
import { visit } from 'unist-util-visit'
import sizeOf from 'image-size'
let root = path.join(process.cwd(),"contents")
function formatSlug(slug:any) {
  return slug.replace(/\.(mdx|md)/, '')
}; 
export async function getContent(loc:string) {
  let docs = fs.readFileSync(loc,"utf8")
  if (path.extname(loc) !== '.md' && path.extname(loc) !== '.mdx') {
      return false
   } 
  let fileName = path.basename(loc) 
  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'esbuild.exe'
    )
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'bin',
      'esbuild'
    )
  }
  let results = await bundleMDX(docs,{
    cwd : root,
    xdmOptions(options) {
      options.remarkPlugins = [ 
          ...(options.remarkPlugins ?? []),
          math,
          gfm,
          Modules.preTitle
        ]
      options.rehypePlugins = [ 
          ...(options.rehypePlugins ?? []), 
          slug,
          katex,
          [headings,{content: {type: 'text', value: '#'},behavior:'append',linkProperties:{ariaHidden: 'true', tabIndex: -1,className:["icon-link"]}}],
          [rehypePrismPlus, { ignoreMissing: true }]
        ]
      return options
    }
  }) 
  let {frontmatter,code} = results
  return {
    data : frontmatter,
    content : code,
    fileName : fileName,
    slug : formatSlug(loc.replace(root,"").trim())
  }
}
export async function getAllContent(){
  const files:any[] = getAllFilesRecursively(root) 
  let slugs:any[] = [] 
  for(let i = 0; i<files.length;i++){
    let file = files[i]
    slugs.push(await getContent(file))
  }
  return slugs
}