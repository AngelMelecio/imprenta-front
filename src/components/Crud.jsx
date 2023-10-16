import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MyIcons } from '../constants/Icons'
import AbsScroll from './AbsScroll.jsx'

const Crud = ({
  title,
  path,
  idName,
  loading,
  columns,
  data,
  setData,
  onDelete
}) => {
  const [searchText, setSearchText] = useState('')
  const [filter, setFilter] = useState({ atr: idName, ord: 1 })

  const searchRef = useRef()

  const navigate = useNavigate();

  useEffect(() => {
    console.log(data)
  }, [data])

  const handleSearchButtonClick = () => {
    if (searchText.length > 0) {
      searchRef?.current?.blur()
      setSearchText('')
      return
    }
    searchRef?.current?.focus()
  }

  return (
    <div className="relative flex w-full h-screen bg-slate-100">
      <div id="page" className="relative flex flex-col w-full h-full p-4 ">
        <h1 className="pb-4 text-3xl font-[800] text-emerald-800">{title}</h1>
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg ">
          {/* Options */}
          <div className="px-5 py-4 border-b-2 rounded-t-lg " >
            <div className="flex justify-between w-full">
              <div className="flex flex-row items-center justify-between">
                <button
                  onClick={() => navigate(`/${path}/0`)}
                  className='text-white rounded-lg w-9 h-9 btn-emerald total-center'>
                  <MyIcons.Plus size='20px' />
                </button>
              </div>
              {/* Search Bar */}
              <div
                id="searchbar"
                className="relative flex items-center w-80">
                <input
                  id='search-input'
                  className='w-full h-full py-1 pl-3 pr-10 outline-none rounded-2xl bg-slate-200'
                  ref={searchRef}
                  onChange={(e) => {
                    setSearchText(e.target.value)
                    //handleSearch()
                  }}
                  value={searchText}
                  type="text"
                />
                <button
                  onClick={handleSearchButtonClick}
                  className='absolute w-8 h-8 right-1 total-center opacity-white rounded-2xl'>
                  {
                    searchText.length > 0 ?
                      <MyIcons.Cancel size='18px' style={{ color: '#4b5563' }} /> :
                      <MyIcons.Lupa size='20px' style={{ color: '#4b5563' }} />
                  }
                </button>
              </div>
            </div>
          </div>
          <AbsScroll vertical horizontal loading={loading} >
            <table className='custom-table'>
              <thead>
                <tr >
                  <th className='px-5'>
                    <div className='total-center'>
                      <input
                        className='custom-check'
                        onChange={(e) => { setData(prev => prev.map(elmt => ({ ...elmt, isChecked: e.target.checked }))) }}
                        checked={data?.some(d => d.isChecked)}
                        type="checkbox" />
                    </div>
                  </th>
                  {columns?.map((col, i) =>
                    <th className='relative group' key={`TH_${i}`}>
                      <p className='px-[2rem]'>{col.label}</p>
                      <button type="button"
                        onClick={() => { setFilter(prev => ({ atr: col.atribute, ord: (prev.atr === col.atribute ? (prev.ord + 1) % 3 : 1) })) }}
                        className={`${(filter.atr === col.atribute && filter.ord !== 0) ? "opacity-100" : "opacity-0 "} absolute right-0 duration-100 -translate-y-1/2 group-hover:opacity-100 top-1/2 w-7 h-7 total-center`}>
                        {filter.atr === col.atribute ? (filter.ord === 1 ? <MyIcons.Down size="18px" /> : (filter.ord === 2 ? <MyIcons.Up size="18px" /> : <MyIcons.Filter size="18px" />)) : <MyIcons.Filter size="18px" />}
                      </button>
                    </th>)}
                </tr>
              </thead>
              <tbody>
                {data
                  .filter(d => Object.keys(d).some(k => d[k]?.toString().toLowerCase().includes(searchText.toLowerCase())))
                  .sort((a, b) => {
                    if (filter.ord === 1) return a[filter.atr] > b[filter.atr] ? 1 : -1
                    if (filter.ord === 2) return a[filter.atr] < b[filter.atr] ? 1 : -1
                  })
                  .map((item, i) =>
                    <tr key={`TR_${i}`}>
                      <td>
                        <div className='total-center'>
                          <input
                            className='custom-check'
                            checked={item?.isChecked || false}
                            onChange={(e) => {
                              setData(prev => prev.map(elmt => (
                                elmt[idName] === item[idName] ? { ...elmt, isChecked: e.target.checked } : { ...elmt }
                              ))
                              )
                            }}
                            type="checkbox" />
                        </div>
                      </td>
                      {columns?.map((col, j) => <td key={`TD_${i}_${j}`}>
                        {item[col.atribute]}
                      </td>)
                      }
                    </tr>
                  )
                }
              </tbody>
            </table>
          </AbsScroll>
        </div>
      </div >
    </div>
  )
}

export default Crud