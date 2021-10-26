// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import {useEffect,useState} from "react"
export function TabGroup({children}){
  const [key,setKey] = useState(children[0].props.name)
  return (
      <div className="tabGroup">
        <div className="tabList overflow-x-auto flex">
          {
            children.map((el,i)=>(
              <span 
                key={`${el.props.name}_title_${i}`} 
                id= {`${el.props.name}_title_${i}`} 
                className={`
                  tabName px-2 mx-1 mt-2 text-md w-auto hover:border-opacity-100 hover:text-blue-500 hover:border-b-2 hover:border-blue-500 hover:transition-all hover:duration-500 ${
                    key == el.props.name 
                      ? `border-blue-500 border-opacity-100 text-blue-500 border-b-2 transition-all duration-500` 
                      : `border-gray-500 border-b-2 border-opacity-50 transition-all duration-500`
                  }
                `}
                onClick={
                  (e) => {
                    e.preventDefault();
                    setKey(el.props.name);
                  }
                }
              >
              {el.props.name}
              </span>
            ))
          }
        </div>
        <div className="tabContent"> 
          {
            children.map((el,i)=>(
              <span 
                key={`${el.props.name}_content_${i}`} 
                id= {`${el.props.name}_content_${i}`}
                className={
                  key == el.props.name 
                    ? "" 
                    : "hidden"
                }
              >
                {el.props.children}
              </span>
            ))
          }
        </div>
      </div>
    )
}
export function TabContent ({children}){
  return <>{children}</>
}
