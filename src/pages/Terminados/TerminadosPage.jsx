import React, { useEffect, useState } from 'react'
import Crud from '../../components/Crud/Crud'
import Modal from '../../components/Modal'
import { MyIcons } from '../../constants/Icons'
import { useTerminados } from './hooks/TerminadosContext'

let COLUMNS = [
  { label: 'ID', atribute: 'idTerminado' },
  { label: 'Nombre', atribute: 'nombre' },
  { label: 'Cantidad (mínima)', atribute: 'cantidad' },
  { label: 'Precio $', atribute: 'precio' },
  { label: 'Tipo de trabajo', atribute: 'tipoTrabajo' },
]

const TerminadosPage = () => {

  const [loading, setLoading] = useState(true)
  const [listaTerminados, setListaTerminados] = useState([])
  const { refreshAllTerminados, allTerminados, deleteTerminado } = useTerminados()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedItemsToDelete, setSelectedItemsToDelete] = useState([])

  async function load() {
    setLoading(true)
    await refreshAllTerminados()
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    setListaTerminados(allTerminados)
  }, [allTerminados])

  const onConfirm = async () => {
    setLoading(true)
    await deleteTerminado(selectedItemsToDelete)
    refreshAllTerminados()
    setLoading(false)
  }
  return (
    <>
      <Crud
        title='Terminados'
        path='terminados'
        idName='idTerminado'
        columns={COLUMNS}
        data={listaTerminados}
        setData={setListaTerminados}
        loading={loading}
        onDelete={(items) => { setDeleteModalVisible(true); setSelectedItemsToDelete(items) }}
      />
      {deleteModalVisible &&
        <Modal
          image={<MyIcons.Alert size="45px" className='text-amber-300' />}
          title='Eliminar terminados'
          info='¿Estas seguro de que quieres eliminar los terminados seleccionados?'
          onConfirm={() => {setDeleteModalVisible(false); onConfirm()}}
          onCancel={() => setDeleteModalVisible(false)}
          onClose={() => setDeleteModalVisible(false)}
        />

      }
    </>
  )
}

export default TerminadosPage