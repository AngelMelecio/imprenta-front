import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import Inpt from '../../components/Inpt'
import { useFormik } from 'formik'
import AbsScroll from '../../components/AbsScroll'
import { MyIcons } from '../../constants/Icons'
import { useTerminados } from './hooks/TerminadosContext';
import Opts from '../../components/Opts';
import { useAuth } from '../../context/authContext';

const DetailTerminado = () => {

    const { id } = useParams()
    const { notify } = useAuth()
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false)
    const [fieldChanged, setFieldChanged] = useState(false)
    const { getTerminado, updateTerminado } = useTerminados()

    const frm = useFormik({
        initialValues: {},
        validate: (values) => {
            const errors = {}

            if (!values.nombre || values.nombre === '') {
                errors.nombre = 'Ingresa el nombre de la nota';
            }


            if (!values.cantidad || values.cantidad === '') {
                errors.cantidad = 'Ingresa el cantidad';
            }

            if (!values.precio || values.precio === '') {
                errors.precio = 'Ingresa el precio';
            }
            if (!values.tipoTrabajo || values.tipoTrabajo === '') {
                errors.tipoTrabajo = 'Ingresa el tipo de trabajo'
            }

            return errors
        },
        onSubmit: async (values) => {
            try {
                setLoading(true)
                await updateTerminado(values)
                navigate('/terminados')

            } catch (e) {

            } finally {
                setLoading(false)
            }
        }
    })

    const load = async () => {
        try {
            setLoading(true)
            const terminado = await getTerminado(id)
            console.log('terminado -> ', terminado)
            frm.setValues(terminado)
        } catch (e) {
            notify('!No fue posible cargar el terminado¡', true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <form className='flex flex-col w-full h-screen p-3' onSubmit={frm.handleSubmit}>
            <div className='flex items-end justify-between pb-3'>
                <div className='flex flex-row'>
                    <button
                        type='button'
                        onClick={() => navigate('/terminados')}
                        className="w-10 h-10 rounded-full btn-neutral total-center"> <MyIcons.Left size="30px" color='#047857' /> </button>
                    <h1 className='pl-3 text-3xl text-emerald-800 '>Editar terminado</h1>
                </div>
                <input className='px-10 py-1.5 rounded-lg btn-emerald' value="Guardar" type='submit' />
            </div>
            <div className='w-full h-full bg-white rounded-lg shadow-md'>
                <AbsScroll vertical loading={frm.values === null}>
                    <div className="flex flex-wrap px-2 pt-6 sm:px-9">
                        <div className='flex flex-row w-full h-full p-2 total-center'>
                            <div className="relative flex items-center justify-center w-full text-center">
                                <MyIcons.Brush className='' size='100px' style={{ color: '#065f46' }} />
                            </div>
                        </div>
                        <div className='flex-grow w-full px-5 mb-6'>
                            <h2 className='text-lg font-bold text-emerald-800 '>
                                Datos del terminado
                            </h2>
                        </div>

                        <div className="flex-grow w-full px-4 ">
                            <Inpt
                                onKeyDown={() => setFieldChanged(true)}
                                type="text" name="nombre" formik={frm} label="Nombre" />
                        </div>

                        <div className="flex-grow w-full px-4 sm:w-1/3">
                            <Inpt
                                onKeyDown={() => setFieldChanged(true)}
                                name="cantidad" formik={frm} label="Cantidad (mínima)"
                                type="number" step={0.1}
                            />
                        </div>
                        <div className="flex-grow w-full px-4 sm:w-1/3">
                            <Inpt
                                onKeyDown={() => setFieldChanged(true)}
                                name="precio" formik={frm} label="Precio"
                                type="number" step={0.1}
                            />
                        </div>
                        <div className='flex-grow w-full px-4 sm:w-1/3'>
                            <Opts
                                onKeyDown={() => setFieldChanged(true)}
                                name="tipoTrabajo" formik={frm} label="Tipo de trabajo"
                                options={[
                                    { value: 'Etiquetas', label: 'Etiquetas' },
                                    { value: 'Notas', label: 'Notas' },
                                ]}
                            />
                        </div>
                    </div>
                </AbsScroll>
            </div>
        </form>
    )
}

export default DetailTerminado