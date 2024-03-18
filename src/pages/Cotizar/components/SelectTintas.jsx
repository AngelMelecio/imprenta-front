import React, { useEffect, useState } from 'react'
import ForeignInpt from '../../Materiales/components/ForeignInpt'
import OptsInp from '../../../components/OptsInp'
import { useAxios } from '../../../context/axiosContext'
import Th from './Th'
import Inpt from '../../../components/Inpt'

const format = (str) => {
    return ({
        front: Array(Number(str[0])).fill({ value: "" }),
        back: Array(Number(str[str.length - 1])).fill({ value: "" })
    })
}

const SelectTintas = ({ formik, value }) => {

    const [tintas, setTintas] = useState(null)

    const [tiposImpresionOpts, setTiposImpresionOpts] = useState([])

    const { myAxios } = useAxios()

    useEffect(() => {
        if (!value) return
        setTintas(format(value))
    }, [value])

    useEffect(() => {
        if (!formik?.values?.prensa) return
        getPreciosPrensa(formik.values.prensa.value)
    }, [formik?.values?.prensa])

    const getPreciosPrensa = async (idPrensa) => {
        try {
            const res = await myAxios.get(`api/precios_prensa/${idPrensa}`)
            setTiposImpresionOpts(res.data.precios.map(item => ({
                value: item,
                label: `${item.tipoImpresion.nombre} - $${item.precio}`

            })))
            console.log(res.data.precios)

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className='grid grid-cols-2 gap-3 px-3'>

            <Th text="Tintas frente" />
            <Th text="Tintas reverso" />

            <div className='grid col-span-1 gap-2'>
                {tintas?.front.map((t, i) => <div key={`OF_${i}`} className='w-full'>
                    <OptsInp
                        formik={formik}
                        name={`tintas.front.${i}`}
                        value={formik?.values?.tintas?.front[i] && formik.values.tintas.front[i].label}
                        options={tiposImpresionOpts}
                        showErrors={false}
                    />
                </div>)}
            </div>

            <div className='grid col-span-1 gap-2'>
                {tintas?.back.map((t, i) => <div key={`OB_${i}`} className='w-full'>
                    <OptsInp
                        formik={formik}
                        name={`tintas.back.${i}`}
                        value={formik?.values?.tintas?.back[i] && formik.values.tintas.back[i].label}
                        options={tiposImpresionOpts}
                        showErrors={false}
                    />
                </div>)}
            </div>

        </div>
    )
}

export default SelectTintas