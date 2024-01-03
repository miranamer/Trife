import React, { useState } from 'react'
import { Tree } from 'react-organizational-chart';
import DayBar from './DayBar'
import { Tag, TagLabel } from '@chakra-ui/react';

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

//! Reverse order of pages in order to show latest day on top
//! Left Click open info about node, right click -> manage node
//! Add New Node Type -> Retrospect. To show what you would have done differently in retrospect and how it could / would have gone
//! Add expand icon on top right
//! Node Info Modal should have Following:
//? - General Text Entry
//? - Image Gallery
//? - Show All The Selected Tags for the Node


const MainPage = ({pages, showTree, setPages, tags}) => {

    const [selectedDayBar, setSelectedDayBar] = useState<number>(0);
    const [selectedFilter, setSelectedFilter] = useState<string>(""); // "tag", "mood", etc
    const [selectedTags, setSelectedTags] = useState<[]>([]);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const startNode: node = {
        value: "Start",
        children: [],
        nodeStyle: "StyledNodeNormal",
        moodStyle: "moodNormal",
        isRoot: true,
        moods: [],
        tags: []
    }

    const TestDate = "03/01/01" // replace w/ curr date

    const addNewDay = () => {
        for(let i = 0; i < pages.length; i++){
            if(pages[i].date === TestDate){
                alert('Already Have An Entry Today!');
                return;
            }
        }

        const newDay: page = {
            id: pages.length,
            date: TestDate,
            node: structuredClone(startNode)
        }

        setPages([...pages, newDay]);
    }

    const selectFilter = (filter) => { //? Show all selected tags and moods somewhere - new div left of dropdown showing all selected filtered items 
        setMenuOpen(false);
        setSelectedFilter(filter);
    }



  return (
    <>
        <div class="bg-[#F1E8D7] w-full h-screen p-5">
            <div class="flex gap-3 w-full">
                <div class="flex flex-col gap-3 w-[50%] h-[95vh]">
                    
                    <div class="relative bg-[#FAF6EC] w-full h-[100px] border-[#746C59] border-[2px] flex items-center p-3">
                        <h1 class='text-3xl text-[#746C59]'>Search For Text...</h1>
                        <div onClick={() => setMenuOpen(!menuOpen)} class="hover:cursor-pointer absolute right-0 flex items-center justify-center border-[#746C59] border-l-[2px] w-[100px] h-full bg-[#EFE2C0]">
                            <p class="text-4xl text-[#746C59]">^</p>
                        </div>
                    </div>

                    {menuOpen ? <div class='relative mb-[130px]'>
                        <div class="bg-[#FAF6EC] flex flex-col w-[100px] absolute right-0 border-[#746C59] border-[2px] justify-end">
                            <h1 onClick={() => selectFilter("tag")} class='font-semibold text-[#746C59] border-b-2 border-b-[#746C59] p-2 hover:cursor-pointer'>Tag</h1>
                            <h1 onClick={() => selectFilter("mood")} class='font-semibold text-[#746C59] border-b-2 border-b-[#746C59] p-2 hover:cursor-pointer'>Mood</h1>
                            <h1 onClick={() => selectFilter("filter3")} class='font-semibold text-[#746C59] p-2 hover:cursor-pointer'>Filter 3</h1>
                        </div>
                    </div> : null}
                    
                    {selectedFilter === "tag" ? <div class="bg-[#FAF6EC] w-[100%] h-[150px] border-[#746C59] border-[2px] flex p-3">
                        <div class="flex flex-col gap-5">
                            <h1 class="text-[#746C59] text-2xl">Filter: Filter By Tag</h1>
                            <div class="flex gap-3 items-center">
                                {tags.map((tag) => (
                                    <Tag
                                    size='lg'
                                    borderRadius='full'
                                    variant='solid'
                                    colorScheme={tag[1]}
                                    className='hover:cursor-pointer'
                                    >
                                    <TagLabel>{tag[0]}</TagLabel>
                                </Tag>
                                ))}
                            </div>
                        </div>
                    </div> : null}
                    
                    <div class="bg-[#FAF6EC] h-full border-[#746C59] border-[2px] flex flex-col gap-3 p-3 text-[#746C59]">

                        <div onClick={() => addNewDay()} class="hover:cursor-pointer w-[100px] border-2 border-[#746C59] h-[80px] bg-[#EEE1BF] flex items-center justify-center">
                            <h1 class="text-3xl">+</h1>
                        </div>
                        
                        {pages.map((page) => (
                            <div onClick={() => setSelectedDayBar(page.id)}><DayBar page={page} highlighted={page.id === selectedDayBar} /></div>
                        ))}
                    
                    </div>
                </div>
                
                <div class="flex flex-col w-[50%] h-[95vh] bg-[#FAF6EC] border-[#746C59] border-[2px] p-2">
                    <div class="w-full h-[40px] flex items-center justify-center">
                        <h1 class="font-semibold text-[#746C59] underline text-xl">{pages[selectedDayBar].date}</h1>
                    </div>
                    {selectedDayBar != null ? <div className='mt-[10%]'><Tree label={""} lineWidth='3px' lineColor='#b794ec' lineBorderRadius='10px'>{showTree(pages[selectedDayBar].node)}</Tree></div> : null}
                </div>
            </div>
            </div>
    </>
  )
}

export default MainPage