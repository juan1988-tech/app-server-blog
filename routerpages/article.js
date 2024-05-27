const express = require('express');
const router = express.Router();
const articleController = require('../controller/article')

router.get('/ruta-de-prueba',articleController.test)
router.post('/crear',articleController.create)

module.exports = router