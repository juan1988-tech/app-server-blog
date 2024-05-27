/*conexion a la base de datos*/
const { connection } = require('./database/connection');
const cors = require('cors');
const articleroutes = require('./routerpages/article')

connection()

/*creando el servidor*/

const express = require('express');

const app = express();

app.use(cors())

const port = 3000;

app.listen(port,()=>{
    console.log(`El servidor está corriendo en el puero ${port}`)
})

/*creando una ruta de prueba*/ 

app.get("/probando",(req,res)=>{
    console.log(`Dirigete a la ruta http://localhost:3000/probando`)
    return res.status(200).send({
        nombre: 'Juan David Franco',
        edad: '35 annos'
    })
})

/*probando rutas con el controlador*/ 

app.use('/api',articleroutes)
