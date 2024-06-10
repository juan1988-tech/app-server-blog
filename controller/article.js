const Articulo = require('../models/article');
const { validar_articulo } = require('../helper/validator')
const fs = require('node:fs');
const path = require('node:path')

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

const subir_archivos = (req,res) =>{
    let archivo = req.file.originalname;
    let archivo_split = archivo.split("\.")
    let extention = archivo_split[1].toLowerCase();
    
    if(!req.file){
       console.log('no hay archivo enviado')
    }

    if(extention !="jpg" && extention !="png" && extention !="jpeg" && extention !="gif"){
           console.log(extention);
            fs.unlink(req.file.path,(error)=>{
              return res.status(404).json({
                status:"error",
                mensaje:"no es un archivo de imagen"
              })
            })
    }
    else{
        let articulo_id = req.params.id;

        //Buscar y actualizar el artículo
        Articulo
        .findOneAndUpdate({_id: articulo_id},{ imagen: req.file.filename },{new: true})
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
                mensaje: "artículo actualizado exitosamente",
                fichero: req.file
            })
        })
    } 
}

const imagen = (req,res) =>{
    let fichero =  req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/" + fichero;

    fs.stat(ruta_fisica,(error,existe)=>{
        if(existe){
            return res.sendFile(path.resolve(ruta_fisica))
        }
        else{
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe",
                existe,
                fichero,
                ruta_fisica
            })
        }
    })
}

const buscador = (req,res) =>{
    //Sacar el string de busqueda
    let busqueda = req.params.busqueda

    //Find a la colección aplicandole un $or
     Articulo.find({
        $or:[
            { titulo: {"$regex": busqueda, "$options": "i"} },
            { contenido: {"$regex": busqueda, "$options": "i"} }
        ]
    }).sort({fecha: -1}).exec().then((articulosEncontrados)=>{
        //let foundedArticles = articulosEncontrados;
        
        if(!articulosEncontrados || articulosEncontrados.length <= 0){
            return res.status(404).json({
                status:"failed",
                message:"No se han encontrado artículos"
            })
        }

        return res.status(200).json({
            status: "successs",
            articulos: articulosEncontrados
        })
    })
    

    

    //Ejecutar consulta

    //devolver resultado
}


module.exports ={
    test,
    create,
    listArticles,
    un_articulo,
    borrar,
    editar,
    subir_archivos,
    imagen,
    buscador
}