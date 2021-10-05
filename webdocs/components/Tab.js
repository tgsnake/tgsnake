import { Tab } from '@headlessui/react' 
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
function TabName ({children}){
  return (
      <Tab
        className={({ selected }) => classNames(
           `px-2 mt-2 text-md w-auto overflow-x-auto`,
            selected  
            ? `border-blue-500 border-b-2` 
            : `border-gray-500 border-b-2`
          )
        }
      >
        {children}
      </Tab>
    )
}
export default TabName