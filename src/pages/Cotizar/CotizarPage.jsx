import React, { useEffect, useRef, useState } from 'react'
import Opts from '../../components/Opts'
import Inpt from '../../components/Inpt'
import { useFormik } from 'formik'
import { useMaterial } from '../Materiales/hooks/MaterialContext'
import AbsScroll from '../../components/AbsScroll'
import { useSuaje } from '../Suajes/hooks/SuajeContext'
import Visualizer from './components/Visualizer'
import OptsInp from '../../components/OptsInp'
import Modal from '../../components/Modal'
import Summary from './components/Summary'
import FractionSelect from './components/FractionSelect'
import MarginSelect from './components/MarginSelect'

let initDetails = {
  suaje: {
    suaje: '',
    cortesPliego: '',
    piezasSuaje: '',
    totalPliegos: '',
    totalSuajadas: '',
    minPiezas: '',
  },
  guillotina: {
    alto: '',
    ancho: '',
    piezas: '',
    totalPliegos: '',
    cortesPliego: '',
    totalBajadas: '',
    minPiezas: '',
  }
}

const CotizarPage = () => {

  const whiteWindowRef = useRef()

  const { refreshAllMateriales, allMateriales } = useMaterial()
  const { refreshAllSuajes, allSuajes } = useSuaje()

  const [loadingMaterials, setLoadingMaterials] = useState(false)
  const [loadingSuajes, setLoadingSuajes] = useState(false)
  const [loading, setLoading] = useState(false)

  const [ready, setReady] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Select options
  const [materialsOpts, setMaterialsOpts] = useState([])
  const [suajesOpts, setSuajesOpts] = useState([])

  const [canvas, setCanvas] = useState({ width: 1, height: 1 })
  const [piece, setPiece] = useState({ width: 1, height: 1 })
  const [pieces, setPieces] = useState({ main: {}, remain: {} })

  const [margin, setMargin] = useState({})


  useEffect(() => {
    fetchMateriales()
    fetchSuajes()
  }, [])

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
  useEffect(() => {
    setMaterialsOpts(allMateriales.map(m => ({
      value: m.idMaterial,
      label: `${m.categoria} ${m.tipoMaterial} ${m.alto}cm x ${m.ancho}cm ${m.gramaje ? Number(m.gramaje).toFixed(2) + "g" : ""} ${Number(m.grosor).toFixed(2) || ""} ${m.color || ""} $${m.precio}`
    })))
  }, [allMateriales])

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
  useEffect(() => {
    setSuajesOpts(allSuajes.map(s => ({
      label: `no.${s.numero} / ${s.ancho} cm x ${s.alto} cm / Cortes: ${s.numeroCortes}`,
      value: s.idSuaje
    })))
  }, [allSuajes])

  const frm = useFormik({
    initialValues: {
      fraccion: { name: '1', w_div: 1, h_div: 1 },
      piezas: null,
      margin: 0,
      margin_top: 0,
      margin_bottom: 0,
      margin_left: 0,
      margin_right: 0,
      detailedMargin: false,
    },
    validate: (values) => {
      const errors = {}
      if (!values.piezas) {
        if (!values.totalPliegos) {
          errors.piezas = 'Ingresa el número de piezas'
          errors.totalPliegos = 'Ingresa el total de pliegos'
        }
      }
      else
        if (values.totalPliegos) {
          errors.piezas = 'Solo un campo es requerido'
          errors.totalPliegos = 'Solo un campo es requerido'
        }
      //console.log('validating:', errors)
      return errors
    },
    onSubmit: async (values) => {
      try {
        setLoading(true)
        setShowModal(true)

      } catch (e) {

      } finally {
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    frm.setFieldValue('detalles',
      frm.values.corte === "Suaje"
        ? initDetails.suaje
        : initDetails.guillotina
    )
  }, [frm?.values.corte])

  useEffect(() => {
    setReady(frm.values.material &&
      ((frm.values.corte === 'Guillotina' && frm.values.ancho && frm.values.alto) ||
        (frm.values.corte === 'Suaje' && frm.values.suaje)))
  }, [frm?.values.material, frm?.values.corte, frm?.values.suaje])


  useEffect(() => {
    calculateArrangement()
  }, [
    frm?.values.material,
    frm?.values.suaje,
    frm?.values.ancho,
    frm?.values.alto,
    frm?.values.fraccion,
  ])

  useEffect(() => {
    calculateMargin()
  }, [
    frm?.values.margin,
    frm?.values.margin_top,
    frm?.values.margin_bottom,
    frm?.values.margin_left,
    frm?.values.margin_right,
    frm?.values.detailedMargin,
  ])

  const calculateArrangement = () => {
    let canvas = { width: 1, height: 1 }
    let piece = { width: 1, height: 1 }

    // Obteniendo las medidas reales del material
    if (frm?.values.material) {
      let { ancho, alto } = allMateriales.find(m => m.idMaterial === frm.values.material.value)
      // Dividiendo por la fracción seleccionada
      ancho /= frm?.values['fraccion'].w_div
      alto /= frm?.values['fraccion'].h_div
      canvas = {
        width: Math.max(alto, ancho).toFixed(2),
        height: Math.min(alto, ancho).toFixed(2)
      }
    }

    // Obteniendo las medidas reales de la pieza
    if (frm?.values.corte === 'Suaje') {
      if (!frm?.values.suaje) return piece
      let { ancho, alto } = allSuajes.find(s => s.idSuaje === frm?.values.suaje.value)
      piece = {
        width: Math.max(alto, ancho) || 1,
        height: Math.min(alto, ancho) || 1
      }
    }
    else {
      let { ancho, alto } = frm?.values
      piece = {
        width: Math.max(alto, ancho) || 1,
        height: Math.min(alto, ancho) || 1
      }
    }

    // Calculando el acomodo

    // Horizontal
    let h_cols = Math.floor(canvas.width / piece.width)
    let h_rows = Math.floor(canvas.height / piece.height)
    //let h_space_remain = canvas.width - h_cols * piece.width
    //let h_cols_remain = Math.floor(h_space_remain / piece.height)
    //let h_rows_remain = Math.floor(canvas.height / piece.width)
    let q1 = (h_cols * h_rows) || 0 // + h_cols_remain * h_rows_remain

    // Vertical
    let v_cols = Math.floor(canvas.width / piece.height)
    let v_rows = Math.floor(canvas.height / piece.width)
    //let v_space_remain = canvas.height - v_rows * piece.width
    //let v_cols_remain = Math.floor(canvas.width / piece.width)
    //let v_rows_remain = Math.floor(v_space_remain / piece.height)
    let q2 = (v_cols * v_rows) || 0 // + v_cols_remain * v_rows_remain

    frm.setFieldValue('cortesPliego', Math.max(q1, q2))

    let horizontal = q1 > q2
    let pieces = {
      main: {
        rows: horizontal ? h_rows : v_rows,
        cols: horizontal ? h_cols : v_cols,
        w: horizontal ? piece.width : piece.height,
        h: horizontal ? piece.height : piece.width,
      },
    }
    if (!horizontal) {
      piece = {
        width: piece.height,
        height: piece.width
      }
    }

    setCanvas(canvas)
    setPiece(piece)
    setPieces(pieces)
  }
  const calculateMargin = () => {
    if (frm.values.detailedMargin) {
      setMargin({
        top: Number(frm.values.margin_top),
        bottom: Number(frm.values.margin_bottom),
        left: Number(frm.values.margin_left),
        right: Number(frm.values.margin_right),
      })
    } else {
      setMargin({
        top: Number(frm.values.margin),
        bottom: Number(frm.values.margin),
        left: Number(frm.values.margin),
        right: Number(frm.values.margin),
      })
    }
  }

  const getSummaryData = () => {
    let material = allMateriales.find(m => m.idMaterial === frm?.values?.material?.value)
    if (frm.values.corte === 'Suaje') {
      let suaje = allSuajes.find(s => s.idSuaje === frm?.values?.suaje?.value)
      let cantPliegos = Math.ceil(frm.values.piezas / (frm.values.cortesPliego * suaje?.numeroCortes))
      /*
            frm.setValues({
              ...frm.values,
              totalPliegos: cantPliegos,
            })
      */
      return ([
        { label: 'Material', value: `${material?.categoria} ${material?.tipoMaterial}` },
        { label: 'Suaje', value: `no. ${suaje?.numero}` },
        { label: 'Cortes por pliego', value: frm.values.cortesPliego },
        { label: 'Piezas por suaje', value: suaje?.numeroCortes },
        { label: 'Total de pliegos', value: cantPliegos },
        { label: 'Total de suajadas', value: cantPliegos * frm.values.cortesPliego },
        { label: 'Mínimo de piezas', value: cantPliegos * frm.values.cortesPliego * suaje?.numeroCortes },
      ])
    } else {
      return ([
        { label: 'Material', value: `${material.categoria} ${material.tipoMaterial}` },
      ])
    }
  }

  const handleCotizar = () => {
    console.log(frm.values)
  }

  return (
    <>
      <div className="relative flex w-full h-screen bg-slate-100">
        <form onSubmit={frm.handleSubmit} className="relative flex flex-col w-full h-full p-4 ">
          <div className='flex justify-between w-full pb-3 pl-2'>
            <h1 className=" text-3xl font-[800] text-emerald-800">Cotizacion</h1>
            {ready &&
              <input value='Cotizar'
                type='submit'
                className='px-10 text-xl btn-emerald' />}
          </div>
          <div
            ref={whiteWindowRef}
            className="flex flex-col h-full bg-white rounded-lg shadow-lg ">
            <AbsScroll vertical>
              <div className='flex flex-wrap pl-4'>
                <h2 className='w-full p-5 text-emerald-900'>Información General</h2>
                {/* Tipo de Corte */}
                <div className='w-full px-2 sm:w-1/3'>
                  <Opts
                    label="Tipo de corte"
                    name="corte"
                    formik={frm}
                    options={[
                      { label: 'Suaje', value: 'Suaje' },
                      { label: 'Guillotina', value: 'Guillotina' },
                    ]} />
                </div>
                {/* Suaje Selected */
                  frm.values.corte === 'Suaje' && <>
                    <div className='flex-grow w-full px-2 sm:w-2/3'>
                      <OptsInp
                        formik={frm}
                        label="Suaje"
                        name="suaje"
                        options={suajesOpts}
                        loading={loadingSuajes}
                      />
                    </div>
                  </>
                }
                {/* Guillotina Selected */
                  frm.values.corte === 'Guillotina' && <>
                    <div className="flex-grow w-full px-2 sm:w-1/3">
                      <Inpt
                        formik={frm}
                        label="Alto (cm)"
                        name="alto"
                        type="number"
                        min="0"
                      />
                    </div>
                    <div className="flex-grow w-full px-2 sm:w-1/3">
                      <Inpt
                        formik={frm}
                        label="Ancho (cm)"
                        name="ancho"
                        type="number"
                        min="0"
                      />
                    </div>
                  </>
                }
                {/* Material */}
                {frm.values.corte && <>
                  <div className='flex-grow w-full px-2'>
                    <OptsInp
                      label="Material"
                      name="material"
                      formik={frm}
                      options={materialsOpts}
                      loading={loadingMaterials}
                    />
                  </div>
                </>
                }
                {ready && <div style={{ minHeight: whiteWindowRef.current?.clientHeight }} className='flex flex-col w-full'>
                  <h2 className='w-full p-5 text-emerald-900'>Detalles</h2>
                  <div className='flex flex-grow'>

                    <div className='w-full'>
                      <AbsScroll vertical>
                        <div className={`flex-grow w-full  px-3 mt-2`}>
                          <Inpt
                            label="No. Piezas"
                            name="piezas"
                            formik={frm}
                            type="number"
                          />
                        </div>
                        <div className={`flex-grow w-full  px-3`}>
                          <Inpt
                            label="Total de pliegos"
                            name="totalPliegos"
                            formik={frm}
                            type="number"
                          />
                        </div>
                        <div className={`flex-grow w-full px-3`}>
                          <Inpt
                            readOnly
                            label="Cortes por pliego"
                            name="cortesPliego"
                            formik={frm}
                            type="number"
                          />
                        </div>
                        <div className={`flex-grow w-full px-3`}>
                          <Inpt
                            readOnly
                            label="Piezas por suaje"
                            name="piezasSuaje"
                            formik={frm}
                            type="number"
                          />
                        </div>

                        <div className={`flex-grow w-full px-3`}>
                          <Inpt
                            readOnly
                            label="Total de suajadas"
                            name="totalSuajadas"
                            formik={frm}
                            type="number"
                          />
                        </div>
                        <div className={`flex-grow w-full px-3`}>
                          <Inpt
                            readOnly
                            label="Min. Piezas"
                            name="minPiezas"
                            formik={frm}
                            type="number"
                          />
                        </div>
                      </AbsScroll>
                    </div>

                    <div className='flex flex-col flex-grow w-full'>
                      <FractionSelect
                        formik={frm}
                        name="fraccion"
                      />
                      <MarginSelect
                        formik={frm}
                        name="margin"
                      />
                      <Visualizer
                        pieces={pieces}
                        canvas={canvas}
                        piece={piece}
                        margin={margin}
                      //formik={frm}
                      />
                    </div>

                  </div>
                </div>
                }
              </div>
            </AbsScroll>
          </div>
        </form>
      </div>
      {showModal &&
        <Modal
          //image={<MyIcons.Cotizar size="36px" className='text-emerald-800' />}
          //title={'Detalles de la cotización'}
          info={<Summary data={getSummaryData()} />}
          onClose={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
          onConfirm={handleCotizar}
        />
      }
    </>
  )
}

export default CotizarPage