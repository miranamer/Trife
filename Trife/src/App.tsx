import { useState } from 'react'
import Node from './components/Node';
import { Tree, TreeNode } from "react-organizational-chart";
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';

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
    id: 0,
    date: "01/01/01",
    node: structuredClone(startNode)
  }

  const testPage2: page = {
    id: 1,
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

  //<div className="p-10">
  //<h1 className='text-center mb-10 text-3xl font-bold text-orange-400'>{pages[pagePtr].date}</h1>
  //<Tree label={""} lineWidth='3px' lineColor='#b794ec' lineBorderRadius='10px'>{showTree(pages[pagePtr].node)}</Tree>
  //</div>

  return (
    <>
      <BrowserRouter>
        <ChakraProvider>
          <Routes>
            <Route path='/' element={<MainPage pages={pages} setPages={setPages} showTree={showTree} tags={tags} />} />
          </Routes>
        </ChakraProvider>
      </BrowserRouter>
    </>
  )
}

export default App
