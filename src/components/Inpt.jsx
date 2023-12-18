import React, { useEffect, useState } from 'react'
import { MyIcons } from '../constants/Icons'

const Inpt = ({ label, name, formik, ...props }) => {

    const [isFocus, setIsFocus] = useState(false)
    const [hasValue, setHasValue] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {

        setError(formik?.errors[name] && formik?.touched[name])
        setHasValue(formik?.values[name])
    }, [formik])

    const handleFocus = (e) => {
        if (props.readOnly) return
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
                <label htmlFor={name}
                    className={`absolute  bg-white px-1 pointer-events-none 
                            ${error ? 'text-rose-400' : isFocus && !props.readOnly ? 'text-emerald-600' : 'text-gray-500'} ${isFocus || hasValue ? 'up' : ''} transition-all duration-200 `}>{label}</label>
                <input
                    id={name}
                    onFocus={handleFocus}
                    onChange={formik?.handleChange}
                    value={formik?.values[name] || ""}
                    onBlur={(e) => { handleBlur(e); formik?.handleBlur(e) }}
                    className={`w-full px-4 py-2 text-base text-gray-700 border rounded-lg outline-none  duration-200 font-medium 
                    ${error ? 'border-rose-400' : isFocus ? 'border-emerald-500' : !props.readOnly ? 'hover:border-emerald-500' : ''} `}
                    {...props} />
            </div>
            <div className={`flex pl-1 text-sm h-9 text-rose-400 ${error ? 'opacity-100' : 'opacity-0'} duration-200`}>
                {error && <><MyIcons.Info style={{ margin: '3px' }} />{formik.errors[name]}</>}
            </div>
        </div>
    )
}

export default Inpt