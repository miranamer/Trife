import React, { useState, useEffect } from "react";
import { Tree } from "react-organizational-chart";
import DayBar from "./DayBar";
import { Tag, TagLabel, TagCloseButton, Textarea } from "@chakra-ui/react";
import { IoIosArrowDropdown, IoIosArrowDropup, IoMdHelp } from "react-icons/io";
import { IoMenu, IoSettingsSharp, IoHome, IoLogOut, IoSparkles } from "react-icons/io5";
import {
  FaPlus,
  FaCalendarAlt,
  FaUser,
  FaShoppingBasket,
  FaLink,
} from "react-icons/fa";
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
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useToast,
} from "@chakra-ui/react";

import { ImTree, ImEnlarge2 } from "react-icons/im";
import { MdDeleteForever } from "react-icons/md";
import { IoIosPaper } from "react-icons/io";
import FilterBox from "./FilterBox";
import Calendar from "react-calendar";
import TextView from "./TextView";
import { node, page, startNode } from "../App.tsx";
import ChainViewTree from "./ChainViewTree.tsx";

import newDayAddedSoundEffect from "../assets/dayAddedSoundEffect.mp3";
import dayBarClickedSoundEffect from "../assets/dayBarClickedSoundEffect.mp3";
import deleteDaySoundEffect from "../assets/deleteDaySoundEffect.mp3";

import { supabaseClient } from "../config/supabase-client";
import { Session } from "@supabase/supabase-js";

//utils
import { orderDatesDescending } from "../utils/utils.ts";

//store
import { usePageStore } from "../store/page-store.ts";
import SearchBar from "./SearchBar";
import SearchBarDropDown from "./SearchBarDropDown.tsx";
import SquareTooltipButton from "./SquareTooltipButton.tsx";
import AiAdviceBox from "./AiAdviceBox.tsx";

//! Add New Node Type -> Retrospect. To show what you would have done differently in retrospect and how it could / would have gone
//! Find way to truncate tree so it does not go past page width and height in non-expanded tree view

//* Allow filtering by month of the year on calender month click [DONE]
//* Left Click open info about node, right click -> manage node [DONE]
//* Add expand icon on top right [DONE]
//* Make DayBar container scrollable [DONE]
//* Node Info Modal should have Following: [DONE]
//* - General Text Entry [DONE]
//* - Image Gallery [DONE]
//* - Show All The Selected Tags for the Node [DONE]
//* Chain trees to show all trees in one go [DONE]
//* Make dayBar's ordered based on date not just reversed order of arr [DONE]

type MainPageProps = {
  showTree: JSX.Element;
  tags: string[][];
  moods: string[];
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const MainPage = ({
  showTree,
  tags,
  moods,
}: MainPageProps) => {
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  //! Main Page Local State

  const [selectedFilter, setSelectedFilter] = useState<string>(""); // "tag", "mood", etc -> determines what filter menu to open
  const [selectedFilters, setSelectedFilters] = useState([]); // STORES ALL FILTERS (TAGS, MOODS, ETC)
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // determines if tag, mood dropdown menu is open
  const [searchText, setSearchText] = useState<string>(""); // search text input
  const [filteredArray, setFilteredArray] = useState([]); // array of pages that match search text and filters
  const [showFilteredArray, setShowFilteredArray] = useState<boolean>(false); // determines if filteredArray should be shown
  const [pageTitle, setPageTitle] = useState<string>(""); // title of page to add
  const [pageDetails, setPageDetails] = useState<string>(""); // details of page to add
  const [calendarDate, setCalendarDate] = useState<Value>(new Date()); // date selected from calendar
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false); // determines if calendar is open
  const [dateToAdd, setDateToAdd] = useState<string | null>(null); // date to add page to
  const [treeView, setTreeView] = useState<boolean>(true); // determines if tree view is shown
  const [filteredMonths, setFilteredMonths] = useState([]); // stores pages filtered by month
  const [showFilteredMonths, setShowFilteredMonths] = useState(false); // determines if filteredMonths should be shown
  const [chainView, setChainView] = useState(false); // determines if chain view is shown
  const [currFilteredMonth, setCurrFilteredMonth] = useState(""); // stores month/year selected from calender
  const [session, setSession] = useState<Session | null>(); // supabase session creds
  const [aiResponse, setAiResponse] = useState<string>("");

  const {pagePtr, pages, setPagePtr, setPages} = usePageStore((state) => (
    {
    pagePtr: state.pagePtr,
    pages: state.pages,
    setPagePtr: state.setPagePtr,
    setPages: state.setPages
    }
  ));

  const { isOpen, onOpen, onClose } = useDisclosure(); // modal to add new page
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure(); // sidebar to show user options

  const toast = useToast();

  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // padStart adds 0 padding from the start of string to ensure len is 2
  const dd = String(today.getDate()).padStart(2, "0");
  const yyyy = today.getFullYear();

  const currentDate = `${dd}/${mm}/${yyyy}`; // e.g. 02/01/2024

  const monthMap = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };

  //! Main Page Functions Below:

  //^ adds a new day (page) to pages table and pages local state
  const addNewDay = async (dateToAdd: string | null = null) => {
    for (let i = 0; i < pages.length; i++) {
      // checking if entry on the curr day already exists
      if (dateToAdd === null) {
        if (pages[i]["date"] === currentDate) {
          // clicking the ADD button to add entry for current date
          alert("Already Have An Entry Today!");
          return;
        }
      } else {
        if (pages[i]["date"] == dateToAdd) {
          alert("Already Have An Entry Today!");
        }
      }
    }

    const newDay: page = {
      userID: session?.user.id,
      date: dateToAdd === null ? currentDate : dateToAdd, // curr date if no dateToAdd param
      node: structuredClone(startNode),
      title: pageTitle,
      details: pageDetails,
    };

    let newPageID = null;

    const { data, error } = await supabaseClient
      .from("Pages") // Specify the table name
      .insert([newDay])
      .select(); // This retrieves the inserted record(s) with their IDs

    if (error) {
      console.error("Error inserting page:", error);
      return null;
    } else {
      const insertedPage = data[0]; // Assuming you inserted a single record
      newPageID = insertedPage.id; // This is the ID of the newly inserted page
      setPagePtr(newPageID);
    }

    toast({
      position: "top",
      title: pageTitle,
      description: dateToAdd === null ? currentDate : dateToAdd,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    newDay.id = newPageID;

    const updatedPages = [newDay, ...pages];

    updatedPages.sort(orderDatesDescending);

    new Audio(newDayAddedSoundEffect).play();
    setPageDetails("");
    setPageTitle("");
    setPages(updatedPages);
    //window.localStorage.setItem('pages', JSON.stringify([...pages, newDay]));
    //setSelectedDayBar(newPageID); //* Sets selected day bar (entry) to newly added one
    //setPagePtr(newPageID);
    setDateToAdd(null);
    onClose();
  };

  //^ deletes the currently selected day (page) from pages table and from local state
  const deleteDay = async (pageID: number) => {
    new Audio(deleteDaySoundEffect).play();

    const { data, error } = await supabaseClient
      .from("Pages") // Specify the table name
      .delete()
      .eq("id", pageID); // Use the page ID to identify the record

    if (error) {
      console.error("Error deleting page:", error);
    } else {
      console.log("Page deleted successfully:", data);
    }

    setPages(pages.filter((page) => page.id !== parseInt(pageID)));
  };

  //^ resets all filters back
  const resetFilters = () => {
    setFilteredArray([]);
    setSearchText("");
    setMenuOpen(false);
    setShowFilteredArray(false);
    setSelectedFilters([]);
    removeMonthFilter();
  };

  //^ adds the clicked tag to the selected filters array to allow filtering of pages with that tag
  const addSelectedTag = (selectedTag: string[]) => {
    if (selectedFilters.includes(selectedTag) == false) {
      setSelectedFilters([...selectedFilters, selectedTag]); // add to curr selected filters if not already in
    } else {
      setSelectedFilters(selectedFilters.filter((curr) => curr != selectedTag)); // remove if already in
    }
  };

  //^ adds the clicked mood to the selected filters array to allow filtering of pages by that mood
  const addSelectedMood = (selectedMood: string) => {
    if (selectedFilters.includes(selectedMood) == false) {
      setSelectedFilters([...selectedFilters, selectedMood]);
    } else {
      setSelectedFilters(
        selectedFilters.filter((curr) => curr != selectedMood)
      );
    }
  };

  //^ sets selectedFilter to either tag or mood based on what option was clicked. Then appropriate filter box is opened
  const selectFilter = (filter) => {
    //? Show all selected tags and moods somewhere - new div left of dropdown showing all selected filtered items
    setMenuOpen(false); // closes tag, mood option dropdown menu
    setSelectedFilter(filter);
  };

  //^ recursively traverses nodes to find searchText parameter in trees
  const traverseTreeSearchText = (searchText: string, node: node) => {
    searchText = searchText.toLowerCase();

    const lowercaseValue = node["value"].toLowerCase();
    const lowercaseNodeDetails = node["details"].toLowerCase();

    if (
      lowercaseValue.includes(searchText) ||
      lowercaseNodeDetails.includes(searchText)
    ) {
      return true;
    }

    for (let i = 0; i < node["children"].length; i++) {
      if (traverseTreeSearchText(searchText, node["children"][i])) {
        return true;
      }
    }

    return false;
  };

  //^ recursively traverses nodes to find if they contain any of the selected filters (tags, moods)
  const traverseTreeFilters = (filters: any[], node: node) => {
    for (let i = 0; i < filters.length; i++) {
      const currFilter = filters[i];

      for (let i = 0; i < node["tags"].length; i++) {
        // Checking if any tags on current node == currFilter (which may be a tag or mood)
        if (
          node["tags"][i][0] == currFilter[0] &&
          node["tags"][i][1] == currFilter[1]
        ) {
          return true;
        }
      }

      for (let i = 0; i < node["mood"].length; i++) {
        // Checking if node mood is equal to currFilter
        if (node["mood"].includes(currFilter)) {
          return true;
        }
      }
    }

    for (let i = 0; i < node["children"].length; i++) {
      if (traverseTreeFilters(filters, node["children"][i])) {
        return true;
      }
    }

    return false;
  };

  //^ called when clicking enter in the search bar -> sets filteredArray to array of filtered pages to show correct pages based on filters and or text
  const searchForDays = (e) => {
    e.preventDefault();

    const filteredDays = [];

    if (searchText === "" && selectedFilters.length == 0) {
      //? No Filters + No Text = Reset Filters
      resetFilters();
    } else if (searchText != "" && selectedFilters.length == 0) {
      //? Search Text + No Filters -> looking for text in tree, title + details
      for (let i = 0; i < pages.length; i++) {
        const currTree = pages[i]["node"];
        if (
          traverseTreeSearchText(searchText.toLowerCase(), currTree) ||
          pages[i]["title"].toLowerCase().includes(searchText.toLowerCase()) ||
          pages[i]["details"].toLowerCase().includes(searchText.toLowerCase())
        ) {
          filteredDays.push(pages[i]);
        }
      }
      setFilteredArray(filteredDays); // Output array with all the pages that have the inputted search text
      setShowFilteredArray(true);
    } else if (searchText != "" && selectedFilters.length > 0) {
      //? Search Text + Filter(s)
      for (let i = 0; i < pages.length; i++) {
        const currTree = pages[i]["node"];

        if (
          traverseTreeFilters(selectedFilters, currTree) === true &&
          (traverseTreeSearchText(searchText.toLowerCase(), currTree) ||
            pages[i]["title"]
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            pages[i]["details"]
              .toLowerCase()
              .includes(searchText.toLowerCase()))
        ) {
          filteredDays.push(pages[i]);
        }
      }

      setFilteredArray(filteredDays);
      setShowFilteredArray(true);
    } else if (searchText === "" && selectFilter.length > 0) {
      //? No Search Text + Filters Present
      for (let i = 0; i < pages.length; i++) {
        const currTree = pages[i]["node"];
        if (traverseTreeFilters(selectedFilters, currTree)) {
          filteredDays.push(pages[i]);
        }
      }

      setFilteredArray(filteredDays);
      setShowFilteredArray(true);
    }
  };

  //^ converts date object to correct format with zero padding
  const convertDateFormat = (date: Date) => {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = "0" + dd; // adding zero padding
    if (mm < 10) mm = "0" + mm; // adding zero padding

    const formattedToday = dd + "/" + mm + "/" + yyyy;

    return formattedToday;
  };

  //^ called when clicking on a date from the calender. If no page w/ that date exists, modal to add it opens else that page is selected.
  const addPageWithCalendar = (date: Date) => {
    const formattedToday = convertDateFormat(date);

    for (let i = 0; i < pages.length; i++) {
      if (pages[i]["date"] == formattedToday) {
        //setSelectedDayBar(pages[i].id); // set current page to selected calendar date as it already exists
        setPagePtr(pages[i].id);
        return;
      }
    }

    setDateToAdd(formattedToday);
    onOpen(); // Open modal to add page title and details using calendar date
    setCalendarOpen(false); // Close calendar
  };

  //^ finds pages based on a month/year selected from calender (e.g. 10/2023 or 02/2020)
  const filterByMonth = (date: Date) => {
    const formattedDate = convertDateFormat(date);
    const dateToCheck = formattedDate.substring(3, 10); // month and year we are looking for (e.g "02/2024")

    const monthsFiltered = [];

    for (let i = 0; i < pages.length; i++) {
      if (pages[i]["date"].includes(dateToCheck)) {
        monthsFiltered.push(pages[i]);
      }
    }

    setFilteredMonths(monthsFiltered);
    setShowFilteredMonths(true);
    setCurrFilteredMonth(dateToCheck);
  };

  //^ closes modal that allows you to add a new page
  const closeDayModal = () => {
    setDateToAdd(null);
    onClose();
  };

  //^ gets intersection of 2 arrays
  function getArrayIntersection(arr1: any[], arr2: any[]) {
    // Convert arrays to sets to remove duplicates
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    // Create an intersection set by filtering elements present in both sets
    const intersectionSet = new Set(
      [...set1].filter((value) => set2.has(value))
    );

    // Convert the intersection set back to an array
    const intersectionArray = Array.from(intersectionSet);

    return intersectionArray;
  }

  //^ removes any selected month/year filter
  const removeMonthFilter = () => {
    setFilteredMonths([]);
    setShowFilteredMonths(false);
    setCurrFilteredMonth("");
  };

  //^ play sound effect when clicking on a day bar (page)
  const playDayBarAudio = () => {
    new Audio(dayBarClickedSoundEffect).play();
  };

  //^ renders the correct pages based on all filters
  const displayPages = () => {
    if (pages.length == 0) {
      return null;
    }
    if (showFilteredArray && showFilteredMonths) {
      return;
      getArrayIntersection(filteredArray, filteredMonths).map((page) => (
        <div
          key={page["id"]}
          onClick={() => {
            playDayBarAudio();
            setPagePtr(page["id"]);
          }}
        >
          <DayBar page={page} highlighted={page["id"] === pagePtr} />
        </div>
      ));
    } else {
      if (showFilteredArray) {
        return filteredArray.map((page) => (
          <div
            key={page["id"]}
            onClick={() => {
              playDayBarAudio();
              setPagePtr(page["id"]);
            }}
          >
            <DayBar page={page} highlighted={page["id"] === pagePtr} />
          </div>
        ));
      }

      if (showFilteredMonths) {
        return filteredMonths.map((page) => (
          <div
            key={page["id"]}
            onClick={() => {
              playDayBarAudio();
              setPagePtr(page["id"]);
            }}
          >
            <DayBar page={page} highlighted={page["id"] === pagePtr} />
          </div>
        ));
      } else {
        return pages.map((page) => (
          <div
            key={page["id"]}
            onClick={() => {
              playDayBarAudio();
              setPagePtr(page["id"]);
            }}
          >
            <DayBar page={page} highlighted={page["id"] === pagePtr} />
          </div>
        ));
      }
    }
  };

  //^ renders the chain view (all pages on one page - chained together)
  const renderChainView = () => {
    if (pages.length == 0) {
      return null;
    }

    if (showFilteredArray && showFilteredMonths) {
      return;
      getArrayIntersection(filteredArray, filteredMonths).map((page) => (
        <ChainViewTree page={page} showTree={showTree} />
      ));
    } else {
      if (showFilteredArray) {
        return filteredArray.map((page) => (
          <ChainViewTree page={page} showTree={showTree} />
        ));
      }

      if (showFilteredMonths) {
        return filteredMonths.map((page) => (
          <ChainViewTree page={page} showTree={showTree} />
        ));
      } else {
        return pages.map((page) => (
          <ChainViewTree page={page} showTree={showTree} />
        ));
      }
    }
  };

  //^ determines whether to show chain view or normal tree view on right side of page and renders it
  const renderRightSide = () => {
    //? this is rendering text view and tree view
    if (pages.length == 0) {
      return null;
    }

    if (treeView) {
      // maybe turn this jsx into a component
      return (
        <>
          <div className="absolute top-[10px] right-[10px] flex gap-2">

          {pagePtr != -1 ?
          <>
            <SquareTooltipButton label="Chain View" toolTipBg="#746C59" toolTipTextColor="#EEE1BF" onClickFunction={() => setChainView(!chainView)} buttonBg="#EEE1BF" buttonTextColor="#746C59" Icon={FaLink} />
          </>
           : null}
          
          </div>
          
          <div class="w-full h-[40px] flex items-center justify-center">
            <h1 class="font-semibold text-[#746C59] underline text-xl">
              {pages.find((page) => page.id === pagePtr) != undefined
                ? chainView === false
                  ? pages.find((page) => page.id === pagePtr)["date"]
                  : null
                : null}
            </h1>
          </div>
          {chainView === true ? (
            <div className="mt-[5%] flex flex-col gap-10">
              {renderChainView()}
            </div>
          ) : pagePtr != null ? (
            <div className="mt-[10%]">
              <Tree
                label={""}
                lineWidth="3px"
                lineColor="#b794ec"
                lineBorderRadius="10px"
              >
                {pages.find((page) => page.id === pagePtr) != undefined
                  ? showTree(pages.find((page) => page.id === pagePtr)["node"])
                  : null}
              </Tree>
            </div>
          ) : null}
        </>
      );
    } else {
      return (
        <div className="flex mt-[10%] ml-[5%]">
          <TextView
            page={pages.find((page) => page.id === pagePtr)}
            selectedDayBar={pagePtr}
          />
        </div>
      );
    }
  };

  //^ logs user out of their account and redirects back to login page
  const LogOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  };

  const getAiResponse = async () => {
    try {
      const response = await fetch('http://localhost:5000/generateAiAdvice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: `${JSON.stringify(pages)}` })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setAiResponse(data["response"]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="bg-[#F1E8D7] w-full h-screen p-5 font-dmMono">
        <p
          onClick={onOpenDrawer}
          className="text-3xl fixed top-1 left-5 text-[#746C59] hover:cursor-pointer"
        >
          <IoMenu />
        </p>

        <div className="flex gap-3 w-full">
          <div className="flex flex-col gap-3 w-[50%] h-[95vh] mt-4">
            <SearchBar
              searchText={searchText}
              setSearchText={setSearchText}
              searchForDays={searchForDays}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
            />

            {menuOpen ? (
              <SearchBarDropDown
                selectFilter={selectFilter}
                resetFilters={resetFilters}
              />
            ) : null}

            {selectedFilter === "tag" || selectedFilter === "mood" ? (
              <FilterBox
                addSelectedMood={addSelectedMood}
                addSelectedTag={addSelectedTag}
                selectedFilters={selectedFilters}
                isTagFilter={selectedFilter === "tag" ? true : false}
                isMoodFilter={selectedFilter === "mood" ? true : false}
                tags={tags}
                moods={moods}
                setSelectedFilter={setSelectedFilter}
              />
            ) : null}

            <div className="relative rounded-md overflow-scroll no-scrollbar bg-[#FAF6EC] h-full border-[#746C59] border-[2px] flex flex-col gap-3 p-3 text-[#746C59]">
              <div className="flex items-center justify-between">
                <div
                  onClick={onOpen}
                  className="hover:cursor-pointer rounded-full ml-6 w-[60px] border-2 border-[#746C59] h-[60px] bg-[#EEE1BF] flex items-center justify-center"
                >
                  <Tooltip label="Add Day" bg="#746C59" textColor="#EEE1BF">
                    <p className="text-3xl">
                      <FaPlus />
                    </p>
                  </Tooltip>
                </div>

                {showFilteredMonths ? (
                  <Tag
                    size="lg"
                    borderRadius="full"
                    variant="solid"
                    colorScheme="yellow"
                    className="hover:cursor-pointer"
                    onClick={() => removeMonthFilter()}
                  >
                    <TagLabel>
                      {monthMap[currFilteredMonth.substring(0, 2)]} -{" "}
                      {currFilteredMonth.substring(3, 7)}
                    </TagLabel>
                    {showFilteredMonths ? <TagCloseButton /> : null}
                  </Tag>
                ) : null}

                <div
                  onClick={() => setCalendarOpen(!calendarOpen)}
                  className="hover:cursor-pointer rounded-full mr-6 w-[60px] border-2 border-[#746C59] h-[60px] bg-[#EEE1BF] flex items-center justify-center"
                >
                  <Tooltip label="Calendar" bg="#746C59" textColor="#EEE1BF">
                    <p className="text-3xl">
                      <FaCalendarAlt />
                    </p>
                  </Tooltip>
                </div>
              </div>

              {calendarOpen ? (
                <div className="flex w-[300px] absolute border-[#746C59] border-[2px] bg-white text-black p-2 rounded-md right-2 top-[10%]">
                  <Calendar
                    onClickDay={(value) => addPageWithCalendar(value)}
                    onChange={setCalendarDate}
                    value={calendarDate}
                    onClickMonth={(value) => filterByMonth(value)}
                  />
                </div>
              ) : null}

              {displayPages()}
            </div>
          </div>

          <div
            className={`relative flex flex-col w-[50%] h-[95vh] mt-4 ${
              treeView === true ? "treeViewBG" : "bg-[#FAF6EC]"
            } rounded-md border-[#746C59] border-[2px] p-2 overflow-scroll no-scrollbar`}
          >
            <div className="absolute top-[10px] left-[10px] flex gap-2">
              
              {pagePtr != -1 ? (<>
              <SquareTooltipButton label="Tree View" toolTipBg="#746C59" toolTipTextColor="#EEE1BF" onClickFunction={() => setTreeView(true)} buttonBg="#EEE1BF" buttonTextColor="#746C59" Icon={ImTree} />

              <SquareTooltipButton label="Text View" toolTipBg="#746C59" toolTipTextColor="#EEE1BF" onClickFunction={() => setTreeView(false)} buttonBg="#EEE1BF" buttonTextColor="#746C59" Icon={IoIosPaper} />
              
              <SquareTooltipButton label="Delete Page" toolTipBg="#746C59" toolTipTextColor="#eecabf" onClickFunction={() => deleteDay(pagePtr)} buttonBg="#eecabf" buttonTextColor="#746C59" Icon={MdDeleteForever} /></>) : null}

            </div>

            {renderRightSide()}
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => closeDayModal()}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Add Day Info - {dateToAdd !== null ? dateToAdd : currentDate}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col gap-5">
              <Input
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="Enter Title"
              />
              <Textarea
                onChange={(e) => setPageDetails(e.target.value)}
                placeholder="Enter Overview"
              />
              <Button
                onClick={() => addNewDay(dateToAdd)}
                colorScheme="green"
                variant="outline"
              >
                Confirm
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            {/* Add the footer for your mood modal here */}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Drawer isOpen={isOpenDrawer} placement="left" onClose={onCloseDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {session ? `Hey ${session.user.email}` : null}
          </DrawerHeader>

          <DrawerBody>
            <div className="flex flex-col gap-5">
              <Button
                leftIcon={<IoSparkles />}
                colorScheme="orange"
                onClick={() => getAiResponse()}
              >
                AI Advice
              </Button>

              {aiResponse != "" ? <AiAdviceBox responseText={aiResponse} setAiResponse={setAiResponse} /> : null}


              <Button
                leftIcon={<IoSettingsSharp />}
                colorScheme="blue"
              >
                Settings
              </Button>
              <Button
                onClick={() => LogOut()}
                leftIcon={<IoLogOut />}
                colorScheme="red"
                variant="outline"
              >
                Log Out
              </Button>
            </div>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onCloseDrawer}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MainPage;
