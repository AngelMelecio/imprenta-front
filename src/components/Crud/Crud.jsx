import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MyIcons } from '../../constants/Icons'
import AbsScroll from '../AbsScroll.jsx'
import SearchBar from './SearchBar';
import { useDebounce } from "@uidotdev/usehooks";

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

  const debouncedSearchText = useDebounce(searchText, 400);
  const navigate = useNavigate();


  const filteredData = useMemo(() => {
    return data.filter(d =>
      Object.keys(d).some(k =>
        d[k]?.toString().toLowerCase().includes(debouncedSearchText.toLowerCase())
      )
    );
  }, [data, debouncedSearchText]);

  const sortedData = useMemo(() => {
    if (filter.ord === 1) {
      return filteredData.sort((a, b) => (a[filter.atr] > b[filter.atr] ? 1 : -1));
    } else if (filter.ord === 2) {
      return filteredData.sort((a, b) => (a[filter.atr] < b[filter.atr] ? 1 : -1));
    }
    return filteredData;
  }, [filteredData, filter]);


  return (
    <div className="relative flex w-full h-screen bg-slate-100">
      <div id="page" className="relative flex flex-col w-full h-full p-4 ">
        <h1 className="pl-2 pb-2 text-3xl font-[800] text-emerald-800">{title}</h1>
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg ">
          {/* Table header */}
          <div className="px-4 py-4 border-b-2 rounded-t-lg border-b-slate-100 " >
            <div className="flex justify-between w-full">
              {/* Buttons */}
              <div className="flex flex-row items-center justify-between">
                <button
                  onClick={() => navigate(`/${path}/0`)}
                  className='text-white rounded-lg w-9 h-9 btn-emerald total-center'>
                  <MyIcons.Plus size='20px' />
                </button>
                <button
                  disabled={data?.filter(d => d.isChecked).length === 0}
                  onClick={() => onDelete(data.filter(d => d.isChecked).map(d => d[idName]))}
                  className='ml-4 text-white rounded-lg w-9 h-9 btn-trash total-center'>
                  <MyIcons.Trash size='20px' />
                </button>
              </div>
              <SearchBar value={searchText} setValue={setSearchText} />
            </div>
          </div>
          <AbsScroll vertical horizontal loading={loading} >
            <table className='custom-table'>
              <thead>
                <tr>
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
                        className={`${(filter.atr === col.atribute && filter.ord !== 0) ? "opacity-100" : "opacity-0 "} 
                        absolute right-0 duration-100 -translate-y-1/2 group-hover:opacity-100 top-1/2 w-7 h-7 total-center`}>
                        {filter.atr === col.atribute ? (filter.ord === 1 ? <MyIcons.Down size="18px" /> : (filter.ord === 2 ? <MyIcons.Up size="18px" /> : <MyIcons.Filter size="18px" />)) : <MyIcons.Filter size="18px" />}
                      </button>
                    </th>)}
                </tr>
              </thead>
              <tbody>
                {
                  //data
                  //  .filter(d => Object.keys(d).some(k => d[k]?.toString().toLowerCase().includes(searchText.toLowerCase())))
                  //  .sort((a, b) => {
                  //   if (filter.ord === 1) return a[filter.atr] > b[filter.atr] ? 1 : -1
                  //  if (filter.ord === 2) return a[filter.atr] < b[filter.atr] ? 1 : -1
                  // })
                  sortedData.map((item, i) =>
                    <tr key={`TR_${i}`} >
                      <td>
                        <div className='total-center'>
                          <input
                            className='custom-check'
                            checked={item?.isChecked || false}
                            onChange={(e) => {
                              setData(prev => prev.map(elmt => (
                                elmt[idName] === item[idName] ?
                                  { ...elmt, isChecked: e.target.checked } :
                                  { ...elmt }
                              )))
                            }}
                            type="checkbox" />
                        </div>
                      </td>
                      {columns?.map((col, j) => <td key={`TD_${i}_${j}`} onClick={() => navigate(`/${path}/${item[idName]}`)}>
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