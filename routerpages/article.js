const express = require('express');
const router = express.Router();
const articleController = require('../controller/article')

router.get('/ruta-de-prueba',articleController.test)
router.post('/crear',articleController.create)
router.get('/lista-de-articulos/:ultimos?',articleController.listArticles)
router.get('/articulo/:id',articleController.un_articulo)

module.exports = router