import React, { useEffect, useState } from 'react'
import Crud from '../../components/Crud/Crud'
import Modal from '../../components/Modal'
import { MyIcons } from '../../constants/Icons'
import { useNotas } from './hooks/NotasContext'

let COLUMNS = [
  { label: 'ID', atribute: 'idNota' },
  { label: 'Nombre', atribute: 'nombre' },
  { label: 'Alto (cm)', atribute: 'alto' },
  { label: 'Ancho (cm)', atribute: 'ancho' },
]

const NotasPage = () => {

  const [loading, setLoading] = useState(true)
  const [listaNotas, setListaNotas] = useState([])
  const { refreshAllNotas, allNotas, deleteNota } = useNotas()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedItemsToDelete, setSelectedItemsToDelete] = useState([])

  async function load() {
    setLoading(true)
    await refreshAllNotas()
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    setListaNotas(allNotas)
  }, [allNotas])

  const onConfirm = async () => {
    setLoading(true)
    await deleteNota(selectedItemsToDelete)
    refreshAllNotas()
    setLoading(false)
  }
  return (
    <>
      <Crud
        title='Notas'
        path='notas'
        idName='idNota'
        columns={COLUMNS}
        data={listaNotas}
        setData={setListaNotas}
        loading={loading}
        onDelete={(items) => { setDeleteModalVisible(true); setSelectedItemsToDelete(items) }}
      />
      {deleteModalVisible &&
        <Modal
          image={<MyIcons.Alert size="45px" className='text-amber-300' />}
          title='Eliminar notas'
          info='¿Estas seguro de que quieres eliminar las notas seleccionados?'
          onConfirm={() => {setDeleteModalVisible(false); onConfirm()}}
          onCancel={() => setDeleteModalVisible(false)}
          onClose={() => setDeleteModalVisible(false)}
        />

      }
    </>
  )
}

export default NotasPage