import React, { useEffect, useState } from 'react'
import { useAxios } from '../../context/axiosContext'
import Crud from '../../components/Crud/Crud'
import { useAuth } from '../../context/authContext'

const COLUMNS = [
    { label: 'ID', atribute: 'idPrensa' },
    { label: 'Nombre de la prensa', atribute: 'nombre' },

]

const PrensasPage = () => {

    const { myAxios } = useAxios()
    const {notify} = useAuth()

    const [loading, setLoading] = useState(false)
    const [listaPrensas, setListaPrensas] = useState([])

    const load = async () => {
        try {
            setLoading(true)
            const res = await myAxios.get('api/prensas/')
            setListaPrensas(res.data)
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


    return (
        <>
            <Crud
                title="Prensas"
                path="precios_tintas"
                idName="idPrensa"
                columns={COLUMNS}
                data={listaPrensas}
                setData={setListaPrensas}
                loading={loading}

            />
        </>
    )
}

export default PrensasPage