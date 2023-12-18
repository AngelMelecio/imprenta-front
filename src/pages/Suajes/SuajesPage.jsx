import React, { useEffect, useState } from 'react'
import Crud from '../../components/Crud/Crud'
import Modal from '../../components/Modal'
import { MyIcons } from '../../constants/Icons'
import { useSuaje } from './hooks/SuajeContext'

let COLUMNS = [
  { label: 'ID', atribute: 'idSuaje' },
  { label: 'Número', atribute: 'numero' },
  { label: 'Ancho (cm)', atribute: 'ancho' },
  { label: 'Alto (cm)', atribute: 'alto' },
  { label: 'Cortes', atribute: 'numeroCortes' },
]

const SuajesPage = () => {

  const [loading, setLoading] = useState(true)
  const [listaSuajes, setListaSuajes] = useState([])
  const { refreshAllSuajes, allSuajes, deleteSuaje } = useSuaje()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedItemsToDelete, setSelectedItemsToDelete] = useState([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      refreshAllSuajes()
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    setListaSuajes(allSuajes)
  }, [allSuajes])

  const onConfirm = async () => {
    setLoading(true)
    await deleteSuaje(selectedItemsToDelete)
    refreshAllSuajes()
    setLoading(false)
  }
  return (
    <>
      <Crud
        title='Suajes'
        path='suajes'
        idName='idSuaje'
        columns={COLUMNS}
        data={listaSuajes}
        setData={setListaSuajes}
        loading={loading}
        onDelete={(items) => { setDeleteModalVisible(true); setSelectedItemsToDelete(items) }}
      />
      {deleteModalVisible &&
        <Modal
          image={<MyIcons.Alert size="45px" className='text-amber-300' />}
          title='Eliminar Suajes'
          info='¿Estas seguro de que quieres eliminar los Suajes seleccionados?'
          onConfirm={() => {setDeleteModalVisible(false); onConfirm()}}
          onCancel={() => setDeleteModalVisible(false)}
          onClose={() => setDeleteModalVisible(false)}
        />

      }
    </>
  )
}

export default SuajesPage