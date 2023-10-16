import React, { useRef } from 'react'
import { MyIcons } from '../../constants/Icons'


const SearchBar = ({ value, setValue }) => {
    
    const searchRef = useRef()
    const handleSearchButtonClick = () => {
        if (value.length > 0) {
            searchRef?.current?.blur()
            setValue('')
            return
        }
        searchRef?.current?.focus()
    }

    

    return (
        <div
            id="searchbar"
            className="relative flex items-center w-80">
            <input
                id='search-input'
                className='w-full h-full py-1 pl-3 pr-10 outline-none rounded-2xl bg-slate-200'
                ref={searchRef}
                onChange={(e) => { setValue(e.target.value) }}
                value={value}
                type="text"
            />
            <button
                onClick={handleSearchButtonClick}
                className='absolute w-8 h-8 right-1 total-center opacity-white rounded-2xl'>
                {
                    value.length > 0 ?
                        <MyIcons.Cancel size='18px' style={{ color: '#4b5563' }} /> :
                        <MyIcons.Lupa size='20px' style={{ color: '#4b5563' }} />
                }
            </button>
        </div>
    )
}

export default SearchBar