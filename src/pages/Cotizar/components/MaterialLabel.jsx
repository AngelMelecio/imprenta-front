const MaterialLabel = ({ material }) => {
    return (
        <div className="flex ">
            <span className="mr-5 whitespace-nowrap">{material.categoria}</span>
            <span className="mr-5 whitespace-nowrap">{material.tipoMaterial}</span>
            <span className="mr-5 whitespace-nowrap">{material.alto}cm x {material.ancho}cm</span>
            <span className="mr-5 whitespace-nowrap">{material.gramaje ? `${material.gramaje}gr` : ''}</span>
            <span className="mr-5 whitespace-nowrap">{material.grosor}</span>
            <span className="mr-5 whitespace-nowrap">{material.color}</span>
            <span className="mr-5 whitespace-nowrap">${material.precio}</span>
        </div>
    );
};

export default MaterialLabel;