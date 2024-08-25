import React from 'react'
import SearchBarMenu from './SearchBarMenu'

type SearchBarProps = {
    searchText: string;
    setSearchText: (text: string) => void;
    searchForDays: (e: React.FormEvent) => void;
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar = ({searchText, setSearchText, searchForDays, menuOpen, setMenuOpen}: SearchBarProps) => {
  return (
    <div className="relative shadow-lg bg-[#FAF6EC] w-full h-[100px] border-[#746C59] border-[2px] flex items-center p-3 rounded-md font-bold">
        <form className="w-full" onSubmit={(e) => searchForDays(e)}>
            <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="caretClass w-full text-3xl text-[#746C59] bg-transparent focus:outline-none caret-[#746C59]"
                  placeholder="Search For Text"
            />
        </form>
        
        <SearchBarMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen}  /> 
    
    </div>
  )
}

export default SearchBar