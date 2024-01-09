import { useState } from 'react'
import Node from './components/Node';
import { Tree, TreeNode } from "react-organizational-chart";
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';

type page = {
  id: number,
  date: string,
  node: node,
  title?: string //! Add this to MainPage functionality of adding new days
  details?: string
}

type node = {
  value: string
  children: node[]
  nodeStyle?: string
  moodStyle?: string
  isRoot: boolean
  mood: string,
  tags: [],
  details: string,
  media: object[],
  location?: string
}

function App() {

  const startNode: node = {
    value: "Start",
    children: [],
    nodeStyle: "StyledNodeNormal",
    moodStyle: "moodNormal",
    isRoot: true,
    mood: "",
    tags: [],
    details: "",
    media: [
      {
      original: "https://picsum.photos/id/1018/1000/600/",
      thumbnail: "https://picsum.photos/id/1018/250/150/",
    }
  ],
  }
  
  const testPage: page = {
    id: 0,
    date: "01/01/2024",
    node: structuredClone(startNode),
    title: "Jane Street",
    details: "Went great, had a lot of fun!"
  }

  const testPage2: page = {
    id: 1,
    date: "02/01/2024",
    node: structuredClone(startNode),
    title: "Amazon Internship Day 1",
    details: "Really fun, learnt a lot"
  }

  const [pages, setPages] = useState<page[]>([testPage, testPage2]);
  const [pagePtr, setPagePtr] = useState<number>(0);
  const [tags, setTags] = useState<string[][]>([['Book Proj', 'blue']])
  const [moods, setMoods] = useState<string[]>([]);

  const showTree = (node: node) => {
    return (
      <>
        <Node node={node} showTree={showTree} pages={pages} setPages={setPages} pagePtr={pagePtr} tags={tags} setTags={setTags} moods={moods} setMoods={setMoods} />
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
            <Route path='/' element={<MainPage pages={pages} setPages={setPages} showTree={showTree} tags={tags} moods={moods} />} />
          </Routes>
        </ChakraProvider>
      </BrowserRouter>
    </>
  )
}

export default App
