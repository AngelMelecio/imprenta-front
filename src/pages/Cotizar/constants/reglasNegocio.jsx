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
    let totalTiros = {
        label: 'Total de tiros',
        value: (totalEtiquetas.value / piezasSuaje)
    }

    let ret = {
        totalPliegos,
        totalImpresiones,
    }
    if (tipo === 'Etiquetas') {
        ret = {
            ...ret,
            etiquetasImpresion,
            totalEtiquetas,
            totalTiros,
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
    terminados,

    totalTiros,
    placas,
    canvas
}) => {
    let totalMaterial = {
        label: 'Costo material',
        value: totalPliegos * precioMaterial
    }

    let totalSuaje = {
        label: 'Costo por tiraje y suaje',
        value: Number(
            (totalTiros <= cantidadSuaje) ?
                precioSuaje :
                ((totalTiros * precioSuaje) / cantidadSuaje)
        )
    }

    let totalGuillotina = {
        label: 'Costo de guillotina (bajadas)',
        value: totalBajadas * precioGuillotina
    }

    let totalTintas = {
        label: 'Costo por tintas',
        value:
            Number(tintas.front.reduce((acc, curr) => acc + ((totalImpresiones <= Number(curr.value.cantidad)) ?
                Number(curr.value.precio) : Number((totalImpresiones * Number(curr.value.precio)) / Number(curr.value.cantidad))), 0) +

                tintas.back.reduce((acc, curr) => acc + ((totalImpresiones <= Number(curr.value.cantidad)) ?
                    Number(curr.value.precio) : Number((totalImpresiones * Number(curr.value.precio)) / Number(curr.value.cantidad))), 0)).toFixed(2)
    }

    let totalTerminados = {
        label: 'Costo terminados',
        value: Number(
            terminados.front.reduce((acc, curr) => 
                acc +(((Number(canvas.height) / Number(curr.value.distancia))) * ((Number(canvas.width) / Number(curr.value.distancia))) * totalImpresiones * Number(curr.value.precio)), 0) +
            terminados.back.reduce((acc, curr) => 
                acc +(((Number(canvas.height) / Number(curr.value.distancia))) * ((Number(canvas.width) / Number(curr.value.distancia))) * totalImpresiones * Number(curr.value.precio)), 0)
        )
    }
    
    let totalPlacas = {
        label: 'Costo de placas',
        value: Number((placas.placasFront + placas.placasBack) * placas.precioPlaca)
    }

    let ret = {
        totalMaterial,
        totalGuillotina,
        totalTintas,
        totalTerminados,
        totalPlacas
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