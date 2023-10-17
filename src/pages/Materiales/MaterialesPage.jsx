import React, { useEffect, useState } from 'react'
import Crud from '../../components/Crud/Crud'
import Modal from '../../components/Modal'
import { MyIcons } from '../../constants/Icons'
import { useMaterial } from './hooks/MaterialContext'

let COLUMNS = [
  { label: 'ID', atribute: 'idMaterial' },
  { label: 'Nombre', atribute: 'nombre' },
  { label: 'Ancho (cm)', atribute: 'ancho' },
  { label: 'Alto (cm)', atribute: 'alto' },
  { label: 'Gramaje (g)', atribute: 'gramaje' },
  { label: 'Grosor', atribute: 'grosor' },
  { label: 'Color', atribute: 'color' },
  { label: 'Categoria', atribute: 'categoria' },
]

const MaterialesPage = () => {

  const [loading, setLoading] = useState(true)
  const [listaMateriales, setListaMateriales] = useState([])
  const { refreshAllMateriales, allMateriales, deleteMaterial } = useMaterial()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedItemsToDelete, setSelectedItemsToDelete] = useState([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      refreshAllMateriales()
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    setListaMateriales(allMateriales)
  }, [allMateriales])

  const onConfirm = async () => {
    setLoading(true)
    await deleteMaterial(selectedItemsToDelete)
    refreshAllMateriales()
    setLoading(false)
  }
  return (
    <>
      <Crud
        title='Materiales'
        path='materiales'
        idName='idMaterial'
        columns={COLUMNS}
        data={listaMateriales}
        setData={setListaMateriales}
        loading={loading}
        onDelete={(items) => { setDeleteModalVisible(true); setSelectedItemsToDelete(items) }}
      />
      {deleteModalVisible &&
        <Modal
          image={<MyIcons.Alert size="45px" className='text-amber-300' />}
          title='Eliminar Materiales'
          info='¿Estas seguro de que quieres eliminar los materiales seleccionados?'
          onConfirm={() => {setDeleteModalVisible(false); onConfirm()}}
          onCancel={() => setDeleteModalVisible(false)}
          onClose={() => setDeleteModalVisible(false)}
        />

      }
    </>
  )
}

export default MaterialesPage