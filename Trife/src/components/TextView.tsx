import React, { useEffect, useState } from "react";
import { page } from "../App";

type TextViewProps = {
  page: page;
  selectedDayBar: number;
}

const TextView = ({ page, selectedDayBar } : TextViewProps) => {
  const [allMoods, setAllMoods] = useState([]); // bring moods in from zustand

  const getAllMoods = (node, arr) => {
    const currMood = node.mood;
    if (arr.includes(currMood) == false && currMood != "") {
      arr.push(currMood);
    }

    for (let i = 0; i < node.children.length; i++) {
      getAllMoods(node.children[i], arr);
    }
  };

  useEffect(() => {
    let newArr = [];
    getAllMoods(page.node, newArr);
    setAllMoods(newArr);
  }, [selectedDayBar]);

  return (
    <div>
      <div className="flex flex-col gap-[15vh]">
        <div className="">
          <h1 className="text-2xl underline">Day Overview</h1>
          <p className="mt-2">Here is some text of day overview</p>
        </div>

        <div className="flex flex-col mt-10">
          <h1 className="text-2xl underline">All Media</h1>
          <div className="flex items-center justify-center p-2 mt-10 w-[80vh]">
            <p>- Carousel Here -</p>
          </div>
        </div>

        <div className="flex gap-2 items-center justify-between w-[80vh] mt-10">
          <div className="">
            <h1 className="text-2xl underline">Moods</h1>
            <div className="flex gap-2 mt-2">
              {allMoods.map((mood) => (
                <div className="hover:cursor-pointer flex gap-2 p-2 bg-[#EEE1BF] border-[#746C59] border-2 rounded-md items-center justify-center">
                  {mood}
                </div>
              ))}
            </div>
          </div>

          <div className="">
            <h1 className="text-2xl underline">Counters</h1>
            <p className="mt-2">All Day's Counters Here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextView;
