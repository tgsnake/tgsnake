import type { NextPage } from 'next' 
import {getAllContent} from "../libs/mdx"
import mdxComponent from "../components/mdx"
import { useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import Head from "next/head"
import Layout from "../components/layout"

const Home:NextPage = ({content,data,folder}:any) => {
  const Content = useMemo(() => getMDXComponent(content), [content])
  return ( 
      <>
      {
        content 
          //@ts-ignore
          ? <Layout title={data["title"] || "tgsnake"} folder={folder}>
            {/*@ts-ignore*/}
              <Content components={mdxComponent}/>
            </Layout>
          : <h2>NotFound!</h2>
      }
    </>
    )
}
export const getStaticProps = async (ctx:any) => {
  let mdxFile = await getAllContent()
  let {params} = ctx 
  let index = mdxFile.findIndex(file => /^\/readme/i.test(file.slug))  
  if(index == -1){
    return {
      notFound : true 
    }
  }
  let folder:any[] = [] 
  for(let i=0; i<mdxFile.length;i++){ 
    if(folder.length <= 0){ 
      if(mdxFile[i]["data"]["folder"]){
         folder.push({
           folder : mdxFile[i]["data"]["folder"],
           content : [{
             "slug" : mdxFile[i]["slug"],
             "title" : mdxFile[i]["data"]["title"]
           }]
         })
      }
    }else{
      if(mdxFile[i]["data"]["folder"]){ 
        let indexFolder = folder.findIndex(fol => fol["folder"].toLowerCase() === mdxFile[i]["data"]["folder"].toLowerCase()) 
        if(indexFolder !== -1){
          folder[indexFolder]["content"].push({
            "slug" : mdxFile[i]["slug"],
            "title" : mdxFile[i]["data"]["title"]
          })
        }else{
          folder.push({
           folder : mdxFile[i]["data"]["folder"],
           content : [{
             "slug" : mdxFile[i]["slug"],
             "title" : mdxFile[i]["data"]["title"]
           }]
         })
        }
      }
    }
    continue;
  } 
  folder.sort((a:any,b:any)=> a.folder.localeCompare(b.folder))
  for(let i=0; i<folder.length;i++){
    folder[i].content.sort((a:any,b:any)=> a.title.localeCompare(b.title))
    if(/getting(\s+)?started/i.exec(folder[i].folder)){
      folder.splice(0,0,folder.splice(i,1)[0])
    }
  }
  return {
    props : {
      content : mdxFile[index]["content"], 
      data : mdxFile[index]["data"],
      folder : folder
    }
  }
}
export default Home