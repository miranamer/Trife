import { useState } from 'react'
import Node from './components/Node';
import { Tree, TreeNode } from "react-organizational-chart";
import { ChakraProvider } from '@chakra-ui/react'

type page = {
  id: number,
  date: string,
  node: node
}

type node = {
  value: string
  children: node[]
  nodeStyle?: string
  moodStyle?: string
  isRoot: boolean
  mood: string,
  tags: []
}

function App() {

  const startNode: node = {
    value: "Start",
    children: [],
    nodeStyle: "StyledNodeNormal",
    moodStyle: "moodNormal",
    isRoot: true,
    moods: [],
    tags: []
  }
  
  const testPage: page = {
    id: -1,
    date: "01/01/01",
    node: structuredClone(startNode)
  }

  const testPage2: page = {
    id: 0,
    date: "02/01/01",
    node: structuredClone(startNode)
  }

  const [pages, setPages] = useState<page[]>([testPage, testPage2]);
  const [pagePtr, setPagePtr] = useState<number>(0);
  const [tags, setTags] = useState<string[][]>([['Book Proj', 'blue']])

  const showTree = (node: node) => {
    return (
      <>
        <Node node={node} showTree={showTree} pages={pages} setPages={setPages} pagePtr={pagePtr} tags={tags} setTags={setTags}/>
      </>
    );
  };

  const debugMenu = () => {
    console.log('PagePtr: ', pagePtr);
    console.log('Page Length: ', pages.length);
  }

  const incrementPagePointer = () => {
    setPagePtr(pagePtr + 1);
  }

  const decrementPagePointer = () => {
    setPagePtr(pagePtr - 1);
  }

  return (
    <>
      <ChakraProvider>
        <div className="p-10">
          <h1 className='text-center mb-10 text-3xl font-bold text-orange-400'>{pages[pagePtr].date}</h1>
          <Tree label={""} lineWidth='3px' lineColor='#b794ec' lineBorderRadius='10px'>{showTree(pages[pagePtr].node)}</Tree>
          {pagePtr < pages.length - 1 ? <p onClick={() => incrementPagePointer()} className='fixed bottom-10 right-10 bg-blue-500 p-2 rounded-md text-blue-200 hover:cursor-pointer'>Next</p> : null}
          {pagePtr > 0 ? <p onClick={() => decrementPagePointer()} className='fixed bottom-10 left-10 bg-red-500 p-2 rounded-md text-red-200 hover:cursor-pointer'>Back</p> : null}
          <p onClick={() => debugMenu()} className='text-purple-400 text-xl font-bold fixed bottom-5 text-center left-[50%]'>Debug</p>
        </div>
      </ChakraProvider>
    </>
  )
}

export default App
