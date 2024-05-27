const test = (req,res) =>{
    return res.status(200).json({
        mensaje:"Soy una acción de prueba de controlador"
    })
}

const create = (req,res) =>{
    return res.status(200).json({
        mensaje:"Soy la acción de guardar"
    })
}


module.exports ={
    test,
    create
}