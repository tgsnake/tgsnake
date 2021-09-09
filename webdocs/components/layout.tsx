import type { NextPage } from 'next' 
import Head from "next/head"
import Link from "next/link"
const Layout:NextPage = (props) => {
  const showSideBar = (e:any) => {
    e.preventDefault() 
    let sidebar = document.querySelector("#sidebar")
    let button = document.querySelector("#showHide") 
    let content = document.querySelector("#content")
    let header = document.querySelector("#header")
    if(sidebar) sidebar.classList.toggle("hidden")
    if(content) content.classList.toggle("overflow-y-hidden") 
    if(header) header.classList.toggle("z-40")
    return
  }
  return (
    <> 
       <Head> 
          {/*@ts-ignore*/}
          <title>{props.title || "tgsnake"}</title>
       </Head>
       <div id="showHide" className="float-right flex items-center cursor-pointer p-2 fixed right-5 bottom-5 backdrop-filter md:hidden backdrop-blur-md h-16 w-16 z-40 rounded-full border-gray-200 border-2" onClick={showSideBar}>
          <svg className="w-6 h-6 mx-auto dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
       </div>
       <div className="w-full max-w-8xl mx-auto mb-auto">
          <div className="md:flex">
            <div id="sidebar" className="fixed z-40 inset-0 flex-none h-full backdrop-filter backdrop-blur-sm w-full md:bg-white md:static md:h-auto z-40 md:overflow-y-auto md:pt-0 md:w-60 xl:w-72 md:block hidden"> 
              <div className="float-right flex items-center cursor-pointer p-2 fixed right-5 bottom-5 backdrop-filter backdrop-blur-md h-16 w-16 md:hidden rounded-full border-gray-200 border-2" onClick={showSideBar}>
                <svg className="w-6 h-6 mx-auto dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
             </div>
              <div className="h-full z-40 bg-white p-2 overflow-y-auto scrolling-touch md:h-auto md:block md:relative md:sticky md:bg-transparent md:top-18 mr-24 md:rounded-none border-r-2 border-black rounded-r-md md:border-none md:mr-0">
                <div className="px-1 pt-6 overflow-y-auto font-medium text-base sm:px-3 xl:px-5 md:text-sm pb-10 md:pt-10 md:pb-14 sticky?md:h-(screen-18)">
                  <ul>
                  { 
                  //@ts-ignore
                    props.folder  
                      //@ts-ignore
                      ? props.folder.map(e => ( 
                        //@ts-ignore
                        <li key={e.folder}> 
                        {/*@ts-ignore*/}
                          <span>{e.folder}</span> 
                          <ul className="pl-4">
                            { 
                            //@ts-ignore
                              e.content.map(f => (
                                <li className="text-blue-500"> 
                                  {/*@ts-ignore*/}
                                  <Link href={f.slug}>
                                    {/*@ts-ignore*/}
                                    <a>{f.title}</a>
                                  </Link>
                                </li>
                              ))
                            }
                          </ul>
                        </li>
                      ))
                      : <li><b>NotFound!</b></li>
                  }
                  </ul>
                </div>
              </div>
            </div>
            <div id="content" className="mx-auto flex flex-col h-screen md:overflow-y-auto">
             <header id="header" className="w-full backdrop-filter backdrop-blur-sm p-2 z-40 text-lg md:text-xl font-bold sticky top-0 border-b-2 border-gray-300">
               <Link href="/"> 
               {/*@ts-ignore*/}
                <a>{props.title || "tgsnake"}</a>
               </Link>
             </header>
             <article className="prose mx-2 mb-auto p-2 dark:prose-dark prose-blue md:prose-md lg:prose-lg mb-4 pb-4">
                {/*@ts-ignore*/}
                {props.children}
              </article>
             <footer className="font-light mb-4 pb-4 font-italic mx-2 px-2">tgsnake {new Date().getFullYear()}</footer>
            </div>
          </div>
        </div>
    </>
    )
}
export default Layout