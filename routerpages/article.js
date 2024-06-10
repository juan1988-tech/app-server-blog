const express = require('express');
const router = express.Router();
const multer = require('multer');
const articleController = require('../controller/article')

const almacenamiento = multer.diskStorage({
     destination: function(req,file,cb) {
         cb(null,'./imagenes/articulos')
     },
    filename: function(req,file,cb){
        cb(null, "articulo" + Date.now() + file.originalname)
    }
})

const subir_archivos = multer({storage: almacenamiento})

router.get('/ruta-de-prueba',articleController.test)
router.post('/crear',articleController.create)
router.get('/lista-de-articulos/:ultimos?',articleController.listArticles)
router.get('/articulo/:id',articleController.un_articulo)
router.delete('/articulo/:id',articleController.borrar)
router.put('/articulo/:id',articleController.editar)
router.post('/subir-imagen/:id',[subir_archivos.single('file')],articleController.subir_archivos)
router.get('/imagen/:fichero',articleController.imagen)
router.get('/buscar/:busqueda',articleController.buscador)

module.exports = router 