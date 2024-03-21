import React, { useEffect, useRef, useState } from 'react'

import { useFormik } from 'formik'
import { useMaterial } from '../Materiales/hooks/MaterialContext'
import AbsScroll from '../../components/AbsScroll'
import { useSuaje } from '../Suajes/hooks/SuajeContext'
import Visualizer from './components/Visualizer'
import Modal from '../../components/Modal'
import DetailRow from './components/DetailRow'
import FrmTipoCotizacion from './components/FrmTipoCotizacion'
import FrmDetallesCotizacion from './components/FrmDetallesCotizacion'
import { getDetalles, getTotales } from './constants/reglasNegocio'
import { useNotas } from '../Notas/hooks/NotasContext'

let initDetails = {
  suaje: {
    suaje: '',
    piezasSuaje: '',
    auxTotalImpresiones: '',
    totalSuajadas: '',
    minPiezas: '',
  },
  guillotina: {
    alto: '',
    ancho: '',
    piezas: '',
    auxTotalImpresiones: '',
    cortesPliego: '',
    totalBajadas: '',
    minPiezas: '',
  }
}

const Tabs = [
  { label: "Visualizador", value: 0 },
  { label: "Detalles", value: 1 },
]

const CotizarPage = () => {

  const whiteWindowRef = useRef()

  const [loading, setLoading] = useState(false)

  const { allMateriales } = useMaterial()
  const { allSuajes } = useSuaje()
  const { allNotas } = useNotas()

  const [ready, setReady] = useState(false)
  const [detailsCalculated, setDetailsCalculated] = useState(false)
  const [showModal, setShowModal] = useState(false)


  const [canvas, setCanvas] = useState({ width: 1, height: 1 })
  const [piece, setPiece] = useState({ width: 1, height: 1, cortes: 1 })
  const [pieces, setPieces] = useState({ main: {}, remain: {} })

  const [margin, setMargin] = useState({})

  const [selectedTab, setSelectedTab] = useState(0)


  /* Funcion para validar los datos ingresados por el usuario */
  const validate = (values) => {
    const errors = {}
    if (!values.cantidadPiezas) {
      if (!values.cantidadPliegos) {
        errors.cantidadPiezas = 'Ingresa el número de piezas'
        errors.cantidadPliegos = 'Ingresa el número de pliegos'
      } else if (values.cantidadPliegos <= 0) {
        errors.cantidadPliegos = 'Ingresa un número mayor a 0'
      }
    } else {
      if (values.cantidadPliegos) {
        errors.cantidadPiezas = 'Solo un campo es requerido'
        errors.cantidadPliegos = 'Solo un campo es requerido'
      } else if (values.cantidadPiezas <= 0) {
        errors.cantidadPiezas = 'Ingresa un número mayor a 0'
      }
    }

    if (!values.precioBajadaGuillotina) {
      errors.precioBajadaGuillotina = 'Ingresa el precio por bajada'
    } else if (values.precioBajadaGuillotina <= 0) {
      errors.precioBajadaGuillotina = 'Ingresa un precio mayor a 0';
    }

    return errors
  }

  /* useFormik sirve para definir valores iniciales, 
  control y validacion de los datos asi como controlar 
  eventos (onsubmit) */
  const frm = useFormik({
    initialValues: {
      fraccion: { name: '1', w_div: 1, h_div: 1 }, // Inicialmente se considera el pliego completo
      piezas: null,
      margin: 1.5,
      margin_top: 1.5,
      margin_bottom: 1.5,
      margin_left: 1.5,
      margin_right: 1.5,
      detailedMargin: false,
      precioBajadaGuillotina: 2,
    },
    validate,
    onSubmit: async (values) => {
      try {
        console.log(values)
        calcularDetalles(values)
        setLoading(true)
        //setShowModal(true)

      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
  })

  /* Dependiendo de la seleccion del tipo de trabajo
  adicionamos un nuevo value (conjunto de datos) al useFormik 
  para controlar el calculo de detalles e informacion relevante.*/
  useEffect(() => {
    frm.setFieldValue('detalles',
      frm.values.corte === "Etiquetas"
        ? initDetails.suaje
        : initDetails.guillotina
    )
    frm.setFieldValue('calculo',
      frm.values.corte === "Etiquetas" ?
        { label: 'Regla de tres', value: 'reglaTres' } :
        { label: 'Mínimos', value: 'minimos' }
    )
  }, [frm?.values.corte])

  useEffect(() => {
    setReady(frm.values.material &&
      ((frm.values.corte === 'Guillotina' && frm.values.ancho && frm.values.alto) ||
        (frm.values.corte === 'Etiquetas' && frm.values.suaje)))
  }, [
    frm?.values.material,
    frm?.values.corte,
    frm?.values.suaje,
    frm?.values.ancho,
    frm?.values.alto
  ])

  useEffect(() => {
    if (frm?.values.material) {
      if ((frm?.values?.corte === 'Guillotina' && frm?.values?.ancho && frm?.values?.alto) ||
        (frm?.values?.corte === 'Etiquetas' && frm?.values?.suaje) ||
        (frm?.values?.corte === 'Notas' && frm?.values?.nota)) {
        calculateArrangement()
      }
    }
  }, [
    frm?.values?.corte,
    frm?.values.material,
    frm?.values.suaje,
    frm?.values.ancho,
    frm?.values.alto,
    frm?.values.nota,
  ])

  /* Llamamos a la funcion calculateArrangement cada vez que cambia
  alguno de los siguientes valores: material, suaje, medidas para guillotina, 
  fraccion y margenes */
  useEffect(() => {
    calculateArrangement()
    setDetailsCalculated(false)
    frm.setFieldValue('detalles', null)
    frm.setFieldValue('tipoImpresion', null)
    setSelectedTab(0)
  }, [

    frm?.values.fraccion,
    frm?.values.margin,
    frm?.values.margin_top,
    frm?.values.margin_bottom,
    frm?.values.margin_left,
    frm?.values.margin_right,
    frm?.values.detailedMargin,
    frm?.values.cantidadPiezas,
    frm?.values.cantidadPliegos,
    frm?.values.precioBajadaGuillotina,
  ])


  /* Llamamos a la funcion calculateMargin cada vez que cambia
  el valor de los margenes */
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

  /* Funcion para calcular el acomodo de los cuadrilateros (suajes o piezas)
  en el visualizador */
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

    let realWidth = canvas.width
    let realHeight = canvas.height

    if (frm.values.detailedMargin) {
      realWidth -= frm.values.margin_left + frm.values.margin_right
      realHeight -= frm.values.margin_top + frm.values.margin_bottom
    } else {
      realWidth -= frm.values.margin * 2
      realHeight -= frm.values.margin * 2
    }

    // Obteniendo las medidas reales de la pieza
    if (frm?.values.corte === 'Etiquetas') {
      if (!frm?.values.suaje) return piece
      let { ancho, alto, numeroCortes } = allSuajes.find(s => s.idSuaje === frm?.values.suaje.value)
      piece = {
        width: Math.max(alto, ancho) || 1,
        height: Math.min(alto, ancho) || 1,
        cortes: numeroCortes,
      }
    }
    else if (frm?.values.corte === 'Guillotina') {
      let { ancho, alto, numeroCortes } = frm?.values
      piece = {
        width: Math.max(alto, ancho) || 1,
        height: Math.min(alto, ancho) || 1,
        cortes: numeroCortes,
      }
    }
    else if (frm?.values.corte === 'Notas') {
      let { ancho, alto } = allNotas.find(nota => nota.idNota === frm?.values?.nota?.value)
      piece = {
        width: Math.max(alto, ancho) || 1,
        height: Math.min(alto, ancho) || 1,
        cortes: 1,
      }
    }

    // Calculando el acomodo

    // Horizontal
    let h_cols = Math.floor(realWidth / piece.width)
    let h_rows = Math.floor(realHeight / piece.height)
    //let h_space_remain = realWidth - h_cols * piece.width
    //let h_cols_remain = Math.floor(h_space_remain / piece.height)
    //let h_rows_remain = Math.floor(realHeight / piece.width)
    let q1 = (h_cols * h_rows) || 0 // + h_cols_remain * h_rows_remain

    // Vertical
    let v_cols = Math.floor(realWidth / piece.height)
    let v_rows = Math.floor(realHeight / piece.width)
    //let v_space_remain = realHeight - v_rows * piece.width
    //let v_cols_remain = Math.floor(realWidth / piece.width)
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
        height: piece.width,
        cortes: piece.cortes,
      }
    }

    setCanvas(canvas)
    setPiece(piece)
    setPieces(pieces)
    frm.setFieldValue('detalles', null)
  }

  /* Funcion para settear los valores de los margenes
  de forma general o especifica */
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

  /*Calcula los detalles de la cotizacion asi como los costos
  en base a los datos ingresados por el usuario*/
  const calcularDetalles = (values) => {

    let errors = validate(values)
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach(key => {
        frm.setFieldTouched(key, true)
      })
      return
    }

    let material = allMateriales.find(
      m => m.idMaterial === frm?.values?.material?.value
    )

    let suaje = frm?.values?.corte === 'Etiquetas' ?
      allSuajes.find(s => s.idSuaje === frm?.values?.suaje?.value)
      : null

    let fraccion = frm.values.fraccion.w_div * frm.values.fraccion.h_div

    let detalles = getDetalles({
      tipo: frm.values.corte,
      pliegosCotizar: frm.values.cantidadPliegos ? frm.values.cantidadPliegos : null,
      piezasCotizar: frm.values.cantidadPiezas ? frm.values.cantidadPiezas : null,
      impresionesPliego: fraccion,
      cortesImpresion: frm.values.cortesPliego,
      piezasSuaje: suaje?.numeroCortes ? suaje?.numeroCortes : 1,
      cortesFila: pieces.main.rows,
      cortesColumna: pieces.main.cols,
      alturaGuillotina: material?.alturaGuillotina,
    })

    frm.setFieldValue('detalles', detalles)

    setSelectedTab(1)
    setDetailsCalculated(true)
  }

  const calcularTotales = () => {

    let material = allMateriales.find(
      m => m.idMaterial === frm?.values?.material?.value
    )

    let suaje = frm?.values?.corte === 'Etiquetas' ?
      allSuajes.find(s => s.idSuaje === frm?.values?.suaje?.value)
      : null


    let totales = getTotales({
      tipo: frm.values.corte,
      totalPliegos: frm.values?.detalles.totalPliegos?.value,
      totalImpresiones: frm.values?.detalles.totalImpresiones?.value,
      precioMaterial: material?.precio,
      totalEtiquetas: frm.values?.detalles.totalEtiquetas?.value,
      totalPiezas: frm.values?.detalles.totalPiezas?.value,
      cantidadSuaje: suaje?.cantidad ? suaje?.cantidad : 1,
      precioSuaje: suaje?.precio ? suaje?.precio : 0,
      totalBajadas: frm.values?.detalles.totalBajadas?.value,
      precioGuillotina: frm.values.precioBajadaGuillotina,
      tintas: frm.values?.tintas,
      terminados: frm.values?.terminados,
      totalTiros: frm.values?.detalles.totalTiros?.value | 0,
      placas: frm.values?.placas,
      canvas: canvas,
    })

    frm.setFieldValue('totales', totales)
    setSelectedTab(1)
  }


  const handleCotizar = () => {
    console.log(frm.values)
  }

  return (
    <>
      <div className="relative flex w-full h-screen bg-slate-100">
        <form onSubmit={frm.handleSubmit} className="relative flex flex-col w-full h-full">

          {/* Page Header */}
          <div className='flex justify-between w-full px-6 py-3'>
            <h1 className=" text-2xl font-[800] text-emerald-800">Cotizacion</h1>
            {ready &&
              <input value='Cotizar'
                type='submit'
                className='px-10 text-md btn-emerald' />}
          </div>

          <div ref={whiteWindowRef} className="flex h-full">
            <AbsScroll vertical>
              <div className='pb-2 pl-4 pr-4'>
                <div className='grid grid-cols-2 gap-3'>

                  {/* Seleccion del tipo de trabajo y materiales */}
                  <FrmTipoCotizacion
                    formik={frm}
                  />


                  { // Si el material y el tipo de corte estan seleccionados
                    frm?.values.material &&
                    ((frm?.values.corte === 'Guillotina' && frm?.values.ancho && frm?.values.alto) ||
                      (frm?.values.corte === 'Etiquetas' && frm.values.suaje) ||
                      (frm?.values.corte === 'Notas' && frm.values.nota)) &&

                    <>

                      {/* Seleccion de detalles de pliegos */}
                      <div className='w-full col-span-2 bg-white rounded-md shadow-md sm:col-span-1' style={{ minHeight: `${whiteWindowRef.current?.clientHeight - 12}px` }}>
                        <FrmDetallesCotizacion
                          formik={frm}
                          calcularDetalles={calcularDetalles}
                          calcularTotales={calcularTotales}
                          pageHeight={whiteWindowRef.current?.clientHeight}
                        />
                      </div>

                      {/* Vizualizar informacion */}
                      <div className='flex flex-col w-full col-span-2 bg-white rounded-md shadow-md sm:col-span-1' style={{ minHeight: `${whiteWindowRef.current?.clientHeight - 12}px` }}>

                        <div className='flex pt-2 pl-6 border-b'>
                          {
                            Tabs.map((t, i) =>
                              <button
                                className={`h-10 px-4 border-b font-semibold
                                  ${selectedTab === t.value ? 'text-emerald-500 border-emerald-500' : 'text-gray-500 border-b-transparent'}
                                  `}
                                onClick={() => setSelectedTab(t.value)}
                                type="button" key={`TAB_${i}`}>
                                {t.label}
                              </button>)
                          }
                        </div>
                        {
                          selectedTab === 0 &&
                          <Visualizer
                            pieces={pieces}
                            canvas={canvas}
                            piece={piece}
                            margin={margin}
                          />
                        }
                        {
                          selectedTab === 1 &&
                          <>{detailsCalculated ?
                            <AbsScroll vertical>
                              <div className='px-2 py-6 sm:px-9'>
                                {
                                  frm?.values.detalles && <>
                                    <h2 className='w-full px-4 pt-8 pb-4 text-emerald-900'>Detalles generales de la cotización</h2>
                                    {Object.keys(frm?.values.detalles).map((d, i) =>
                                      <DetailRow
                                        key={`D_${i}`}
                                        data={frm.values.detalles[d]} />)}
                                  </>
                                }
                                {
                                  frm?.values.totales && <>
                                    <h2 className='w-full px-4 pt-8 pb-4 text-emerald-900'>Cuenta</h2>
                                    {Object.values(frm?.values.totales).map((total, i) =>
                                      <DetailRow
                                        key={`D_${i}`}
                                        data={total}
                                        decorador='$ '
                                      />)}
                                  </>
                                }
                              </div>
                            </AbsScroll> :
                            <div className='w-full h-full bg-gray-100 total-center'>
                              <p className='italic font-semibold text-gray-600'>
                                Calcula los detalles de la cotización
                              </p>
                            </div>
                          }
                          </>
                        }
                      </div>
                    </>
                  }
                </div>
              </div>
            </AbsScroll>
          </div>
        </form>
      </div>

      {showModal &&
        <Modal
          //image={<MyIcons.Cotizar size="36px" className='text-emerald-800' />}
          //title={'Detalles de la cotización'}
          //info={<Summary data={getSummaryData()} />}
          onClose={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
          onConfirm={handleCotizar}
        />
      }
    </>
  )
}

export default CotizarPage