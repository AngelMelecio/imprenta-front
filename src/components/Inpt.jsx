import React, { useEffect, useState } from 'react'
import { MyIcons } from '../constants/Icons'

const Inpt = ({ label, name, formik, ...props }) => {

    const [isFocus, setIsFocus] = useState(false)
    const [hasValue, setHasValue] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        setError(formik?.errors[name])
    }, [formik])

    const handleFocus = (e) => {
        setIsFocus(true)
    }
    const handleBlur = (e) => {
        setIsFocus(false)
        if (e.target.value) {
            setHasValue(true);
        } else {
            setHasValue(false);
        }
    }

    return (
        <div >
            <div className="relative">
                <label className={`absolute  bg-white px-1 pointer-events-none ${error ? 'text-rose-400' : isFocus ? 'text-emerald-500' : 'text-gray-500'} ${isFocus || hasValue ? 'up' : ''} transition-all duration-200 `}>{label}</label>
                <input
                    id={name}
                    onFocus={handleFocus}
                    onChange={formik?.handleChange}
                    onBlur={(e) => { handleBlur(e); formik?.handleBlur(e) }}
                    {...props}
                    className={`w-full px-4 py-2 text-base text-gray-700 border rounded-lg outline-none  duration-200 font-medium ${error ? 'border-rose-400' : isFocus ? 'border-emerald-500' : 'border-gray-200 hover:border-emerald-500'}`} />
            </div>
            <div className={`flex pl-1 text-sm h-9 text-rose-400 ${error ? 'opacity-100' : 'opacity-0'} duration-200`}>
                {error && <><MyIcons.Info style={{ margin: '3px' }} />{error}</>}
            </div>
        </div>
    )
}

export default Inpt