const mongoose = require('mongoose');

const connection = async () =>{
    try{
        await mongoose.connect("mongodb://localhost:27017/app-server-blog")
        console.log('correctamente conectado a la base de datos')
    }catch(error){
        console.log(error);
        throw new Error(`We couldn't connect to the database`)
    }
}

module.exports = {
    connection
}
