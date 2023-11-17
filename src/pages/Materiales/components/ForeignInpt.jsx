import React, { useEffect, useRef, useState } from 'react'
import { MyIcons } from '../../../constants/Icons'
import AbsScroll from '../../../components/AbsScroll'
import { useAuth } from '../../../context/authContext'
import { useAxios } from '../../../context/axiosContext'

function formatOptsList(responseList) {
    return responseList.map(o => ({
        label: o.nombre,
        value: o[Object.keys(o).find(k => k !== 'nombre')]
    }))
}

const ForeignInpt = ({
    label,
    name,     // The name will be use for set: Input id, formik (value,errors..). 
    url,
    formik,
    onFieldChange,
    ...props
}) => {

    const { notify } = useAuth()
    const { myAxios } = useAxios()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(false)

    // Load the options
    async function load() {
        try {
            const response = await myAxios.get(`api/${url}/`)
            setAllOptions(formatOptsList(response.data))
        } catch (e) {
            notify(e.message, true)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        load()
    }, [])

    async function crearOpt(opt) {
        try {
            setLoading(true)
            let response = await myAxios.post(`api/${url}/`, { nombre: opt })
            let { newOptId, newOptsList, message } = response.data
            notify(message)
            setAllOptions(formatOptsList(newOptsList))
            formik.setFieldValue(name, { label: opt, value: newOptId })
            onFieldChange && onFieldChange()
        } catch (e) {
            if (e.response)
                console.log(e.resonse)
            else
                throw new Error("Error de conexión")
        } finally {
            setLoading(false)
        }
    }

    async function deleteOpt(id) {
        try {
            setLoading(true)
            let response = await myAxios.delete(`api/${url}/${id}`)
            let { message, newOptsList } = response.data
            setAllOptions(formatOptsList(newOptsList))
            if (id === formik.values[name]?.value) {
                formik.setFieldValue(name, null)
                setNewOptName('')
            }
            notify(message)
        } catch (e) {
            console.log('asdasd')
            notify(e.message, true)
        } finally {
            setLoading(false)
        }
    }


    const [newOptName, setNewOptName] = useState('')

    const [allOptions, setAllOptions] = useState([])
    const [filteredOpts, setFilteredOpts] = useState([])

    const [showOpts, setShowOpts] = useState(false)
    const inptRef = useRef(null)


    useEffect(() => {
        setFilteredOpts([...allOptions])
    }, [allOptions])

    useEffect(() => {
        setErrors(
            formik.errors[name] && formik.touched[name]
        )
    }, [formik])

    // Controls
    const handleChange = (e) => {
        let val = e.target.value
        setNewOptName(val)
        setFilteredOpts(
            allOptions.filter(option =>
                option.label.toLowerCase().includes(val.toLowerCase())
            )
        )
    }

    const handleOptClick = (e, opt) => {
        formik?.setFieldValue(name, opt)
        onFieldChange && onFieldChange()
    }

    const handleBlur = () => {
        setShowOpts(false)
        setNewOptName('')
        setFilteredOpts([...allOptions])
    }

    return (
        <div>
            <div className="relative">
                <label htmlFor={name} className={`absolute  
                ${showOpts ? 'text-emerald-500' : 'text-gray-500'}
                ${errors ? 'text-red-400' : ''} 
                bg-white px-1 pointer-events-none up transition-all duration-200 `}>{label}</label>
                <input ref={inptRef}
                    id={name}
                    onChange={handleChange}
                    readOnly={formik?.values[name]?.label ? true : false}
                    value={formik?.values[name]?.label || newOptName}
                    onBlur={(e) => { handleBlur(); formik?.handleBlur(e) }}
                    onFocus={() => setShowOpts(true)}
                    autoComplete='off'
                    className={`cursor-pointer w-full px-4 py-2 text-base text-gray-700 border rounded-lg outline-none  duration-200 font-medium appearance-none brdoer-gray-200 
                    ${errors ? 'border-red-400' : 'hover:border-emerald-500'} `}
                    {...props}
                />
                {/* Inpt Arrow / Clear */}
                {formik.values[name] ?
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
                {/* List of Options */}
                {showOpts && <ul
                    style={{ height: `${inptRef.current?.clientHeight * Math.min(filteredOpts.length, 4)}px` }}
                    className={`absolute z-10 w-full mt-1  bg-white border border-gray-200 divide-y divide-gray-100 max-h-40 ${newOptName ? "rounded-t-md" : "rounded-md"}`}>
                    <AbsScroll vertical loading={loading}>
                        {filteredOpts.map((option, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between duration-200 cursor-pointer ">
                                {/* Option */}
                                <button
                                    className='flex-1 px-4 py-2 text-start hover:bg-gray-100'
                                    onMouseDown={(e) => handleOptClick(e, option)}>
                                    {option.label}
                                </button>
                                {/* Trash */}
                                <button
                                    className={`text-gray-500 w-7 h-7 mx-2 total-center hover:bg-gray-100 rounded-md`}
                                    onMouseDown={() => deleteOpt(option.value)}>
                                    <MyIcons.Trash size="18px" />
                                </button>
                            </li>
                        ))}
                    </AbsScroll>
                    {/* New options */}
                    {newOptName && <li className='w-full p-2 bg-white shadow-md rounded-b-md'>
                        <button className='px-4 py-1 bg-gray-200 rounded-md'
                            onMouseDown={() => crearOpt(newOptName)}>
                            Crear: {newOptName}
                        </button>
                    </li>
                    }
                </ul>
                }
            </div>
            {/* Errors */}
            <div className={`flex pl-1 text-sm h-9 text-rose-400 
            ${errors ? 'opacity-100' : 'opacity-0'}         
            duration-200`}>
                {errors && <>
                    <MyIcons.Info style={{ margin: '3px' }} />
                    {formik.errors[name]}
                </>}
            </div>
        </div>
    )
}

export default ForeignInpt