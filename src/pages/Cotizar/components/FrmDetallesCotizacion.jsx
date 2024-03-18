import React from 'react'
import AbsScroll from '../../../components/AbsScroll'
import FractionSelect from './FractionSelect'
import MarginSelect from './MarginSelect'
import Inpt from '../../../components/Inpt'
import TintaSelect from './TintaSelect'
import FrmTintas from './FrmTintas'
import Opts from '../../../components/Opts'
import FrmTerminados from './FrmTerminados'

const FrmDetallesCotizacion = ({ formik, calcularDetalles, calcularTotales, pageHeight }) => {

  /**
   * Detalles de la cotizacion
   */
  return (
    <AbsScroll vertical>
      <div className="flex flex-col flex-wrap w-full px-2 pt-6 sm:px-9">

        <h2 className='p-5 text-emerald-900'>Datos generales del corte</h2>

        {/* Selector de Fracción de Pliego */}
        <FractionSelect
          formik={formik}
          name="fraccion"
        />

        {/* Selector de Margen */}
        <MarginSelect
          formik={formik}
          name="margin"
          className="pb-5"
        />

        {/* Piezas o Pliegos a cotizar */}
        <div className={`flex-grow w-full px-3 mt-2`}>
          <Inpt
            label="Cantidad de piezas"
            name="cantidadPiezas"
            formik={formik}
            type="number"
          />
        </div>
        <div className={`flex-grow w-full  px-3`}>
          <Inpt
            label="Cantidad de pliegos"
            name="cantidadPliegos"
            formik={formik}
            type="number"
          />
        </div>

        <div className={`flex-grow w-full px-3`}>
          <Inpt
            label="Precio por bajada (Guillotina)"
            name="precioBajadaGuillotina"
            formik={formik}
            type="number"
          />
        </div>

        { // Boton para calcular detalles y activar el siguiente formulario
          !formik?.values.detalles &&
          <div className="w-full px-3 pb-5">
            <button
              onClick={() => calcularDetalles(formik.values)}
              type="button" className='w-full h-10 btn-emerald'>
              Calcular Detalles
            </button>
          </div>}

      </div>

      {formik?.values.detalles &&
        <div className='w-full px-2 pt-6 sm:px-9' style={{ minHeight: `${pageHeight - 12}px` }}>

          <FrmTintas
            formik={formik}
          />

          <FrmTerminados
            formik={formik}
          />

          {
            formik?.values.prensa &&
            <div className="w-full px-3 mt-4">
              <button
                type="button"
                onClick={calcularTotales}
                className='w-full h-10 btn-emerald'>
                Calcular Costo
              </button>
            </div>
          }
        </div>
      }
    </AbsScroll>
  )
}

export default FrmDetallesCotizacion