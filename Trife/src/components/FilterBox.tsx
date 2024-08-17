import {React, useRef} from "react";
import Draggable from 'react-draggable';

import { Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

import { IoClose, IoCloseOutline } from "react-icons/io5";

const FilterBox = ({
  isTagFilter,
  isMoodFilter,
  tags,
  moods,
  selectedFilters,
  addSelectedTag,
  addSelectedMood,
  setSelectedFilter
}) => {


  const binRef = useRef(null);

  const handleStop = (e, data, tag) => {
    // Get the bin element's bounding rectangle
    const binRect = binRef.current.getBoundingClientRect();

    const draggedRect = e.target.getBoundingClientRect();

    console.log('stopped', draggedRect.left + window.scrollX, binRect.left + window.scrollX, draggedRect.top + window.scrollY, binRect.top + window.scrollY);

    const isOverBin = !(
      draggedRect.right < binRect.left ||
      draggedRect.left > binRect.right ||
      draggedRect.bottom < binRect.top ||
      draggedRect.top > binRect.bottom
    );
  
    if (isOverBin) {
      //setTags(tags.filter((t) => t !== tag));
      console.log('deleted', tag);
      // Optionally, you can implement further deletion logic here.
    }
  };

  // future: <p ref={binRef} className="absolute right-5 top-[50%] w-[50px] h-[30px] bg-red-200 text-center">Bin</p>


  return (
    <>
      <div class="bg-[#FAF6EC] w-[100%] h-[150px] border-[#746C59] border-[2px] flex p-3 rounded-md relative">
        <div class="flex flex-col gap-5">
          <h1 class="text-[#746C59] text-2xl">
            Filter By {isTagFilter ? "Tag" : "Mood"}
          </h1>
          <p onClick={() => setSelectedFilter("")} className="absolute top-3 right-5 text-3xl text-[#746C59] hover:cursor-pointer">
            <IoCloseOutline />
          </p>
          <div class="flex gap-3 items-center">
            {isTagFilter
              ? tags.map((tag) => (
                  <Tag
                    size="lg"
                    borderRadius="full"
                    variant="solid"
                    colorScheme={tag[1]}
                    className="hover:cursor-pointer"
                    onClick={() => addSelectedTag(tag)}
                  >
                    <TagLabel>{tag[0]}</TagLabel>
                    {selectedFilters.includes(tag) ? <TagCloseButton /> : null}
                  </Tag>
                ))
              : moods.map((mood) => (
                  <div
                    onClick={() => addSelectedMood(mood)}
                    className="hover:cursor-pointer flex gap-2 p-2 bg-[#EEE1BF] border-[#746C59] border-2 rounded-md items-center justify-center"
                  >
                    <p className="">{mood}</p>
                    {selectedFilters.includes(mood) ? (
                      <p className="text-red-500 font-bold">
                        <IoClose />
                      </p>
                    ) : null}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterBox;
