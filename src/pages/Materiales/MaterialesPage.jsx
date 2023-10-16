import React, { useEffect, useState } from 'react'
import Crud from '../../components/Crud/Crud'
import Modal from '../../components/Modal'
import { MyIcons } from '../../constants/Icons'
import { useAxios } from '../../context/axiosContext'


let COLUMNS = [
  { label: 'ID', atribute: 'idMaterial' },
  { label: 'Nombre', atribute: 'nombre' },
  { label: 'Ancho (cm)', atribute: 'ancho' },
  { label: 'Alto (cm)', atribute: 'alto' },
  { label: 'Gramage (g)', atribute: 'gramage' },
  { label: 'Grosor', atribute: 'grosor' },
  { label: 'Color', atribute: 'color' },
  { label: 'Categoria', atribute: 'categoria' },
]

const MaterialesPage = () => {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const { myAxios } = useAxios()

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(() => {
    setLoading(true)
    myAxios.get('api/materiales')
      .then(res => {
        setData(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Crud
        title='Materiales'
        idName='idMaterial'
        columns={COLUMNS}
        data={data}
        setData={setData}
        onDelete={(items) => { setDeleteModalVisible(true); console.log(items) }}
      />
      {deleteModalVisible &&
        <Modal
          image={<MyIcons.Alert size="45px" className='text-amber-300' />}
          title='Eliminar Materiales'
          info='¿Estas seguro de que quieres eliminar los materiales seleccionados?'
          onConfirm={() => setDeleteModalVisible(false)}
          onCancel={() => setDeleteModalVisible(false)}
          onClose={() => setDeleteModalVisible(false)}
        />

      }
    </>
  )
}

export default MaterialesPage