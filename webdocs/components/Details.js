import {useState} from "react"
export function Details({ summary, children, startOpen = false }){
  const [open, setOpen] = useState(startOpen);
  return ( 
      <details className="p-2" {...(open ? { open: true } : {})}>
        <summary 
          className="bg-blue-100 flex rounded-lg p-2 font-medium hover:bg-blue-200 text-blue-500 mb-2 justify-between text-left focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-75"
          onClick={(e) => {
            e.preventDefault();
            setOpen((open) => !open);
          }}
        > 
          <span>{summary}</span>
          <svg className={`${open ? "transform rotate-180" : ""} text-blue-500 w-5 h-5`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </summary>
        {open && children}
      </details> 
  );
}; 

export function DetailsGroups({children}){
  return (
      <div className="m-2 p-2 rounded-lg shadow-md">
        {children}
      </div>
    )
};