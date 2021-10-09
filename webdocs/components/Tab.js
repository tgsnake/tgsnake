// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2021 Butthx <https://guthub.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Tab } from '@headlessui/react' 
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
function TabName({children}){
  return (
      <Tab 
        className={({ selected }) => classNames(
           `px-2 mx-1 mt-2 text-md w-auto hover:border-opacity-100 hover:text-blue-500 hover:border-b-2 hover:border-blue-500 hover:transition-all hoverduration-500`,
            selected  
            ? `border-blue-500 border-opacity-100 text-blue-500 border-b-2 transition-all duration-500` 
            : `border-gray-500 border-b-2 border-opacity-50 transition-all duration-500`
          )
        } 
      >
        {children}
      </Tab>
    )
}
export function TabGroup ({children}){ 
  return (
    <Tab.Group> 
      <Tab.List className="overflow-x-auto">
        {
          children.map((element,index)=>(
            <TabName key={`${element.props.name}_title_${index}`}>
              {element.props.name}
            </TabName>
          ))
        }
      </Tab.List>
      <Tab.Panels>
        {
          children.map((element,index)=>(
            <Tab.Panel key={`${element.props.name}_content_${index}`}> 
              {element.props.children}
            </Tab.Panel>
          ))
        }
      </Tab.Panels>
    </Tab.Group>
    )
} 
export function TabContent ({children}){
  return <>{children}</>
}