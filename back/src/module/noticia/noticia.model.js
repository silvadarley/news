// import mongoose from 'mongoose';
// const { Schema } = mongoose;
const mongoose = require('../../config/mongo.js');
const { Schema } = mongoose;

const noticiasSchema = new Schema({
    titulo: String,
    img: String,
    texto: String,
    categoria: String,
},
    {
        timestamps: true,
    }
);

const NoticiaModel = mongoose.model('noticias', noticiasSchema);

module.exports = NoticiaModel;
