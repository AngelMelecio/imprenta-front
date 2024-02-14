import React, { useEffect, useState } from 'react'
import OptsInp from '../../../components/OptsInp'
import { useAuth } from '../../../context/authContext'
import { useAxios } from '../../../context/axiosContext'

const getUnique = (arr, key, idName) => {
    const map = {}
    arr.forEach((item) => {
        if (!map[item[key][idName]]) map[item[key][idName]] = item
    })
    return Object.values(map)
}

const TintaSelect = ({ formik, calcularTotales }) => {

    const { notify } = useAuth()
    const { myAxios } = useAxios()

    const [allPrecios, setAllPrecios] = useState([])

    const [tiposImpresionOpts, setTiposImpresionOpts] = useState([])
    const [tintasOpts, setTintasOpts] = useState([])
    const [prensasOpts, setPrensasOpts] = useState([])

    const [loading, setLoading] = useState(false)

    // Cargar todos los precios
    const load = async () => {
        try {
            setLoading(true)
            const res = await myAxios.get('api/precioPrensas/')
            setAllPrecios(res.data)
            // Settear las opciones unicas de tipos de impresion
            setTiposImpresionOpts(
                getUnique(res.data, 'tipoImpresion', 'idTipoImpresion').map(tipo => ({
                    label: tipo.tipoImpresion.nombre,
                    value: tipo.tipoImpresion.idTipoImpresion
                })))
        } catch (e) {
            notify("Error al cargar los datos", true)
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    // Settear las opciones unicas de tintas
    // del mismo tipo de impresion seleccionado
    useEffect(() => {
        formik?.setFieldValue('tinta', null)
        formik?.setFieldValue('prensa', null)
        if (formik?.values?.tipoImpresion) {
            setTintasOpts(
                getUnique(allPrecios.filter(precio => precio.tipoImpresion.idTipoImpresion === formik?.values?.tipoImpresion.value), 'tinta', 'idTinta')
                    .map(tinta => ({
                        label: tinta.tinta.nombre,
                        value: tinta.tinta.idTinta
                    })))
        }
    }, [formik?.values?.tipoImpresion])

    // Settear las opciones unicas de prensas
    // del mismo tipo de impresion y tinta seleccionados
    useEffect(() => {
        formik?.setFieldValue('prensa', null)
        if (formik?.values?.tinta) {
            setPrensasOpts(
                getUnique(allPrecios.filter(precio => precio.tipoImpresion.idTipoImpresion === formik?.values?.tipoImpresion.value && precio.tinta.idTinta === formik?.values?.tinta.value), 'prensa', 'idPrensa')
                    .map(prensa => ({
                        label: prensa.prensa.nombre,
                        value: prensa
                    }))
            )
        }
    }, [formik?.values?.tinta])


    return (
        <>
            <div className='flex-grow w-full px-3'>
                <OptsInp
                    label='Tipo de impresion'
                    name='tipoImpresion'
                    options={tiposImpresionOpts}
                    formik={formik}
                    loading={loading}
                />
            </div>
            {formik?.values.tipoImpresion &&
                <div className='flex-grow w-full px-3 md:w-1/2'>
                    <OptsInp
                        label='Tinta'
                        name='tinta'
                        options={tintasOpts}
                        formik={formik}
                        loading={loading}
                    />
                </div>
            }
            {formik?.values.tipoImpresion && formik?.values.tinta &&
                <div className='flex-grow w-full px-3 md:w-1/2'>
                    <OptsInp
                        label='Prensa'
                        name='prensa'
                        options={prensasOpts}
                        formik={formik}
                        loading={loading}
                    />
                </div>
            }
        </>
    )
}

export default TintaSelect