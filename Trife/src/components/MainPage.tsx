import React, { useState } from "react";
import { Tree } from "react-organizational-chart";
import DayBar from "./DayBar";
import { Tag, TagLabel, TagCloseButton, Textarea } from "@chakra-ui/react";
import { IoIosArrowDropdown, IoIosArrowDropup, IoMdHelp } from "react-icons/io";
import { IoMenu, IoSettingsSharp, IoHome } from "react-icons/io5";
import {
  FaPlus,
  FaCalendarAlt,
  FaUser,
  FaShoppingBasket,
  FaLink
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
import { IoIosPaper } from "react-icons/io";
import FilterBox from "./FilterBox";
import Calendar from "react-calendar";
import TextView from "./TextView";
import { node, page, startNode } from "../App.tsx";
import ChainViewTree from "./ChainViewTree.tsx";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

//! Reverse order of pages in order to show latest day on top
//! Add New Node Type -> Retrospect. To show what you would have done differently in retrospect and how it could / would have gone
//! Add starred option to pages on day bar to star certain days

//* Allow filtering by month of the year on calender month click [DONE]
//* Left Click open info about node, right click -> manage node [DONE]
//* Add expand icon on top right [DONE]
//* Make DayBar container scrollable [DONE]
//* Node Info Modal should have Following: [DONE]
//* - General Text Entry [DONE]
//* - Image Gallery [DONE]
//* - Show All The Selected Tags for the Node [DONE]

const MainPage = ({ pages, showTree, setPages, tags, moods }) => {
  const [selectedDayBar, setSelectedDayBar] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<string>(""); // "tag", "mood", etc -> determines what filter menu to open
  const [selectedFilters, setSelectedFilters] = useState([]); // STORES ALL FILTERS (TAGS, MOODS, ETC)
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [filteredArray, setFilteredArray] = useState([]); // if searchText != "" and or filters filters present
  const [showFilteredArray, setShowFilteredArray] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string>("");
  const [pageDetails, setPageDetails] = useState<string>("");
  const [calendarDate, setCalendarDate] = useState<Value>(new Date());
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [dateToAdd, setDateToAdd] = useState<string>(null);
  const [treeView, setTreeView] = useState<boolean>(true);
  const [filteredMonths, setFilteredMonths] = useState([]);
  const [showFilteredMonths, setShowFilteredMonths] = useState(false);
  const [chainView, setChainView] = useState(false);
  const [currFilteredMonth, setCurrFilteredMonth] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

  const toast = useToast();

  const TestDate = "03/01/2024"; //! replace w/ curr date

  const monthMap = {'01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', 
                    '05': 'May', '06': 'Jun', '07': 'Jul', 
                    '08': 'Aug', '09': 'Sep', 
                    '10': 'Oct', '11': 'Nov', '12': 'Dec'}

  const addNewDay = (dateToAdd = null) => {
    for (let i = 0; i < pages.length; i++) {
      if (dateToAdd === null) {
        if (pages[i].date === TestDate) {
          alert("Already Have An Entry Today!");
          return;
        }
      } else {
        if (pages[i].date == dateToAdd) {
          alert("Already Have An Entry Today!");
        }
      }
    }

    const newDay: page = {
      id: pages.length,
      date: dateToAdd === null ? TestDate : dateToAdd, // curr date if no dateToAdd param
      node: structuredClone(startNode),
      title: pageTitle,
      details: pageDetails,
    };

    toast({
      position: "top",
      title: "New Entry Added!",
      description: dateToAdd === null ? TestDate : dateToAdd,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setPageDetails("");
    setPageTitle("");
    setPages([...pages, newDay]);
    setSelectedDayBar(pages.length); //^ set selected day bar (page) to newly added one
    setDateToAdd(null);
    onClose();
  };

  const resetFilters = () => {
    setFilteredArray([]);
    setSearchText("");
    setMenuOpen(false);
    setShowFilteredArray(false);
    setSelectedFilters([]);
    removeMonthFilter();
  };

  const addSelectedTag = (selectedTag) => {
    if (selectedFilters.includes(selectedTag) == false) {
      setSelectedFilters([...selectedFilters, selectedTag]);
    } else {
      setSelectedFilters(selectedFilters.filter((curr) => curr != selectedTag));
    }
  };

  const addSelectedMood = (selectedMood) => {
    if (selectedFilters.includes(selectedMood) == false) {
      setSelectedFilters([...selectedFilters, selectedMood]);
    } else {
      setSelectedFilters(
        selectedFilters.filter((curr) => curr != selectedMood)
      );
    }
  };

  const selectFilter = (filter) => {
    //? Show all selected tags and moods somewhere - new div left of dropdown showing all selected filtered items
    setMenuOpen(false);
    setSelectedFilter(filter);
  };

  const traverseTree_SearchText = (searchText, node) => {
    const lowercaseValue = node.value.toLowerCase();
    const lowercaseNodeDetails = node.details.toLowerCase();
    if (
      lowercaseValue.includes(searchText) ||
      lowercaseNodeDetails.includes(searchText)
    ) {
      console.log("FOUND!", node);
      return true;
    }

    if (Array.isArray(node.children)) {
      return node.children.some((child) =>
        traverseTree_SearchText(searchText, child)
      );
    }

    return false;
  };

  const traverseTree_Filters = (filters, node) => {
    console.log(node, node.mood);
    for (let i = 0; i < filters.length; i++) {
      const currFilter = filters[i];
      if (node.tags.includes(currFilter) || node.mood.includes(currFilter)) {
        return true;
      }
    }

    if (Array.isArray(node.children)) {
      return node.children.some((child) =>
        traverseTree_Filters(filters, child)
      );
    }

    return false;
  };

  const searchForDays = (e) => {
    //! Add checking searchText in page.title and page.details [DONE]
    // if no, check if search string is non empty
    // if yes, search for all days where any node contains the search string

    e.preventDefault();

    const filteredDays = [];

    if (searchText === "" && selectedFilters.length == 0) { // No Filters + No Text = Reset Filters
      resetFilters();
    } else if (searchText != "" && selectedFilters.length == 0) {
      // search + no filters
      for (let i = 0; i < pages.length; i++) {
        // check for searchText in Title (when I add it) [DONE]
        // check for searchText in nodes [DONE]
        const currTree = pages[i].node;
        if (
          traverseTree_SearchText(searchText.toLowerCase(), currTree) ||
          pages[i].title.toLowerCase().includes(searchText.toLowerCase()) ||
          pages[i].details.toLowerCase().includes(searchText.toLowerCase())
        ) {
          filteredDays.push(pages[i]);
        }
      }
      console.log(filteredDays);
      setFilteredArray(filteredDays);
      setShowFilteredArray(true);
    } else if (searchText != "" && selectedFilters.length > 0) {
      // search with filters
      for (let i = 0; i < pages.length; i++) {
        // check for searchText in Title (when I add it) [DONE]
        // check for searchText in nodes [DONE]
        const currTree = pages[i].node;
        if (
          traverseTree_Filters(selectedFilters, currTree) === true &&
          (traverseTree_SearchText(searchText.toLowerCase(), currTree) ||
            pages[i].title.toLowerCase().includes(searchText.toLowerCase()) ||
            pages[i].details.toLowerCase().includes(searchText.toLowerCase()))
        ) {
          filteredDays.push(pages[i]);
        }
      }

      setFilteredArray(filteredDays);
      setShowFilteredArray(true);
    } else if (searchText === "" && selectFilter.length > 0) {
      // no search + filters
      for (let i = 0; i < pages.length; i++) {
        const currTree = pages[i].node;
        if (traverseTree_Filters(selectedFilters, currTree)) {
          filteredDays.push(pages[i]);
        }
      }

      setFilteredArray(filteredDays);
      setShowFilteredArray(true);
    }
  };

  const convertDateFormat = (date) => {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = dd + "/" + mm + "/" + yyyy;

    return formattedToday;
  };

  const addPageWithCalendar = (date) => {
    const formattedToday = convertDateFormat(date);

    for (let i = 0; i < pages.length; i++) {
      if (pages[i].date == formattedToday) {
        console.log("Date Already Stored", pages[i].date);
        setSelectedDayBar(i); // set current page to selected calendar date
        return;
      }
    }

    setDateToAdd(formattedToday);
    onOpen();
  };

  const filterByMonth = (date) => {
    const formattedDate = convertDateFormat(date);
    const dateToCheck = formattedDate.substring(3, 10); // month and year we are looking for (e.g "02/2024")

    const monthsFiltered = [];

    for (let i = 0; i < pages.length; i++) {
      if (pages[i].date.includes(dateToCheck)) {
        monthsFiltered.push(pages[i]);
      }
    }

    setFilteredMonths(monthsFiltered);
    setShowFilteredMonths(true);
    setCurrFilteredMonth(dateToCheck);
  };

  const closeDayModal = () => {
    setDateToAdd(null);
    onClose();
  };

  function getArrayIntersection(arr1, arr2) {
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

  const removeMonthFilter = () => {
    setFilteredMonths([]);
    setShowFilteredMonths(false);
    setCurrFilteredMonth("");
  };

  const renderFilters = () => {
    if (showFilteredArray && showFilteredMonths) {
      return getArrayIntersection(filteredArray, filteredMonths).map((page) => (
        <div key={page.id} onClick={() => setSelectedDayBar(page.id)}>
          <DayBar page={page} highlighted={page.id === selectedDayBar} />
        </div>
      ));
    } else {
      if (showFilteredArray) {
        return filteredArray.map((page) => (
          <div key={page.id} onClick={() => setSelectedDayBar(page.id)}>
            <DayBar page={page} highlighted={page.id === selectedDayBar} />
          </div>
        ));
      }

      if (showFilteredMonths) {
        return filteredMonths.map((page) => (
          <div key={page.id} onClick={() => setSelectedDayBar(page.id)}>
            <DayBar page={page} highlighted={page.id === selectedDayBar} />
          </div>
        ));
      } else {
        return pages.map((page) => (
          <div key={page.id} onClick={() => setSelectedDayBar(page.id)}>
            <DayBar page={page} highlighted={page.id === selectedDayBar} />
          </div>
        ));
      }
    }
  };



  const renderChainView = () => {
    if (showFilteredArray && showFilteredMonths) {
      return getArrayIntersection(filteredArray, filteredMonths).map((page) => (
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

  return (
    <>
      <div class="bg-[#F1E8D7] w-full h-screen p-5 font-dmMono">
        <p
          onClick={onOpenDrawer}
          className="text-3xl fixed top-1 left-5 text-[#746C59] hover:cursor-pointer"
        >
          <IoMenu />
        </p>
        <div class="flex gap-3 w-full">
          <div class="flex flex-col gap-3 w-[50%] h-[95vh] mt-4">
            <div class="relative bg-[#FAF6EC] w-full h-[100px] border-[#746C59] border-[2px] flex items-center p-3 rounded-md font-bold">
              <form className="w-full" onSubmit={(e) => searchForDays(e)}>
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="caretClass w-full text-3xl text-[#746C59] bg-transparent focus:outline-none caret-[#746C59]"
                  placeholder="Search For Text"
                />
              </form>
              <div
                onClick={() => setMenuOpen(!menuOpen)}
                class="rounded-md hover:cursor-pointer absolute right-0 flex items-center justify-center border-[#746C59] border-l-[2px] w-[100px] h-full bg-[#EFE2C0]"
              >
                <p class="text-4xl text-[#746C59]">
                  {menuOpen === false ? (
                    <IoIosArrowDropdown />
                  ) : (
                    <IoIosArrowDropup />
                  )}
                </p>
              </div>
            </div>

            {menuOpen ? (
              <div class="relative mb-[150px]">
                <div class="rounded-md bg-[#FAF6EC] flex flex-col w-[100px] absolute right-0 border-[#746C59] border-[2px] justify-end">
                  <h1
                    onClick={() => selectFilter("tag")}
                    class="hover:bg-[#746C59] hover:text-[#FAF6EC] font-semibold text-[#746C59] border-b-2 border-b-[#746C59] p-2 hover:cursor-pointer"
                  >
                    Tag
                  </h1>
                  <h1
                    onClick={() => selectFilter("mood")}
                    class="hover:bg-[#746C59] hover:text-[#FAF6EC] font-semibold text-[#746C59] border-b-2 border-b-[#746C59] p-2 hover:cursor-pointer"
                  >
                    Mood
                  </h1>
                  <h1
                    onClick={() => resetFilters()}
                    class="hover:bg-[#746C59] hover:text-[#FAF6EC] font-semibold text-[#746C59] p-2 hover:cursor-pointer"
                  >
                    Reset Filters
                  </h1>
                </div>
              </div>
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
              />
            ) : null}

            <div class="relative rounded-md overflow-scroll no-scrollbar bg-[#FAF6EC] h-full border-[#746C59] border-[2px] flex flex-col gap-3 p-3 text-[#746C59]">
              <div className="flex items-center justify-between">
                <div
                  onClick={onOpen}
                  class="hover:cursor-pointer rounded-full ml-6 w-[60px] border-2 border-[#746C59] h-[60px] bg-[#EEE1BF] flex items-center justify-center"
                >
                  <Tooltip label="Add Day" bg="#746C59" textColor="#EEE1BF">
                    <p class="text-3xl">
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
                    <TagLabel>{monthMap[currFilteredMonth.substring(0, 2)]} - {currFilteredMonth.substring(3, 7)}</TagLabel>
                    {showFilteredMonths ? <TagCloseButton /> : null}
                  </Tag>
                ) : null}
                <div
                  onClick={() => setCalendarOpen(!calendarOpen)}
                  class="hover:cursor-pointer rounded-full mr-6 w-[60px] border-2 border-[#746C59] h-[60px] bg-[#EEE1BF] flex items-center justify-center"
                >
                  <Tooltip label="Calendar" bg="#746C59" textColor="#EEE1BF">
                    <p class="text-3xl">
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

              {renderFilters()}
            </div>
          </div>

          <div
            class={`relative flex flex-col w-[50%] h-[95vh] mt-4 ${
              treeView === true ? "treeViewBG" : "bg-[#FAF6EC]"
            } rounded-md border-[#746C59] border-[2px] p-2 overflow-scroll no-scrollbar`}
          >
            <div className="absolute top-[10px] left-[10px] flex gap-2">
              <Tooltip label="Tree View" bg="#746C59" textColor="#EEE1BF">
                <p
                  onClick={() => setTreeView(true)}
                  className="hover:cursor-pointer p-2 rounded-md bg-[#EEE1BF] text-[#746C59] border-2 border-[#746C59]"
                >
                  <ImTree />
                </p>
              </Tooltip>

              <Tooltip label="Text View" bg="#746C59" textColor="#EEE1BF">
                <p
                  onClick={() => setTreeView(false)}
                  className="hover:cursor-pointer p-2 rounded-md bg-[#EEE1BF] text-[#746C59] border-2 border-[#746C59]"
                >
                  <IoIosPaper />
                </p>
              </Tooltip>
            </div>
            
            {treeView ? (
              <>
                <div className="absolute top-[10px] right-[10px] flex gap-2">
                  <Tooltip label="Enlarge" bg="#746C59" textColor="#EEE1BF">
                    <p className="hover:cursor-pointer p-2 rounded-md bg-[#EEE1BF] text-[#746C59] border-2 border-[#746C59]">
                      <ImEnlarge2 />
                    </p>
                  </Tooltip>
                  <Tooltip label="Chain" bg="#746C59" textColor="#EEE1BF">
                    <p onClick={() => setChainView(!chainView)} className="hover:cursor-pointer p-2 rounded-md bg-[#EEE1BF] text-[#746C59] border-2 border-[#746C59]">
                      <FaLink />
                    </p>
                  </Tooltip>
                </div>
                <div class="w-full h-[40px] flex items-center justify-center">
                  <h1 class="font-semibold text-[#746C59] underline text-xl">
                    {chainView === false ? pages[selectedDayBar].date : null}
                  </h1>
                </div>
                {chainView === true ? <div className='mt-[5%] flex flex-col gap-10'>{renderChainView()}</div> : selectedDayBar != null ? (
                  <div className="mt-[10%]">
                    <Tree
                      label={""}
                      lineWidth="3px"
                      lineColor="#b794ec"
                      lineBorderRadius="10px"
                    >
                      {showTree(pages[selectedDayBar].node)}
                    </Tree>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex mt-[10%] ml-[5%]">
                <TextView />
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => closeDayModal()}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Add Day Info - {dateToAdd !== null ? dateToAdd : TestDate}
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
          <DrawerHeader>Hey Miran!</DrawerHeader>

          <DrawerBody>
            <div className="flex flex-col gap-5">
              <Button leftIcon={<IoHome />}>Home</Button>
              <Button leftIcon={<FaUser />}>Profile</Button>
              <Button leftIcon={<FaShoppingBasket />} colorScheme="green">
                Shop
              </Button>
              <Button leftIcon={<IoMdHelp />} colorScheme="yellow">
                Help
              </Button>
              <Button
                leftIcon={<IoSettingsSharp />}
                colorScheme="blue"
                variant="outline"
              >
                Settings
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
