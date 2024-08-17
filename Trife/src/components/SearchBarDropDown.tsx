import React from "react";

type SearchBarDropDownProps = {
    selectFilter: (filter: string) => void;
    resetFilters: () => void;
};

const SearchBarDropDown = ({selectFilter, resetFilters}: SearchBarDropDownProps) => {
  return (
    <div className="relative mb-[150px]">
      <div className="rounded-md bg-[#FAF6EC] flex flex-col w-[100px] absolute right-0 border-[#746C59] border-[2px] justify-end">
        <h1
          onClick={() => selectFilter("tag")}
          className="hover:bg-[#746C59] hover:text-[#FAF6EC] font-semibold text-[#746C59] border-b-2 border-b-[#746C59] p-2 hover:cursor-pointer"
        >
          Tag
        </h1>
        <h1
          onClick={() => selectFilter("mood")}
          className="hover:bg-[#746C59] hover:text-[#FAF6EC] font-semibold text-[#746C59] border-b-2 border-b-[#746C59] p-2 hover:cursor-pointer"
        >
          Mood
        </h1>
        <h1
          onClick={() => resetFilters()}
          className="hover:bg-[#746C59] hover:text-[#FAF6EC] font-semibold text-[#746C59] p-2 hover:cursor-pointer"
        >
          Reset Filters
        </h1>
      </div>
    </div>
  );
};

export default SearchBarDropDown;
