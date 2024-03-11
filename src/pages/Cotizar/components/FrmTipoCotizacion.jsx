import React, { useEffect, useState } from 'react'
import Opts from '../../../components/Opts'
import Inpt from '../../../components/Inpt'
import OptsInp from '../../../components/OptsInp'
import { useMaterial } from '../../Materiales/hooks/MaterialContext'
import { useSuaje } from '../../Suajes/hooks/SuajeContext'
import { useNotas } from '../../Notas/hooks/NotasContext'

const FrmTipoCotizacion = ({ formik }) => {


  /* Estados para controlar la logica*/
  const { refreshAllMateriales, allMateriales } = useMaterial()
  const { refreshAllSuajes, allSuajes } = useSuaje()
  const { refreshAllNotas, allNotas } = useNotas()

  const [loadingMaterials, setLoadingMaterials] = useState(false)
  const [loadingSuajes, setLoadingSuajes] = useState(false)
  const [loadingNotas, setLoadingNotas] = useState(false)

  // Select options
  const [materialsOpts, setMaterialsOpts] = useState([])
  const [suajesOpts, setSuajesOpts] = useState([])
  const [notasOpts, setNotasOpts] = useState([])

  /* Traer materiales y suajre de DB*/
  async function fetchMateriales() {
    try {
      setLoadingMaterials(true)
      await refreshAllMateriales()
    } catch (e) {
      console.log('Error al cargar materiales: ' + e)
    } finally {
      setLoadingMaterials(false)
    }
  }
  async function fetchSuajes() {
    try {
      setLoadingSuajes(true)
      await refreshAllSuajes()
    } catch (e) {
      console.log('Error al cargar los suajes: ' + e)
    } finally {
      setLoadingSuajes(false)
    }
  }

  async function fetchNotas() {
    try {
      setLoadingSuajes(true)
      await refreshAllNotas()
    } catch (e) {
      console.log('Error al cargar las notas: ' + e)
    } finally {
      setLoadingSuajes(false)
    }

  }


  /* Formateo de opciones para materiales y suarjes*/
  useEffect(() => {
    setMaterialsOpts(allMateriales.map(m => ({
      value: m.idMaterial,
      label: `${m.categoria} ${m.tipoMaterial} ${m.alto}cm x ${m.ancho}cm ${m.gramaje ? Number(m.gramaje).toFixed(2) + "g" : ""} ${Number(m.grosor).toFixed(2) || ""} ${m.color || ""} $${m.precio}`
    })))
  }, [allMateriales])

  useEffect(() => {
    setSuajesOpts(allSuajes.map(s => ({
      label: `no.${s.numero} / ${s.ancho} cm x ${s.alto} cm / Cortes: ${s.numeroCortes}`,
      value: s.idSuaje
    })))
  }, [allSuajes])

  useEffect(() => {
    setNotasOpts(allNotas.map(n => ({
      label: `${n.nombre} / ${n.alto} cm x ${n.ancho} cm`,
      value: n.idNota
    })))
  }, [allNotas])

  useEffect(() => {
    fetchMateriales()
  }, [])

  /* Trae los datos de suajes y materiales */
  useEffect(() => {

    if (formik.values.corte === 'Etiquetas')
      fetchSuajes()
    if (formik.values.corte === 'Notas')
      fetchNotas()

    formik.setFieldValue('suaje', '')
    formik.setFieldValue('nota', '')
    formik.setFieldValue('alto', '')
    formik.setFieldValue('ancho', '')


  }, [formik?.values.corte])

  return (
    <div className='flex flex-wrap col-span-2 px-2 pt-6 bg-white rounded-md shadow-md sm:px-9'>
      <h2 className='w-full p-5 text-emerald-900'>Información General</h2>
      {/* Tipo de Corte */}
      <div className='w-full px-2 sm:w-1/3'>
        <Opts
          label="Tipo de trabajo"
          name="corte"
          formik={formik}
          options={[
            { label: 'Etiquetas', value: 'Etiquetas' },
            { label: 'Notas', value: 'Notas' },
            { label: 'Guillotina', value: 'Guillotina' },
          ]} />
      </div>

      {/* Suaje Selected */
        formik?.values.corte === 'Etiquetas' && <>
          <div className='flex-grow w-full px-2 sm:w-2/3'>
            <OptsInp
              formik={formik}
              label="Suaje"
              name="suaje"
              options={suajesOpts}
              loading={loadingSuajes}
            />
          </div>
        </>
      }
      { /* Notas Selected */
        formik?.values.corte === 'Notas' && <>
          <div className='flex-grow w-full px-2 sm:w-2/3'>
            <OptsInp
              formik={formik}
              label="Nota"
              name="nota"
              options={notasOpts}
              loading={loadingNotas}
            />
          </div>
        </>
      }

      {/* Guillotina Selected */
        formik?.values.corte === 'Guillotina' && <>
          <div className="flex-grow w-full px-2 sm:w-1/3">
            <Inpt
              formik={formik}
              label="Alto (cm)"
              name="alto"
              type="number"
              min="0"
            />
          </div>
          <div className="flex-grow w-full px-2 sm:w-1/3">
            <Inpt
              formik={formik}
              label="Ancho (cm)"
              name="ancho"
              type="number"
              min="0"
            />
          </div>
        </>
      }
      {/* Material */}
      {formik?.values.corte && <>
        <div className='flex-grow w-full px-2'>
          <OptsInp
            label="Material"
            name="material"
            formik={formik}
            options={materialsOpts}
            loading={loadingMaterials}
          />
        </div>
      </>
      }
    </div>
  )
}

export default FrmTipoCotizacion