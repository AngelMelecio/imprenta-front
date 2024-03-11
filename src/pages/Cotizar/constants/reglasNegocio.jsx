import { useEffect } from "react"

const getDetalles = ({
    // Guillotina o Suaje
    tipo,

    // Alguna de las dos
    pliegosCotizar = null,
    piezasCotizar = null,

    // Información necesaria
    impresionesPliego,
    cortesImpresion,
    piezasSuaje = 1, // Será 1 cuando sea Guillotina

    cortesFila,
    cortesColumna,
    alturaGuillotina
}) => {

    // Si tomáramos pliegos parciales
    let totalTentativaImpresiones =
        pliegosCotizar !== null ? (
            pliegosCotizar * impresionesPliego
        ) : (
            Math.ceil(piezasCotizar / (cortesImpresion * piezasSuaje))
        )


    let totalPliegos = {
        label: 'Total de pliegos',
        value:
            pliegosCotizar !== null ? (
                pliegosCotizar
            ) : (
                Math.ceil(totalTentativaImpresiones / impresionesPliego)
            )
    }
    let totalImpresiones = {
        label: 'Total de impresiones',
        value: totalPliegos.value * impresionesPliego
    }
    let etiquetasImpresion = {
        label: 'Etiquetas por impresión',
        value: cortesImpresion * piezasSuaje
    }
    let totalEtiquetas = {
        label: 'Total de etiquetas',
        value: totalImpresiones.value * cortesImpresion * piezasSuaje
    }
    let totalPiezas = {
        label: 'Total de piezas',
        value: totalImpresiones.value * cortesImpresion
    }
    let totalBajadas = {
        label: 'Total de bajadas',
        value: (cortesFila + 1 + cortesColumna + 1) * Math.ceil(totalImpresiones.value / alturaGuillotina)
    }

    let ret = {
        totalPliegos,
        totalImpresiones,
    }
    if (tipo === 'Etiquetas') {
        ret = {
            ...ret,
            etiquetasImpresion,
            totalEtiquetas
        }
    } else {
        ret = {
            ...ret,
            totalPiezas
        }
    }
    ret = {
        ...ret,
        totalBajadas
    }
    return ret
}

const getTotales = ({
    tipo,

    totalPliegos,
    totalImpresiones,
    precioMaterial,

    totalEtiquetas,
    totalPiezas,
    cantidadSuaje,
    precioSuaje,

    totalBajadas,
    precioGuillotina,
    
    tintas,
    terminados
}) => {
    console.log('tipo -> ', tipo)
    console.log('tintas -> ', tintas)
    console.log('terminados -> ', terminados)
    console.log('totalEtiquetas -> ', totalEtiquetas)

    if (tipo === 'Guillotina') totalEtiquetas = totalPiezas
    

    let totalMaterial = {
        label: 'Total material',
        value: totalPliegos * precioMaterial
    }
    let totalSuaje = {
        label: 'Costo por cantidad (Suaje)',
        value: Number(
            (totalEtiquetas <= cantidadSuaje) ?
                precioSuaje :
                ((totalEtiquetas * precioSuaje) / cantidadSuaje)
        )
    }
    let totalGuillotina = {
        label: 'Costo de guillotina (bajadas)',
        value: totalBajadas * precioGuillotina
    }

    let totalTintas = {
        label: 'Costo por tintas',
        value:
            Number(tintas.front.reduce((acc, curr) => acc + ((totalEtiquetas <= Number(curr.value.cantidad)) ?
                Number(curr.value.precio) : Number((totalEtiquetas * Number(curr.value.precio)) / Number(curr.value.cantidad))), 0) +

                tintas.back.reduce((acc, curr) => acc + ((totalEtiquetas <= Number(curr.value.cantidad)) ?
                    Number(curr.value.precio) : Number((totalEtiquetas * Number(curr.value.precio)) / Number(curr.value.cantidad))), 0)).toFixed(2)
    }

    let totalTerminados = {
        label: 'Total terminados',
        value: Number(terminados.front.reduce((acc, curr) => acc + ((totalEtiquetas <= Number(curr.value.cantidad)) ?
            Number(curr.value.precio) : Number((totalEtiquetas * Number(curr.value.precio)) / Number(curr.value.cantidad))), 0) +

            terminados.back.reduce((acc, curr) => acc + ((totalEtiquetas <= Number(curr.value.cantidad)) ?
                Number(curr.value.precio) : Number((totalEtiquetas * Number(curr.value.precio)) / Number(curr.value.cantidad))), 0)).toFixed(2)
    }
    let ret = {
        totalMaterial,
        totalGuillotina,
        totalTintas,
        totalTerminados
    }
    if (tipo === 'Etiquetas') {
        ret = {
            ...ret,
            totalSuaje
        }
    }
    let total = {
        label: 'Total',
        value: Object.values(ret).reduce((acc, curr) => acc + Number(curr.value), 0).toFixed(2)
    }
    return {
        ...ret,
        total
    }
}
export { getDetalles, getTotales }