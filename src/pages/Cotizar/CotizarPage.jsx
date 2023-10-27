import React, { useEffect, useRef, useState } from 'react'
import Opts from '../../components/Opts'
import Inpt from '../../components/Inpt'
import { useFormik } from 'formik'
import { useMaterial } from '../Materiales/hooks/MaterialContext'
import AbsScroll from '../../components/AbsScroll'
import { categoriesOpts } from './constants/Categorias'
import { useSuaje } from '../Suajes/hooks/SuajeContext'
import Visualizer from './components/Visualizer'

const CotizarPage = () => {

  const whiteWindowRef = useRef()

  const [loading, setLoading] = useState(false)
  const [loadingMaterials, setLoadingMaterials] = useState(true)
  const [loadingSuajes, setLoadingSuajes] = useState(true)

  const { refreshAllMateriales, allMateriales } = useMaterial()
  const { refreshAllSuajes, allSuajes } = useSuaje()

  const [materialsOpts, setMaterialsOpts] = useState([])
  const [suajesOpts, setSuajesOpts] = useState([])

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


  const frm = useFormik({
    initialValues: {},
    validate: (values) => {
      const errors = {}
      return errors
    },
    onSubmit: async (values) => {
      try {
        setLoading(true)

      } catch (e) {

      } finally {
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    fetchMateriales()
  }, [])

  useEffect(() => {
    setMaterialsOpts(allMateriales.filter(m =>
      m.categoria === frm?.values.categoria).map(m => ({
        label: m.nombre, value: m.idMaterial
      })))
  }, [frm?.values.categoria])

  useEffect(() => {
    if (frm?.values.corte === 'suaje') {
      fetchSuajes()
    }
  }, [frm?.values.corte])

  useEffect(() => {
    setSuajesOpts(allSuajes.map(s => ({
      label: `no.${s.numero} / ${s.ancho} cm x ${s.alto} cm / ${s.numeroCortes} cortes / $${s.precio}`,
      value: s.idSuaje
    })))
  }, [allSuajes])



  const handleGetVisualizerCanvas = () => {
    let canvas = { width: "1", height: "1" }
    if (frm?.values.material) {
      let { ancho, alto } = allMateriales.find(m => m.idMaterial === frm.values.material)
      canvas = {
        width: ancho,
        height: alto
      }
    }
    return canvas
  }
  const handleGetVisualizerPiece = () => {
    let piece = { width: "1", height: "1" }
    if (frm?.values.corte === 'suaje') {
      if (!frm?.values.suaje) return
      let { ancho, alto } = allSuajes.find(s => s.idSuaje === frm?.values.suaje)
      piece = {
        width: ancho,
        height: alto
      }
    }
    else {
      let { ancho, alto } = frm?.values
      piece = {
        width: ancho,
        height: alto
      }
    }
    return piece
  }

  return (
    <div className="relative flex w-full h-screen bg-slate-100">
      <div id="page" className="relative flex flex-col w-full h-full p-4 ">
        <h1 className="pl-2 pb-2 text-3xl font-[800] text-emerald-800">Cotizacion</h1>
        <div
          ref={whiteWindowRef}
          className="flex flex-col h-full bg-white rounded-lg shadow-lg ">
          <AbsScroll vertical>
            <div className='flex flex-wrap pl-4'>
              <h2 className='p-5 text-emerald-900'>Detalles de la cotización</h2>
              <div className='flex-grow w-full px-2'>
                <Opts
                  label="Tipo de corte"
                  name="corte"
                  formik={frm}
                  options={[
                    { label: 'Suaje', value: 'suaje' },
                    { label: 'Guillotina', value: 'guillotina' },
                  ]} />
              </div>
              {/* Suaje Selected */
                frm.values.corte === 'suaje' && <>
                  <div className='flex-grow w-full px-2 '>
                    <Opts
                      formik={frm}
                      label="Suaje"
                      name="suaje"
                      options={suajesOpts}
                    />
                  </div>
                </>
              }
              {/* Guillotina Selected */
                frm.values.corte === 'guillotina' && <>
                  <div className="flex-grow w-full px-2 sm:w-1/3">
                    <Inpt
                      formik={frm}
                      label="Ancho (cm)"
                      name="ancho"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div className="flex-grow w-full px-2 sm:w-1/3">
                    <Inpt
                      formik={frm}
                      label="Alto (cm)"
                      name="alto"
                      type="number"
                      min="0"
                    />
                  </div>
                </>
              }
              {/* Material */
                frm.values.corte && <>
                  <div className='flex-grow w-full px-2 sm:w-1/2'>
                    <Opts
                      label="Categoría"
                      name="categoria"
                      formik={frm}
                      options={categoriesOpts}
                      placeholder="Seleccione"
                    />
                  </div>
                  <div className='flex-grow w-full px-2 sm:w-1/2'>
                    <Opts
                      label="Material"
                      name="material"
                      formik={frm}
                      options={materialsOpts}
                    />
                  </div>
                </>
              }
              <div
                className='flex flex-col w-full'
                style={{ height: whiteWindowRef.current?.clientHeight }}>
                <h2 className='p-5 text-emerald-900'>Visualización</h2>

                <Visualizer
                  canvas={handleGetVisualizerCanvas()}
                  piece={handleGetVisualizerPiece()}
                />

              </div>

            </div>
          </AbsScroll>
        </div>
      </div>
    </div>
  )
}

export default CotizarPage