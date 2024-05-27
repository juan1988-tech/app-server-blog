const validator = require('validator');
const test = (req,res) =>{
    return res.status(200).json({
        mensaje:"Soy una acción de prueba de controlador"
    })
}

const create = (req,res) =>{
    let parametros = req.body;
    //validar los datos
    try{
        let validar_titulo = !validator.isEmpty(parametros.titulo) && validator.isLength(parametros.titulo,{min:5,max:undefined})
        let validar_contenido = !validator.isEmpty(parametros.contenido)
        if(!validar_titulo || !validar_contenido){
            throw new Error('no se ha validado la información')
        }
    }
    catch(error){
        return res.status(400).json({
            status:"error",
            mensaje:"faltan datos por enviar"
        })
    }

    return res.status(200).json({
        mensaje:"Soy la acción de guardar",
        parametros
    })
}


module.exports ={
    test,
    create
}