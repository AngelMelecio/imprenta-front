import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '../../../context/authContext';
import { useAxios } from '../../../context/axiosContext';
import { HOST } from '../../../constants/ENVs';

const MaterialContext = createContext();

export const useMaterial = () => {
    return useContext(MaterialContext);
};

function formatMateriales(materiales) {
    return materiales.map(material => ({
        ...material,
        categoria: material.categoria.nombre,
        tipoMaterial: material.tipoMaterial.nombre
    }))
}

function formatMaterial(material) {
    return ({
        ...material,
        categoria: {
            label: material.categoria.nombre,
            value: material.categoria.idCategoria
        },
        tipoMaterial: {
            label: material.tipoMaterial.nombre,
            value: material.tipoMaterial.idTipoMaterial
        }
    })
}

export const MaterialProvider = ({ children }) => {

    const { session, notify } = useAuth()
    const { myAxios } = useAxios()
    const API_MATERIALES_URL = 'api/materiales/'
    const [allMateriales, setAllMateriales] = useState([])
    const [allTipoMateriales, setAllTipoMateriales] = useState([])

    async function getMaterial(id) {
        const resp = await myAxios.get(API_MATERIALES_URL + id)
        return formatMaterial(resp.data)
    }

    async function getAll() {
        const resp = await myAxios.get(API_MATERIALES_URL)
        return formatMateriales(resp.data)
    }

    async function refreshAllMateriales() {
        try {
            const resp = await myAxios.get(API_MATERIALES_URL)
            setAllMateriales(formatMateriales(resp.data))
        } catch (err) {
            notify("No fue posible obtener los registros", true);
        }
    }

    async function getMaterialesString(){
        try {
            const resp = await myAxios.get('api/materialesString')
            return resp.data
        } catch (err) {
            notify("No fue posible obtener los registros", true);
        }
    }

    async function createMaterial(material) {
        console.log(material)
        let formData = new FormData()
        Object.keys(material).forEach(key => {
            formData.append(key, material[key])
        })
        try {
            const resp = await myAxios.post(API_MATERIALES_URL, formData)
            notify(resp.data.message)
        } catch (err) {
            console.log(err)
            //notify(err.response.data.message, true);
        }
    }

    async function deleteMaterial(list) {
        for (let i = 0; i < list.length; i++) {
            try {
                const resp = await myAxios.delete(API_MATERIALES_URL + list[i])
                notify(resp.data.message)
            } catch (err) {
                notify('No fue posible eliminar el material', true)
            }
        }
    }

    async function updateMaterial(material) {
        let formData = new FormData()
        Object.keys(material).forEach(key => {
            if (material[key] !== null && material[key] !== '') formData.append(key, material[key])
        })
        try {
            const response = await myAxios.put(API_MATERIALES_URL + material.idMaterial, formData);
            notify(response.data.message);
        } catch (error) {
            notify("No fue posible actualizar el material", true);
        }
    }

    async function refreshAllTipoMateriales() {
        try {
            const resp = await myAxios.get('api/tiposMateriales/')
            setAllTipoMateriales(resp.data)

        } catch (err) {
            notify("No fue posible obtener los registros", true);
        }
    }

    async function saveTipo(tipo) {
        try {
            let res = await myAxios.post('api/tiposMateriales/', { nombre: tipo })
            setAllTipoMateriales(res.data.tipos)
            let { idTipoMaterial, nombre } = res.data.newTipo
            notify(res.data.message)
            return ({
                label: nombre,
                value: idTipoMaterial
            })
        } catch (e) {
            if (e.response)
                console.log(e.resonse)
            else
                throw new Error("Error de conexión")
            //throw new Error(e.resonse)
        }
    }
    async function deleteTipo(id) {
        try {
            await myAxios.delete(`api/tiposMateriales/${id}`)
            refreshAllTipoMateriales()
            notify("Tipo de material eliminado")
        } catch (e) {
            if (e.response)
                console.log(e.resonse)
            else
                throw new Error("Error de conexión")
        }
    }

    return (
        <MaterialContext.Provider value={{
            getMaterial, getAll,
            getMaterialesString,
            allMateriales,
            refreshAllMateriales,
            createMaterial,
            deleteMaterial,
            updateMaterial,
            allTipoMateriales, refreshAllTipoMateriales,
            saveTipo, deleteTipo

        }}>
            {children}
        </MaterialContext.Provider>
    );
};
