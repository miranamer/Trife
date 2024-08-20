import { useState, useEffect } from 'react'
import Node from './components/Node';
import { Tree, TreeNode } from "react-organizational-chart";
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './hooks/Auth';
import { supabaseClient } from './config/supabase-client';
import { Session } from '@supabase/supabase-js';
import emojiRegex from 'emoji-regex';

//util functions
import { orderDatesDescending } from './utils/utils';

//store
import { usePageStore } from './store/page-store';

//types
export type page = {
  id: number,
  userID: string | undefined,
  date: string,
  node: node,
  title?: string
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

  const {pagePtr, pages, setPagePtr, setPages} = usePageStore((state) => (
    {
    pagePtr: state.pagePtr,
    pages: state.pages,
    setPagePtr: state.setPagePtr,
    setPages: state.setPages
    }
  ));

  useEffect(() => {

      const fetchPages = async (userID: string | undefined) => {
        const {data, error} = await supabaseClient
        .from('Pages')
        .select()
        .eq('userID', userID)
        .order('id', { ascending: false });

        if(error){
            console.log(error);
        }

        if(data){
            
            data.sort(orderDatesDescending);

            setPages(data)
        }
      }

      const fetchTags = async (userID: string | undefined) => {
        const {data, error} = await supabaseClient
        .from('Tags')
        .select()
        .eq('userID', userID)

        if(error){
            console.log(error);
        }

        if(data){
            //console.log(data);
            let formattedTags = [];
            for(let i = 0; i < data.length; i++){
              formattedTags.push([data[i].tagText, data[i].tagColor]);
            }
            setTags(formattedTags);
        }
      }

      const fetchMoods = async (userID: string | undefined) => {
        const {data, error} = await supabaseClient
        .from('Moods')
        .select()
        .eq('userID', userID)

        if(error){
            console.log(error);
        }

        if(data){
            console.log('Moods', data);
            let formattedMoods = [];

            for(let i = 0; i < data.length; i++){
              formattedMoods.push(data[i].mood);
            }

            setMoods(formattedMoods);
        }
      }

      supabaseClient.auth.getSession().then(({ data: { session } }) => {
        fetchPages(session?.user.id);
        fetchTags(session?.user.id);
        fetchMoods(session?.user.id);
        setSession(session)
      })
  
      supabaseClient.auth.onAuthStateChange((_event, session) => {
        fetchPages(session?.user.id);
        fetchTags(session?.user.id);
        fetchMoods(session?.user.id);
        setSession(session)
      })

  }, [])

  //? Take tags and moods from Zustand store as well like pages[] and pagePtr
  const [tags, setTags] = useState<string[][]>([]) // Tags Array -> [[tagTitle, tagColor]]
  const [moods, setMoods] = useState<string[]>([]); // All Used Moods

  const [session, setSession] = useState<Session | null>();

  const showTree = (node: node) => { // Recursively draws all nodes by taking in root node as Node itself calls showTree on all children
    return (
      <>
        <Node node={node} showTree={showTree} tags={tags} setTags={setTags} moods={moods} setMoods={setMoods} />
      </>
    );
  };

  return (
    <>
      <BrowserRouter>
        <ChakraProvider>
          <AuthProvider>
            <Routes>
              <Route path='/signup' element={<SignUp />} />
              <Route path='/login' element={<Login />} />
              <Route path='/' element={<ProtectedRoute><MainPage showTree={showTree} tags={tags} moods={moods} /></ProtectedRoute>} />
            </Routes>
          </AuthProvider>
        </ChakraProvider>
      </BrowserRouter>
    </>
  )
}

export default App
