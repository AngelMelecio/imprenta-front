import React, { useEffect, useState } from 'react'
import Th from './Th'
import { MyIcons } from '../../../constants/Icons'
import { useAxios } from '../../../context/axiosContext'
import OptsInp from '../../../components/OptsInp'

const FrmTerminados = ({ formik }) => {

    const { myAxios } = useAxios()

    const [allTerminados, setAllTerminados] = useState([])
    const [terminadosOpts, setTerminadosOpts] = useState([])

    async function fetchTerminados() {
        try {
            const res = await myAxios.get(`api/terminados/trabajo/${(formik.values.corte==='Guillotina'?'Etiquetas':formik.values.corte)}`)
            setAllTerminados(res.data)
            setTerminadosOpts(res.data.map(item => ({
                value: item,
                label: `${item.nombre} - $${item.precio}`
            })))
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        formik.setFieldValue('terminados', { back: [], front: [] })
    }, [])

    useEffect(() => {
        if (!formik?.values?.corte) return
        fetchTerminados()
    }, [formik?.values?.corte])

    const addTerminado = ({ front = false, back = false }) => {
        let terminados = formik.values.terminados
        if (front) terminados.front.push({ value: "" })
        if (back) terminados.back.push({ value: "" })
        formik.setFieldValue('terminados', terminados)
    }

    return (
        <>
            <h2 className='flex-grow w-full p-5 text-emerald-900'>Detalles de terminados</h2>
            <div className='grid grid-cols-2 gap-3 px-3'>

                <Th text="Terminados frente" />
                <Th text="Terminados atrás" />

                <div className='grid items-start gap-2'>
                    {formik?.values?.terminados?.front.map((t, i) => <div key={`OF_${i}`} className='w-full'>
                        <OptsInp
                            type="text"
                            formik={formik}
                            name={`terminados.front.${i}`}
                            value={t.label || ""}
                            options={terminadosOpts}
                            showErrors={false}

                        />
                    </div>)}
                    {/*
                     */}
                    <button
                        onClick={() => addTerminado({ front: true })}
                        type="button" className='h-8 duration-100 border border-gray-300 rounded-md hover:border-emerald-500 active:opacity-70 active:duration-0 total-center'><MyIcons.Plus className='text-emerald-700' size="19px" /></button>
                </div>

                <div className='grid items-start gap-2'>
                    {formik?.values?.terminados?.back.map((t, i) => <div key={`OB_${i}`} className='w-full'>
                        <OptsInp
                            type="text"
                            formik={formik}
                            name={`terminados.back.${i}`}
                            value={t.label || ""}
                            options={terminadosOpts}
                            showErrors={false}

                        />
                    </div>)}
                    {/*
                     */}
                    <button
                        onClick={() => addTerminado({ back: true })}
                        type="button" className='h-8 duration-100 border border-gray-300 rounded-md hover:border-emerald-500 active:opacity-70 active:duration-0 total-center'><MyIcons.Plus className='text-emerald-700' size="19px" /></button>
                </div>


            </div>
        </>
    )
}

export default FrmTerminados