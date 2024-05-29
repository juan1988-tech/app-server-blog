const Articulo = require('../models/article');
const { validar_articulo } = require('../helper/validator')

const test = (req,res) =>{
    return res.status(200).json({
        mensaje:"Soy una acción de prueba de controlador"
    })
}

const create = (req,res) =>{
    let parametros = req.body;
    //validar los datos
    try{
        validar_articulo(parametros)
    }
    catch(error){
        return res.status(400).json({
            status:"error",
            mensaje:"faltan datos por enviar"
        })
    }

    //Crear objeto a guardar
    const articulo = new Articulo(parametros);

    //Guardar un artículo en la base de datos
    articulo.save()
        .then((articulo_guardado)=>{
            if(!articulo_guardado){
                return res.status(400).json({
                    status:"error",
                    mensaje:"Artículo perdido a enviar"
                })
            }

            return res.status(200).json({
                status: "success",
                articulo: articulo_guardado,
                mensaje: "Artículo guardado exitosamente"
            })
        })  
        .catch((error)=>{
            console.log(error)
        })
}

const listArticles = (req,res) =>{
   let consulta = Articulo.find({});
   if(req.params.ultimos){
    consulta.limit(3) 
   } 
   
   consulta 
   .sort({fecha: -1})
   .exec()
   .then((listado_articulos)=>{
        if(!listado_articulos){
            return res.status(400).json({
                status:"error",
                mensaje:"No hay artículos"
            })
        }

        return res.status(200).json({
            status: "success",
            articulo: listado_articulos,
            mensaje: "Lista de articulos",
        })

    })
    .catch((error)=>{
        console.log(error)
    })
}

const un_articulo = (req,res) =>{
    //recoger un id por la url
    let id = req.params.id;
    //buscar un artículo con el método
    Articulo.findById(id).exec()
        .then((articulo)=>{
            if(!articulo){
                return res.status(400).json({
                    status:"error",
                    mensaje:"Artículo perdido a enviar"
                })
            }

            return res.status(200).json({
                status:"success",
                mensaje: `${id}`,
                articulo
            })
        })
        .catch((error)=>{
            console.log(error)
        })
}

const borrar = (req,res) =>{
   let articulo_id = req.params.id;
   
   Articulo
   .findOneAndDelete({ _id: articulo_id })
   .then((articulo_borrado)=>{

    if(!articulo_borrado){
        return res.status(404).json({
            status: "failed",
            articulo: articulo_borrado,
            mensaje: "no existe el articulo a borrar"
           })
    }

    return res.status(200).json({
        status: "success",
        articulo: articulo_borrado,
        mensaje: "artículo borrado exitosamente"
       })
   })
}

const editar = (req,res) =>{
    let articulo_id = req.params.id;

    //requerir los datos del body
    let parametros = req.body;
    try{
        validar_articulo(parametros)
    }
    catch(error){
        return res.status(400).json({
            status:"error",
            mensaje:"faltan datos por enviar"
        })
    }

    
    //Buscar y actualizar el artículo
    Articulo
    .findOneAndUpdate({_id: articulo_id},parametros,{new: true})
    .then((articulo_actualizado)=>{
        if(!articulo_actualizado){
            return res.status(500).json({
                status: "error",
                mensaje: "error al actualizar"
            })
        }

        return res.status(200).json({
            status:"success",
            articulo: articulo_actualizado,
            mensaje: "artículo actualizado exitosamente"
        })

    })
}



module.exports ={
    test,
    create,
    listArticles,
    un_articulo,
    borrar,
    editar
}