import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Inpt from '../../components/Inpt'
import { useFormik } from 'formik'
import AbsScroll from '../../components/AbsScroll'
import { useMaterial } from './hooks/MaterialContext'
import { MyIcons } from '../../constants/Icons'
import ForeignInpt from './components/ForeignInpt';

const NewMateriales = () => {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const { createMaterial } = useMaterial()

  const materialFormik = useFormik({
    initialValues: {
      categoria: null,
      tipoMaterial: null,
      alto: null,
      ancho: null,
      precio: null,
      stock: null,
    },
    validate: (values) => {
      const errors = {}
      if (!values.categoria) {
        errors.categoria = 'Selecciona una categoría';
      }
      if (!values.tipoMaterial) {
        errors.tipoMaterial = 'Ingresa el tipo';
      }
      if (!values.alto) {
        errors.alto = 'Ingresa el alto';
      }
      if (!values.ancho) {
        errors.ancho = 'Ingresa el ancho';
      }
      if (!values.precio) {
        errors.precio = 'Ingresa el precio';
      }
      if (!values.stock) {
        errors.stock = 'Ingresa el stock';
      }
      if (!values.alturaGuillotina) {
        errors.alturaGuillotina = 'Ingresa la altura máxima para guillotina';
      } else if (values.alturaGuillotina <= 0){
        errors.alturaGuillotina = 'La altura debe ser un entero mayor a cero'
      }

      //console.log('validating:')
      //console.log(errors)
      //console.log(materialFormik.touched)


      return errors
    },
    onSubmit: async (values) => {
      try {
        setLoading(true)
        console.log('submiting:', values)
        await createMaterial({
          ...values,
          categoria: values.categoria.value,
          tipoMaterial: values.tipoMaterial.value,
        })

        materialFormik.setValues({})
        materialFormik.setTouched({})
        //navigate('/materiales')
      } catch (e) {

      } finally {
        setLoading(false)
      }
    }
  })
  return (
    <form className='flex flex-col w-full h-screen p-3' onSubmit={materialFormik.handleSubmit}>
      <div className='flex items-end justify-between pb-3'>
        <div className='flex flex-row'>
          <button
            type='button'
            onClick={() => navigate('/materiales')}
            className="w-10 h-10 rounded-full btn-neutral total-center"> <MyIcons.Left size="30px" color='#047857' /> </button>
          <h1 className='pl-3 text-3xl text-emerald-800 '>Nuevo Material</h1>
        </div>
        <input className='px-10 py-1.5 rounded-lg btn-emerald' value="Guardar" type='submit' />
      </div>
      <div className='w-full h-full bg-white rounded-lg shadow-md'>
        <AbsScroll vertical loading={materialFormik.values === null}>
          <div className="flex flex-wrap px-2 pt-6 sm:px-9">

            <div className='flex flex-row w-full h-full p-2 total-center'>
              <div className="relative flex items-center justify-center w-full text-center">
                <MyIcons.Pack className='' size='100px' style={{ color: '#065f46' }} />
              </div>
            </div>
            <div className='flex-grow w-full px-5 mb-6'>
              <h2 className='text-lg font-bold text-emerald-800 '>
                Datos del Material
              </h2>
            </div>

            <div className="flex-grow w-full px-4 sm:w-1/2">
              <ForeignInpt
                label="Categoria"
                name="categoria"
                url="categoriasMateriales"
                formik={materialFormik}
              />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <ForeignInpt
                label="Tipo de Material"
                name="tipoMaterial"
                url="tiposMateriales"
                formik={materialFormik}
              />
            </div>

            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="number" step={0.1} name="ancho" formik={materialFormik} label="Ancho (cm)" />
            </div>
            
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="number" step={0.1} name="alto" formik={materialFormik} label="Alto (cm)" />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/3">
              <Inpt name="grosor" formik={materialFormik} label="Grosor" />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/3">
              <Inpt name="color" formik={materialFormik} label="Color" />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/3">
              <Inpt type="number" step={0.01} name="gramaje" formik={materialFormik} label="Gramaje" />
            </div>

            <div className="flex-grow w-full px-4 sm:w-2/3">
              <Inpt type="number" name="precio" formik={materialFormik} label="Precio" />
            </div>

            <div className="flex-grow w-full px-4 sm:w-1/3">
              <Inpt type="number" name="stock" formik={materialFormik} label="Stock" />
            </div>

            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="text" step={0.1} name="otros" formik={materialFormik} label="Otros" />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="number" name="alturaGuillotina" formik={materialFormik} label="Altura máxima para guillotina (en pliegos)" />
            </div>

          </div>
        </AbsScroll>
      </div>
    </form>
  )
}

export default NewMateriales