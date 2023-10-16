import React from 'react'
import Crud from '../../components/Crud'

let dummyData = [
  { idMaterial: 1, nombre: 'Papel Cushe', ancho: 1.5, alto: 1.2, gramaje: 2.1, grosor: 'grueso', color: 'blanco', categoria: 'Papel' },
  { idMaterial: 2, nombre: 'Papel Cascaron', ancho: 1.5, alto: 1.2, gramaje: 2.1, grosor: 'grueso', color: 'blanco', categoria: 'Papel' },
  { idMaterial: 3, nombre: 'Opalina', ancho: 1.5, alto: 1.2, gramaje: 2.1, grosor: 'grueso', color: 'Crema', categoria: 'Cartulina' },
  { idMaterial: 4, nombre: 'Papel Cushe', ancho: 1.5, alto: 1.2, gramaje: 2.1, grosor: 'grueso', color: 'blanco', categoria: 'Papel' },
  { idMaterial: 5, nombre: 'Papel Cushe', ancho: 1.5, alto: 1.2, gramaje: 2.1, grosor: 'grueso', color: 'blanco', categoria: 'Papel' },
]

let COLUMNS = [
  { label: 'ID', atribute: 'idMaterial' },
  { label: 'Nombre', atribute: 'nombre' },
  { label: 'Ancho (cm)', atribute: 'ancho' },
  { label: 'Alto (cm)', atribute: 'alto' },
  { label: 'Gramaje', atribute: 'gramaje' },
  { label: 'Grosor', atribute: 'grosor' },
  { label: 'Color', atribute: 'color' },
  { label: 'Categoria', atribute: 'categoria' },
]

const MaterialesPage = () => {

  const [data, setData] = React.useState(dummyData)

  return (
    <>
      <Crud
        title='Materiales'
        idName='idMaterial'
        columns={COLUMNS}
        data={data}
        setData={setData}
      />
    </>
  )
}

export default MaterialesPage