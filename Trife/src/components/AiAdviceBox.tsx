import React from 'react'
import { BsTrashFill } from "react-icons/bs";

type AiAdviceBoxProps = {
  responseText: string
  setAiResponse: React.Dispatch<React.SetStateAction<string>>
}

const AiAdviceBox = ({responseText, setAiResponse} : AiAdviceBoxProps) => {
  return (
    <div className='w-full h-auto p-5 bg-slate-500 flex flex-wrap overflow-auto text-white font-dmMono rounded-md'>
      <p onClick={() => setAiResponse("")} className='text-red-400 text-xl relative left-0 mb-2 hover:cursor-pointer'><BsTrashFill /></p>
      <p>{responseText}</p>
    </div>
  )
}

export default AiAdviceBox