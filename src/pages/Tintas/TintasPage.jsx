import React, { useEffect, useState } from 'react'
import { useAxios } from '../../context/axiosContext'
import Crud from '../../components/Crud/Crud'

const COLUMNS = [
  { label: 'ID', atribute: 'idTipoImpresion' },
  { label: 'Tipo de impresion', atribute: 'nombre' },

]

const TintasPage = () => {

  const { myAxios } = useAxios()

  const [loading, setLoading] = useState(false)
  const [listaTipoImpresiones, setListaTipoImpresiones] = useState([])

  const load = async () => {
    try {
      setLoading(true)
      const res = await myAxios.get('api/tipoImpresiones/')
      setListaTipoImpresiones(res.data)
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
        title="Tipos de imperesiones"
        path="precios_tintas"
        idName="idTipoImpresion"
        columns={COLUMNS}
        data={listaTipoImpresiones}
        setData={setListaTipoImpresiones}
        loading={loading}

      />
    </>
  )
}

export default TintasPage