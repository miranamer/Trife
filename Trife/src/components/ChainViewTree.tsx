import React from 'react'
import { Tree } from 'react-organizational-chart'
import { page, node } from '../App'

type ChainViewTreeProps = {
  page: page;
  showTree: (node: node) => React.ReactNode;
}

const ChainViewTree = ({page, showTree} : ChainViewTreeProps) => {
  return (
    <div className='flex flex-col gap-10 items-center justify-center'>
        <h1 className="font-bold text-xl text-[#746C59]">{page.date}</h1>
        
        <Tree label={""} lineWidth="3px" lineColor="#b794ec" lineBorderRadius="10px">
            {showTree(page.node)}
        </Tree>
        
        <div className="h-[1px] w-[80%] border-0 border-t-2 border-t-[#746C59] border-dashed"></div>
    </div>
  )
}

export default ChainViewTree