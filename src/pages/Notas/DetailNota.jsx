import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import Inpt from '../../components/Inpt'
import { useFormik } from 'formik'
import AbsScroll from '../../components/AbsScroll'
import { MyIcons } from '../../constants/Icons'
import { useNotas } from './hooks/NotasContext';
import { useAuth } from '../../context/authContext';

const DetailNota = () => {

    const { id } = useParams()
    const { notify } = useAuth()
    const { getNota, updateNota } = useNotas()
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false)
    const [fieldChanged, setFieldChanged] = useState(false)

    const frm = useFormik({
        initialValues: {},
        validate: (values) => {
            const errors = {}

            if (!values.nombre || values.nombre === '') {
                errors.nombre = 'Ingresa el nombre de la nota';
            }


            if (!values.ancho) {
                errors.ancho = 'Ingresa el ancho';
            }

            if (!values.alto) {
                errors.alto = 'Ingresa el alto';
            }

            return errors
        },
        onSubmit: async (values) => {
            try {
                setLoading(true)
                await updateNota(values)
                navigate('/notas')

            } catch (e) {

            } finally {
                setLoading(false)
            }
        }
    })

    const load = async () => {
        try {
            setLoading(true)
            const nota = await getNota(id)
            frm.setValues(nota)
        } catch (e) {
            notify('!No fue posible cargar la nota¡', true)
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
                        onClick={() => navigate('/notas')}
                        className="w-10 h-10 rounded-full btn-neutral total-center"> <MyIcons.Left size="30px" color='#047857' /> </button>
                    <h1 className='pl-3 text-3xl text-emerald-800 '>Editar nota</h1>
                </div>
                <input
                    disabled={!fieldChanged}
                    className='px-10 py-1.5 rounded-lg btn-emerald' value="Guardar" type='submit' />
            </div>
            <div className='w-full h-full bg-white rounded-lg shadow-md'>
                <AbsScroll vertical loading={loading}>
                    <div className="flex flex-wrap px-2 pt-6 sm:px-9">

                        <div className='flex flex-row w-full h-full p-2 total-center'>
                            <div className="relative flex items-center justify-center w-full text-center">
                                <MyIcons.Notes className='' size='100px' style={{ color: '#065f46' }} />
                            </div>
                        </div>
                        <div className='flex-grow w-full px-5 mb-6'>
                            <h2 className='text-lg font-bold text-emerald-800 '>
                                Datos de la nota
                            </h2>
                        </div>

                        <div className="flex-grow w-full px-4 sm:w-1/2">
                            <Inpt
                                onKeyDown={() => setFieldChanged(true)}
                                type="text" name="nombre" formik={frm} label="Nombre" />
                        </div>

                        <div className="flex-grow w-full px-4 sm:w-1/4">
                            <Inpt
                                onKeyDown={() => setFieldChanged(true)}
                                name="alto" formik={frm} label="Alto (cm)"
                                type="number" step={0.1}
                            />
                        </div>
                        <div className="flex-grow w-full px-4 sm:w-1/4">
                            <Inpt
                                onKeyDown={() => setFieldChanged(true)}
                                name="ancho" formik={frm} label="Ancho (cm)"
                                type="number" step={0.1}
                            />
                        </div>
                    </div>
                </AbsScroll>
            </div>
        </form>
    )
}

export default DetailNota