import React, { useEffect, useRef, useState } from 'react'
import { MyIcons } from '../constants/Icons'
import AbsScroll from './AbsScroll'

const OptsInp = ({
    label,
    name,
    value,
    options,
    formik,
    fieldChange,
    loading,
    showErrors = true,
    ...props
}) => {


    const [search, setSearch] = useState('')
    const [filteredOpts, setFilteredOpts] = useState([...options])
    const [showOpts, setShowOpts] = useState(false)
    const [error, setError] = useState(null)

    const inptRef = useRef(null)

    useEffect(() => {
        setError(
            formik?.errors[name] && formik?.touched[name]
        )
    }, [formik.values, formik.errors, formik.touched])

    useEffect(() => {
        setFilteredOpts([...options])
    }, [options])

    const handleOptClick = (e, option) => {
        inptRef.current.blur()
        formik?.setFieldValue(name, option)
        fieldChange && fieldChange(true)
    }

    const handleBlur = () => {
        setShowOpts(false);
        setSearch('')
        setFilteredOpts([...options])
    }

    const handleInptChange = (e) => {
        let val = e.target.value
        setSearch(val)
        setFilteredOpts(
            options.filter(option =>
                option.label.toLowerCase().includes(val.toLowerCase())
            )
        )
    }

    return (
        <div>
            <div className="relative">
                <label htmlFor={name} className={`absolute  ${showOpts ? 'text-emerald-500' : 'text-gray-500'} bg-white px-1 pointer-events-none up ${error ? 'text-rose-400' : ''} transition-all duration-200 `}>{label}</label>
                <input
                    ref={inptRef}
                    id={name}
                    readOnly={formik?.values[name] ? true : false}
                    autoComplete='off'
                    value={value || formik?.values[name]?.label || search}
                    onChange={handleInptChange}
                    onBlur={(e) => { handleBlur(); formik?.handleBlur(e) }}
                    onFocus={() => setShowOpts(true)}
                    className={`cursor-pointer text-start w-full px-4 py-2 text-base text-gray-700 border rounded-lg outline-none  duration-200 font-medium appearance-none ${error ? 'border-rose-400' : showOpts ? 'border-emerald-500' : ''} brdoer-gray-200 hover:border-emerald-500`}
                    {...props}
                />
                {/* Inpt Arrow / Clear */}
                {value || formik.values[name] ?
                    <button type="button"
                        onClick={() => formik?.setFieldValue(name, null)}
                        className='absolute w-8 h-8 text-gray-600 -translate-y-1/2 rounded-md right-1.5 hover:bg-gray-100 total-center top-1/2'>
                        <MyIcons.Cancel size="18px" />
                    </button>
                    :
                    <button
                        type="button"
                        onClick={(e) => inptRef.current.focus()}
                        className='absolute w-8 h-8 text-gray-600 -translate-y-1/2 rounded-md right-1.5 hover:bg-gray-100 total-center top-1/2'>
                        {showOpts ? <MyIcons.Up size="18px" /> : <MyIcons.Down size="18px" />}
                    </button>
                }
                {
                    showOpts &&
                    <ul
                        style={{ height: `${inptRef.current?.clientHeight * Math.min(filteredOpts.length, 4)}px` }}
                        className={`absolute z-10 w-full mt-1  bg-white border border-gray-200 divide-y divide-gray-100 max-h-40 rounded-md shadow-md`}>
                        <AbsScroll vertical loading={loading}>
                            {filteredOpts.map((option, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 duration-200 cursor-pointer hover:bg-gray-200"
                                    onMouseDown={(e) => handleOptClick(e, option)}>
                                    {option.label}
                                </li>
                            ))}
                        </AbsScroll>
                    </ul>
                }



            </div>
            {showErrors &&
                <div className={`flex pl-1 text-sm h-9 text-rose-400 ${error ? 'opacity-100' : 'opacity-0'} duration-200`}>
                    {error && <><MyIcons.Info style={{ margin: '3px' }} />{error}</>}
                </div>
            }
        </div>
    )
}

export default OptsInp