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
import DetailRow from './components/DetailRow'

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

const CotizarPage = () => {

  const whiteWindowRef = useRef()

  /* Estados para controlar la logica*/
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
  const [piece, setPiece] = useState({ width: 1, height: 1, cortes: 1 })
  const [pieces, setPieces] = useState({ main: {}, remain: {} })

  const [margin, setMargin] = useState({})

  /* Funciones que traen la informacion de los materiales
  y suajes dse la base de datos*/
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

  /* Hooks para llenar los selects con la informacion correspondiente
  cuando cambian los suajes y materiales respectivamente*/
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

  /* Trae los datos de suajes y materiales */
  useEffect(() => {
    fetchMateriales()
    fetchSuajes()
  }, [])

  /* useFormik sirve para definir valores iniciales, 
  control y validacion de los datos asi como controlar 
  eventos (onsubmit) */
  const frm = useFormik({
    initialValues: {
      fraccion: { name: '1', w_div: 1, h_div: 1 },
      piezas: null,
      margin: 1.5,
      margin_top: 1.5,
      margin_bottom: 1.5,
      margin_left: 1.5,
      margin_right: 1.5,
      detailedMargin: false,
      precioBajadaGuillotina: 2,
    },
    validate: (values) => {
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
    },
    onSubmit: async (values) => {
      try {

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
      frm.values.corte === "Suaje"
        ? initDetails.suaje
        : initDetails.guillotina
    )
  }, [frm?.values.corte])

  useEffect(() => {
    setReady(frm.values.material &&
      ((frm.values.corte === 'Guillotina' && frm.values.ancho && frm.values.alto) ||
        (frm.values.corte === 'Suaje' && frm.values.suaje)))
  }, [
    frm?.values.material,
    frm?.values.corte,
    frm?.values.suaje,
    frm.values.ancho,
    frm.values.alto
  ])
  /* Llamamos a la funcion calculateArrangement cada vez que cambia
  alguno de los siguientes valores: material, suaje, medidas para guillotina, 
  fraccion y margenes */
  useEffect(() => {
    calculateArrangement()
  }, [
    frm?.values.material,
    frm?.values.suaje,
    frm?.values.ancho,
    frm?.values.alto,
    frm?.values.fraccion,
    frm?.values.margin,
    frm?.values.margin_top,
    frm?.values.margin_bottom,
    frm?.values.margin_left,
    frm?.values.margin_right,
    frm?.values.detailedMargin,
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
    if (frm?.values.corte === 'Suaje') {
      if (!frm?.values.suaje) return piece
      let { ancho, alto, numeroCortes } = allSuajes.find(s => s.idSuaje === frm?.values.suaje.value)
      piece = {
        width: Math.max(alto, ancho) || 1,
        height: Math.min(alto, ancho) || 1,
        cortes: numeroCortes,
      }
    }
    else {
      let { ancho, alto, numeroCortes } = frm?.values
      piece = {
        width: Math.max(alto, ancho) || 1,
        height: Math.min(alto, ancho) || 1,
        cortes: numeroCortes,
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

  const getSummaryData = () => {
    let material = allMateriales.find(m => m.idMaterial === frm?.values?.material?.value)
    if (frm.values.corte === 'Suaje') {
      let suaje = allSuajes.find(s => s.idSuaje === frm?.values?.suaje?.value)
      let cantPliegos = Math.ceil(frm.values.piezas / (frm.values.cortesPliego * suaje?.numeroCortes))

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

  /*Calcula los detalles de la cotizacion asi como los costos
  en base a los datos ingresados por el usuario*/
  const calcularDetalles = (values) => {
    let material = allMateriales.find(m => m.idMaterial === frm?.values?.material?.value)
    let suaje = allSuajes.find(s => s.idSuaje === frm?.values?.suaje?.value)
    let fraccion = frm.values.fraccion.w_div * frm.values.fraccion.h_div

    if (values.corte === 'Suaje' && frm.values.cantidadPiezas) {

      {
        /*
          let totalFracciones = Math.ceil(frm.values.cantidadPiezas / (frm.values.cortesPliego * suaje?.numeroCortes))
          let fraccion = frm.values.fraccion.w_div * frm.values.fraccion.h_div
          let totalPliegos = Math.floor(totalFracciones / fraccion)
          let residuo = totalFracciones % fraccion
        */
      }

      let tempTotalImpresiones = Math.ceil(frm.values.cantidadPiezas / (frm.values.cortesPliego * suaje?.numeroCortes))
      let totalPliegos = Math.ceil(tempTotalImpresiones / fraccion)
      let totalImpresiones = totalPliegos * fraccion
      let totalEtiquetas = totalImpresiones * frm?.values.cortesPliego * suaje?.numeroCortes
      let bajadasGuillotina = (pieces.main.rows + 1 + pieces.main.cols + 1) * Math.ceil(totalImpresiones / material?.alturaGuillotina)

      frm.setFieldValue('detalles', {
        totalImpresiones: {
          label: 'Total de impresiones',
          value: totalImpresiones,
        },
        totalPliegos: {
          label: 'Total de pliegos',
          value: totalPliegos
        },
        etquetasFraccion: {
          label: 'Etiquetas por tamaño',
          value: frm.values.cortesPliego * suaje?.numeroCortes,
        },
        totalEtiquetas: {
          label: 'Total de etiquetas',
          value: totalEtiquetas,
        },
        /*totalSuajadas: {
          label: 'Total de suajadas',
          value: totalImpresiones * frm?.values.cortesPliego,
        }*/
        totalBajadas: {
          label: 'Total de bajadas (guillotina)',
          value: bajadasGuillotina,
        }
      })
      frm.setFieldValue('totales', {
        totalMaterial: {
          label: 'Costo de material',
          value: ((totalPliegos) * material?.precio).toFixed(2),
        },
        totalSuaje: {
          label: 'Costo por catidad (Suaje)',
          value: ((totalEtiquetas <= suaje.cantidad) ? suaje.precio : (totalEtiquetas * suaje.precio) / suaje.cantidad).toFixed(2),
        },
        totalGuillotina: {
          label: 'Costo de guillotina (bajadas)',
          value: (bajadasGuillotina * frm?.values.precioBajadaGuillotina).toFixed(2),
        }
      })
    }
    else if (values.corte === 'Suaje' && frm.values.cantidadPliegos) {

      let totalImpresiones = frm.values.cantidadPliegos * fraccion
      let totalEtiquetas = totalImpresiones * frm?.values.cortesPliego * suaje?.numeroCortes
      let bajadasGuillotina = (pieces.main.rows + 1 + pieces.main.cols + 1) * Math.ceil(totalImpresiones / material?.alturaGuillotina)

      frm.setFieldValue('detalles', {
        totalImpresiones: {
          label: 'Total de impresiones',
          value: totalImpresiones,
        },
        totalPliegos: {
          label: 'Total de pliegos',
          value: frm.values.cantidadPliegos,
        },
        etquetasFraccion: {
          label: 'Etiquetas por tamaño',
          value: frm.values.cortesPliego * suaje?.numeroCortes,
        },
        totalEtiquetas: {
          label: 'Total de etiquetas',
          value: totalEtiquetas,
        },
        /*totalSuajadas: {
          label: 'Total de suajadas',
          value: totalImpresiones * frm?.values.cortesPliego,
        }*/
        totalBajadas: {
          label: 'Total de bajadas (guillotina)',
          value: bajadasGuillotina,
        }
      })
      console.log("")
      frm.setFieldValue('totales', {
        totalMaterial: {
          label: 'Costo de material',
          value: '$ ' + frm.values.cantidadPliegos * material?.precio,
          //value: frm.values.cantidadPliegos+' pliegos x '+'$ '+material?.precio+ ' => $ ' + frm.values.cantidadPliegos * material?.precio,
        },
        totalSuaje: {
          label: 'Costo por catidad (Suaje)',
          value: '$ ' + ((totalEtiquetas <= suaje.cantidad) ? suaje.precio : (totalEtiquetas * suaje.precio) / suaje.cantidad),
          //value: totalEtiquetas+' etiquetas '+' => $'+((totalEtiquetas <= suaje.cantidad) ? suaje.precio : (totalEtiquetas * suaje.precio) / suaje.cantidad),
        },
        totalGuillotina: {
          label: 'Costo de guillotina (bajadas)',
          value: '$ ' + (bajadasGuillotina * frm?.values.precioBajadaGuillotina),
        }
      })
    }
    else if (frm.values.corte === 'Guillotina' && frm.values.cantidadPiezas) {

      let tempTotalImpresiones = Math.ceil(frm.values.cantidadPiezas / frm.values.cortesPliego)
      let totalPliegos = Math.ceil(tempTotalImpresiones / fraccion)
      let totalImpresiones = totalPliegos * fraccion
      let bajadasGuillotina = (pieces.main.rows + 1 + pieces.main.cols + 1) * Math.ceil(totalImpresiones / material?.alturaGuillotina)

      //let residuo = auxTotalImpresiones % fraccion

      frm.setFieldValue('detalles', {
        totalImpresiones: {
          label: 'Total de impresiones',
          value: totalImpresiones,
        },
        totalPliegos: {
          label: 'Total de pliegos',
          value: totalPliegos
        },
        totalPiezas: {
          label: 'Total de piezas',
          value: totalImpresiones * frm?.values.cortesPliego,
        },
        totalBajadas: {
          label: 'Total de bajadas (guillotina)',
          value: bajadasGuillotina,
        }
      })
      frm.setFieldValue('totales', {
        totalMaterial: {
          label: 'Costo de material',
          value: '$ ' + ((frm.values.cantidadPliegos) * material?.precio),
        },
        totalGuillotina: {
          label: 'Costo de guillotina (bajadas)',
          value: '$ ' + (bajadasGuillotina * frm?.values.precioBajadaGuillotina),
        }
      })

    }
    else if (frm.values.corte === 'Guillotina' && frm.values.cantidadPliegos) {

      let totalImpresiones = frm.values.cantidadPliegos * fraccion
      let totalEtiquetas = totalImpresiones * frm?.values.cortesPliego
      let bajadasGuillotina = (pieces.main.rows + 1 + pieces.main.cols + 1) * Math.ceil(totalImpresiones / material?.alturaGuillotina)

      frm.setFieldValue('detalles', {
        auxTotalImpresiones: {
          label: 'Total de impresiones',
          value: totalImpresiones,
        },
        totalPliegos: {
          label: 'Total de pliegos',
          value: frm.values.cantidadPliegos,
        },
        totalPiezas: {
          label: 'Total de piezas',
          value: totalEtiquetas,
        },
        totalBajadas: {
          label: 'Total de bajadas (guillotina)',
          value: (pieces.main.rows + 1 + pieces.main.cols + 1) * Math.ceil(totalImpresiones / material?.alturaGuillotina),
        }
      })

      frm.setFieldValue('totales', {
        totalMaterial: {
          label: 'Costo de material',
          value: '$ ' + ((frm.values.cantidadPliegos) * material?.precio),
        },
        totalGuillotina: {
          label: 'Costo de guillotina (bajadas)',
          value: '$ ' + (bajadasGuillotina * frm?.values.precioBajadaGuillotina),
        }
      })
    }

    frm.setFieldValue('totales', {
      ...frm.values.totales,
      total: {
        label: 'Total',
        value: Object.keys(frm?.values.totales).reduce((total, key) => {
          const value = Number(frm?.values.totales[key].value);
          return total + value;
        }, 0).toFixed(2)
      }
    });
    

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
                {ready &&
                  // Detalles
                  <>
                    <div style={{ minHeight: whiteWindowRef.current?.clientHeight }} className='flex flex-col w-full'>
                      <h2 className='w-full p-5 text-emerald-900'>Detalles</h2>
                      <div className='flex flex-grow'>
                        <div className='w-full'>
                          <AbsScroll vertical>
                            <FractionSelect
                              formik={frm}
                              name="fraccion"
                            />
                            <MarginSelect
                              formik={frm}
                              name="margin"
                            />
                            <div className="h-4"></div>
                            <div className={`flex-grow w-full px-3 mt-2`}>
                              <Inpt
                                label="Cantidad de piezas"
                                name="cantidadPiezas"
                                formik={frm}
                                type="number"
                              />
                            </div>
                            <div className={`flex-grow w-full  px-3`}>
                              <Inpt
                                label="Cantidad de pliegos"
                                name="cantidadPliegos"
                                formik={frm}
                                type="number"
                              />
                            </div>
                            <div className={`flex-grow w-full  px-3`}>
                              <Inpt
                                label="Precio por bajada (Guillotina)"
                                name="precioBajadaGuillotina"
                                formik={frm}
                                type="number"
                              />
                            </div>
                            {/*frm?.values.corte === 'Guillotina' &&
                              <div className={`flex-grow w-full  px-3`}>
                                <Inpt
                                  label="Cantidad de capas"
                                  name="capas"
                                  formik={frm}
                                  type="number"
                                />
                              </div>
                            */}
                            <div className="px-3 pb-5">
                              <button
                                onClick={() => calcularDetalles(frm.values)}
                                type="button" className='w-full h-10 btn-emerald'>
                                Calcular Detalles
                              </button>
                            </div>
                            {
                              frm?.values.detalles &&
                              Object.keys(frm?.values.detalles).map((d, i) =>
                                <DetailRow
                                  key={`D_${i}`}
                                  data={frm.values.detalles[d]} />)
                            }
                          </AbsScroll>
                        </div>
                        <div className='flex flex-col flex-grow w-full'>

                          <Visualizer
                            pieces={pieces}
                            canvas={canvas}
                            piece={piece}
                            margin={margin}
                          />

                          <h2 className='w-full p-5 text-emerald-900'>Cuenta</h2>
                          {
                            frm?.values.totales &&

                            Object.keys(frm?.values.totales).map((d, i) =>
                              <DetailRow
                                key={`D_${i}`}
                                data={frm.values.totales[d]}
                                decorador='$ '
                              />)
                          }

                        </div>

                      </div>


                    </div>
                  </>

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