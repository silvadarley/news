// import mongoose from 'mongoose';
// const mongoconfig = require('../../config/mongo.js');
const mongoose = require('../../config/mongo.js');
const { Schema } = mongoose;

// mongoconfig();
const usuarioSchema = new Schema({
    nome: String,
    email: String,
    senha: String,
},
    {
        timestamps: true,
    }
);

const UsuarioModel = mongoose.model('usuarios', usuarioSchema);

module.exports = UsuarioModel;
// export default UsuarioModel;
