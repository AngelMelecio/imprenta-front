import React from 'react'
import { useUsuarios } from '../Usuarios/hooks/UsuariosContext'
import { useEffect, useState } from 'react'
import Crud from '../../components/Crud/Crud'
import UserStatus from '../../components/UserStatus'
import Modal from '../../components/Modal'
import { MyIcons } from '../../constants/Icons'

let COLUMNS = [
  { label: 'ID', atribute: 'id' },
  { label: 'Nombre', atribute: 'nombre' },
  { label: 'Apellido', atribute: 'apellidos' },
  { label: 'Correo', atribute: 'correo' },
  { label: 'Rol', atribute: 'rol' },
]

const UsuariosPage = () => {
  const [loading, setLoading] = useState(true)
  const [listaUsuarios, setListaUsuarios] = useState([])
  const {refreshAllUsers, allUsers, deleteUser} = useUsuarios()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedItemsToDelete, setSelectedItemsToDelete] = useState([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      refreshAllUsers()
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    setListaUsuarios(allUsers)
  }, [allUsers])

  const onConfirm = async () => {
    setLoading(true)
    await deleteUser(selectedItemsToDelete)
    refreshAllUsers()
    setLoading(false)
  }

  return (
    <>
      <Crud
        title="Usuarios"
        path="usuarios"
        idName="id"
        columns={COLUMNS}
        data={listaUsuarios}
        setData={setListaUsuarios}
        loading={loading}
        onDelete={(items) => { setDeleteModalVisible(true); setSelectedItemsToDelete(items) }}
      />
      {deleteModalVisible &&
        <Modal
          image={<MyIcons.Alert size="45px" className='text-amber-300' />}
          title='Eliminar Usuarios'
          info='¿Estas seguro de que quieres eliminar los usuarios seleccionados?'
          onConfirm={() => {setDeleteModalVisible(false); onConfirm()}}
          onCancel={() => {setDeleteModalVisible(false)}}
          onClose={() => {setDeleteModalVisible(false)}}
        />
       
      }
    </>

  )
}

export default UsuariosPage