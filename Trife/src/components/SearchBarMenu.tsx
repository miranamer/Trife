import React from 'react'
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';

type SearchBarMenuProps = {
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchBarMenu = ({menuOpen, setMenuOpen}: SearchBarMenuProps) => {
  return (
    <div onClick={() => setMenuOpen(!menuOpen)} className="rounded-md hover:cursor-pointer absolute right-0 flex items-center justify-center border-[#746C59] border-l-[2px] w-[100px] h-full bg-[#EFE2C0]" >
        <p className="text-4xl text-[#746C59]">
            {menuOpen === false ? (
            <IoIosArrowDropdown />
            ) : (
            <IoIosArrowDropup />
            )} 
        </p>
    </div>
  )
}

export default SearchBarMenu