import React, { useState } from 'react'
import { Tree } from 'react-organizational-chart';
import DayBar from './DayBar'
import { Tag, TagLabel, TagCloseButton, Textarea } from '@chakra-ui/react';
import { IoIosArrowDropdown, IoIosArrowDropup  } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Input,
    Tooltip} from "@chakra-ui/react";

import { ImTree, ImEnlarge2 } from "react-icons/im";
import { IoIosPaper } from "react-icons/io";
import FilterBox from './FilterBox';

type page = {
    id: number,
    date: string,
    node: node,
    title?: string,
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
    media: string[],
    location?: string
}

//! Reverse order of pages in order to show latest day on top
//! Left Click open info about node, right click -> manage node
//! Add New Node Type -> Retrospect. To show what you would have done differently in retrospect and how it could / would have gone
//! Add expand icon on top right
//! Make DayBar container scrollable
//! Node Info Modal should have Following:
//? - General Text Entry
//? - Image Gallery
//? - Show All The Selected Tags for the Node


const MainPage = ({pages, showTree, setPages, tags, moods}) => {

    const [selectedDayBar, setSelectedDayBar] = useState<number>(0);
    const [selectedFilter, setSelectedFilter] = useState<string>(""); // "tag", "mood", etc -> determines what filter menu to open
    const [selectedFilters, setSelectedFilters] = useState([]); // STORES ALL FILTERS (TAGS, MOODS, ETC)
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>("");
    const [filteredArray, setFilteredArray] = useState([]); // if searchText != "" and or filters filters present
    const [showFilteredArray, setShowFilteredArray] = useState<boolean>(false);
    const [pageTitle, setPageTitle] = useState<string>("");
    const [pageDetails, setPageDetails] = useState<string>("");
    const {isOpen, onOpen, onClose} = useDisclosure();

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
        ]
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
            node: structuredClone(startNode),
            title: pageTitle,
            details: pageDetails
        }

        setPageDetails("")
        setPageTitle("")
        setPages([...pages, newDay]);
        onClose();
    }

    const resetFilters = () => {
        setFilteredArray([]);
        setSearchText("");
        setMenuOpen(false);
        setShowFilteredArray(false);
        setSelectedFilters([]);
    }

    const addSelectedTag = (selectedTag) => {
        if(selectedFilters.includes(selectedTag) == false){
            setSelectedFilters([...selectedFilters, selectedTag])
        }
        else{
            setSelectedFilters(selectedFilters.filter(curr => curr != selectedTag));
        }
    }

    const addSelectedMood = (selectedMood) => {
        if(selectedFilters.includes(selectedMood) == false){
            setSelectedFilters([...selectedFilters, selectedMood])
        }
        else{
            setSelectedFilters(selectedFilters.filter(curr => curr != selectedMood));
        }
    }

    const selectFilter = (filter) => { //? Show all selected tags and moods somewhere - new div left of dropdown showing all selected filtered items 
        setMenuOpen(false);
        setSelectedFilter(filter);
    }

    const traverseTree_SearchText = (searchText, node) => {
        const lowercaseValue = node.value.toLowerCase();
        const lowercaseNodeDetails = node.details.toLowerCase();
        if (lowercaseValue.includes(searchText) || lowercaseNodeDetails.includes(searchText)) {
            console.log('FOUND!', node);
            return true;
        }
    
        if (Array.isArray(node.children)) {
            return node.children.some((child) => traverseTree_SearchText(searchText, child));
        }
    
        return false;
    };

    const traverseTree_Filters = (filters, node) => {
        console.log(node, node.mood)
        for(let i = 0; i < filters.length; i++){
            const currFilter = filters[i]
            if(node.tags.includes(currFilter) || node.mood.includes(currFilter)){
                return true;
            } 
        }
    
        if (Array.isArray(node.children)) {
            return node.children.some((child) => traverseTree_Filters(filters, child));
        }
    
        return false;
    };

    const searchForDays = (e) => { //! Add checking searchText in page.title and page.details
        // if no, check if search string is non empty
        // if yes, search for all days where any node contains the search string

        e.preventDefault()

        const filteredDays = [];

        if(searchText === "" && selectedFilters.length == 0){
            console.log("CASE 4")
            resetFilters();
        }

        else if(searchText != "" && selectedFilters.length == 0){ // search + no filters
            for(let i = 0; i < pages.length; i++){
                // check for searchText in Title (when I add it)
                // check for searchText in nodes
                const currTree = pages[i].node;
                if((traverseTree_SearchText(searchText.toLowerCase(), currTree) || pages[i].title.toLowerCase().includes(searchText.toLowerCase()) || pages[i].details.toLowerCase().includes(searchText.toLowerCase()))){
                    filteredDays.push(pages[i]);
                }
                console.log('->', traverseTree_SearchText(searchText, currTree));
            }
            console.log(filteredDays);
            setFilteredArray(filteredDays);
            setShowFilteredArray(true);
        }
        
        else if(searchText != "" && selectedFilters.length > 0){ // search with filters
            for(let i = 0; i < pages.length; i++){
                // check for searchText in Title (when I add it)
                // check for searchText in nodes
                const currTree = pages[i].node;
                if(traverseTree_Filters(selectedFilters, currTree) === true && (traverseTree_SearchText(searchText.toLowerCase(), currTree) || pages[i].title.toLowerCase().includes(searchText.toLowerCase()) || pages[i].details.toLowerCase().includes(searchText.toLowerCase()))){
                    filteredDays.push(pages[i]);
                }
                console.log('a', traverseTree_Filters(selectedFilters, currTree), selectedFilters)
                console.log('b', traverseTree_SearchText(searchText, currTree))
            }
            
            setFilteredArray(filteredDays);
            setShowFilteredArray(true);
        }
        
        else if (searchText === "" && selectFilter.length > 0){ // no search + filters
            for(let i = 0; i < pages.length; i++){
                // check for searchText in Title (when I add it)
                // check for searchText in nodes
                const currTree = pages[i].node;
                if(traverseTree_Filters(selectedFilters, currTree)){
                    filteredDays.push(pages[i]);
                }
            }

            setFilteredArray(filteredDays);
            setShowFilteredArray(true);
        }
    }



  return (
    <>
        <div class="bg-[#F1E8D7] w-full h-screen p-5">
            <div class="flex gap-3 w-full">
                <div class="flex flex-col gap-3 w-[50%] h-[95vh]">
                    
                    <div class="relative bg-[#FAF6EC] w-full h-[100px] border-[#746C59] border-[2px] flex items-center p-3">
                        <form onSubmit={(e) => searchForDays(e)}>
                            <input value={searchText} onChange={(e) => setSearchText(e.target.value)} className='caretClass w-full text-3xl text-[#746C59] bg-transparent focus:outline-none caret-[#746C59]' placeholder='Search For Text' />
                        </form>
                        <div onClick={() => setMenuOpen(!menuOpen)} class="hover:cursor-pointer absolute right-0 flex items-center justify-center border-[#746C59] border-l-[2px] w-[100px] h-full bg-[#EFE2C0]">
                            <p class="text-4xl text-[#746C59]">{menuOpen === false ? <IoIosArrowDropdown /> : <IoIosArrowDropup />}</p>
                        </div>
                    </div>

                    {menuOpen ? <div class='relative mb-[150px]'>
                        <div class="bg-[#FAF6EC] flex flex-col w-[100px] absolute right-0 border-[#746C59] border-[2px] justify-end">
                            <h1 onClick={() => selectFilter("tag")} class='hover:bg-[#746C59] hover:text-[#FAF6EC] font-semibold text-[#746C59] border-b-2 border-b-[#746C59] p-2 hover:cursor-pointer'>Tag</h1>
                            <h1 onClick={() => selectFilter("mood")} class='hover:bg-[#746C59] hover:text-[#FAF6EC] font-semibold text-[#746C59] border-b-2 border-b-[#746C59] p-2 hover:cursor-pointer'>Mood</h1>
                            <h1 onClick={() => resetFilters()} class='hover:bg-[#746C59] hover:text-[#FAF6EC] font-semibold text-[#746C59] p-2 hover:cursor-pointer'>Reset Filters</h1>
                        </div>
                    </div> : null}
                    
                    {selectedFilter === "tag" || selectedFilter === "mood" ? 
                        <FilterBox addSelectedMood={addSelectedMood} addSelectedTag={addSelectedTag} selectedFilters={selectedFilters} isTagFilter={selectedFilter === "tag" ? true : false} isMoodFilter={selectedFilter === "mood" ? true : false} tags={tags} moods={moods} />
                    : null}
                    
                    <div class="overflow-scroll no-scrollbar bg-[#FAF6EC] h-full border-[#746C59] border-[2px] flex flex-col gap-3 p-3 text-[#746C59]">

                        <div onClick={onOpen} class="hover:cursor-pointer rounded-full ml-6 w-[60px] border-2 border-[#746C59] h-[60px] bg-[#EEE1BF] flex items-center justify-center">
                            <h1 class="text-3xl"><FaPlus /></h1>
                        </div>
                        
                        {showFilteredArray === false ? pages.map((page) => (
                            <div key={page.id} onClick={() => setSelectedDayBar(page.id)}><DayBar page={page} highlighted={page.id === selectedDayBar} /></div>
                        )) : filteredArray.map((page) => (
                            <div key={page.id} onClick={() => setSelectedDayBar(page.id)}><DayBar page={page} highlighted={page.id === selectedDayBar} /></div>
                        ))}
                    
                    </div>
                </div>
                
                <div class="relative flex flex-col w-[50%] h-[95vh] bg-[#FAF6EC] border-[#746C59] border-[2px] p-2">
                    <div className="absolute top-[10px] left-[10px] flex gap-2">
                        <Tooltip label='Tree View' bg='#746C59' textColor='#EEE1BF'>
                            <p className='hover:cursor-pointer p-2 rounded-md bg-[#EEE1BF] text-[#746C59] border-2 border-[#746C59]'><ImTree /></p>
                        </Tooltip>
                        
                        <Tooltip label='Text View' bg='#746C59' textColor='#EEE1BF'>
                            <p className='hover:cursor-pointer p-2 rounded-md bg-[#EEE1BF] text-[#746C59] border-2 border-[#746C59]'><IoIosPaper /></p>
                        </Tooltip>
                    </div>

                    <div className="absolute top-[10px] right-[10px] flex gap-2">
                        <Tooltip label='Enlarge' bg='#746C59' textColor='#EEE1BF'>
                            <p className='hover:cursor-pointer p-2 rounded-md bg-[#EEE1BF] text-[#746C59] border-2 border-[#746C59]'><ImEnlarge2 /></p>
                        </Tooltip>
                    </div>
                    <div class="w-full h-[40px] flex items-center justify-center">
                        <h1 class="font-semibold text-[#746C59] underline text-xl">{pages[selectedDayBar].date}</h1>
                    </div>
                    {selectedDayBar != null ? <div className='mt-[10%]'><Tree label={""} lineWidth='3px' lineColor='#b794ec' lineBorderRadius='10px'>{showTree(pages[selectedDayBar].node)}</Tree></div> : null}
                </div>
            </div>
            </div>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Day Info</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="flex flex-col gap-5">
                            <Input onChange={(e) => setPageTitle(e.target.value)} placeholder='Enter Title' />
                            <Textarea onChange={(e) => setPageDetails(e.target.value)} placeholder='Enter Overview'/>
                            <Button onClick={() => addNewDay()} colorScheme='green' variant='outline'>Confirm</Button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {/* Add the footer for your mood modal here */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
    </>
  )
}

export default MainPage