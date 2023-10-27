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
    }))
}

export const MaterialProvider = ({ children }) => {

    const { session, notify } = useAuth()
    const { myAxios } = useAxios()
    const [allMateriales, setAllMateriales] = useState([])
    const API_MATERIALES_URL = 'api/materiales/'

    async function getMaterial(id) {
        const resp = await myAxios.get(API_MATERIALES_URL + id)
        return resp.data
    }

    async function getAll() {
        const resp = await myAxios.get(API_MATERIALES_URL)
        return resp.data
    }

    async function refreshAllMateriales() {
        try {
            const resp = await myAxios.get(API_MATERIALES_URL)
            setAllMateriales(formatMateriales(resp.data))
        } catch (err) {
            notify("No fue posible obtener los registros", true);
        }
    }

    async function createMaterial(material) {
        let formData = new FormData()
        Object.keys(material).forEach(key => {
            formData.append(key, material[key])
        })
        try {
            const resp = await myAxios.post(API_MATERIALES_URL, formData)
            notify(resp.data.message)
        } catch (err) {
            notify(err.response.data.message, true);
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



    return (
        <MaterialContext.Provider value={{
            getMaterial, getAll,
            allMateriales,
            refreshAllMateriales,
            createMaterial,
            deleteMaterial,
            updateMaterial
        }}>
            {children}
        </MaterialContext.Provider>
    );
};
