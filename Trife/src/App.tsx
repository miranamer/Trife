import { useState, useEffect } from 'react'
import Node from './components/Node';
import { Tree, TreeNode } from "react-organizational-chart";
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';

export type page = {
  id: number,
  date: string,
  node: node,
  title?: string //* Add this to MainPage functionality of adding new days [DONE]
  details?: string
}

export type node = {
  value: string
  children: node[]
  nodeStyle?: string
  moodStyle?: string
  isRoot: boolean
  mood: string,
  tags: string[][],
  details: string,
  media: object[],
  location?: string
}

export const startNode: node = {
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

function App() {

  useEffect(() => {
      const storedPages = window.localStorage.getItem('pages');

      if (storedPages) {
        setPages(JSON.parse(storedPages));
        let pagesArray = JSON.parse(storedPages);
        let mxID = 0;
        
        for(let i = 0; i < pagesArray.length; i++){
          if(pagesArray[i]["id"] > mxID){
            mxID = pagesArray[i]["id"];
          }
        }

        setPagePtr(mxID);
      } 
      else {
        window.localStorage.setItem('pages', JSON.stringify([]));
        setPagePtr(0);
      }
  }, [])
  
  const testPage: page = {
    id: 1,
    date: "02/01/2024",
    node: structuredClone(startNode),
    title: "Marshall Wace - Insight Day",
    details: "Trading, AI, System Design"
  }

  const testPage2: page = {
    id: 0,
    date: "01/01/2024",
    node: structuredClone(startNode),
    title: "Jane Street Event",
    details: "Black-Scholes, Options Trading, HFT"
  }

  //! ADD TAGS AND MOODS TO LOCALSTORAGE TO PERSIST THEM

  const [pages, setPages] = useState<page[]>([]); // Array of all pages (entries)
  const [pagePtr, setPagePtr] = useState<number>(0); // ID of currently selected page
  const [tags, setTags] = useState<string[][]>([['Internships', 'red'], ['Uni', 'blue']]) // Tags Array -> [tagTitle, tagColor]
  const [moods, setMoods] = useState<string[]>([]); // All Used Moods

  const showTree = (node: node) => { // Recursively draws all nodes by taking in root node as Node itself calls showTree on all children
    return (
      <>
        <Node node={node} showTree={showTree} pages={pages} setPages={setPages} pagePtr={pagePtr} tags={tags} setTags={setTags} moods={moods} setMoods={setMoods} />
      </>
    );
  };

  return (
    <>
      <BrowserRouter>
        <ChakraProvider>
          <Routes>
            <Route path='/' element={<MainPage pages={pages} pagePtr={pagePtr} setPagePtr={setPagePtr} setPages={setPages} showTree={showTree} tags={tags} moods={moods} />} />
          </Routes>
        </ChakraProvider>
      </BrowserRouter>
    </>
  )
}

export default App
