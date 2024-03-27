const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const usuarioModel = require('./src/module/usuario/usuario.model.js');
const noticiaModel  = require('./src/module/noticia/noticia.model.js');

const app = express();
app.use(express.json());
app.use(cors());

//Login na aplicação
app.post('/login', async (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({ message: 'O campo e-mail é obrigatório!' });
    };

    if (!req.body.senha) {
        return res.status(400).json({ message: 'O campo senha é obrigatório!' });
    };

    const usuarioExistente = await usuarioModel.findOne({ email: req.body.email });

    if (!usuarioExistente) {
        return res.status(400).json({ message: 'Usuário não cadastrado!' })
    };

    const senhaVerificada = bcrypt.compareSync(
        req.body.senha,
        usuarioExistente.senha
    );

    if (!senhaVerificada) {
        return res.status(400).json({ message: 'Usuário ou senha incorreto!' })
    };

    const token = jwt.sign({ _id: usuarioExistente._id }, 'dnc');
    return res.status(200).json({
        message: 'Login realizado com sucesso!',
        token,
    });
});


app.get('/usuarios', async (req, res) => {
    const usuarios = await usuarioModel.find({})
    return res.status(200).json(usuarios);
});

//Cadastro de usuário
app.post('/usuarios',  async (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({ message: 'O campo **e-mail** é obrigatório.' });
    };
    if (!req.body.senha) {
        return res.status(400).json({ message: 'O campo **senha** é obrogatório.' });
    };

    /*/passando a senha
    const hash = "$2b$10$ERLe8orH1otiK0taDsd8H.0qrhwoIIYojWOF2VxGMP24Ad8qteFZi"
    //Testando a senha
    const result = bcrypt.compareSync('senha', hash);*/

    //verifica se o usuário ja existe na base
    const usuarioExistente = await usuarioModel.findOne({ email: req.body.email });
    if (usuarioExistente.length) {
        return res.status(400).json({ mesage: (`Usuário ${req.body.email} já possui cadastro!`) })
    };

    const senhaCriptografada = bcrypt.hashSync(req.body.senha, 10)

    if (req.body.nome === undefined) {
        return res.status(404).json({ message: 'O nome do usuário não pode ser vazio!' })
    } else {

        //Salvando o usuário. O metodo create está detalhado na documentotação do mogoose
        const usuario = await usuarioModel.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: senhaCriptografada,
        })
    };
    // return res.status(200).json(usuario);
     return res.status(200).json(message, `Usuário ${req.body.nome}, adicionado com sucesso!`);
    //return res.status(200).json(usuario);
});

//Lista noticias
app.get('/noticias', async (req, res) => {
    let filtroCategoria ={};

    //Procurando a noticia por categoria
    if(req.query.categoria){
        filtroCategoria = {categoria: req.query.categoria};
    };

    const noticias = await noticiaModel.find(filtroCategoria);

    return res.status(200).json(noticias);
});

//Cadastrando noticia
app.post('/noticias', async (req, res) => {
    if (!req.body.titulo) {
        return res.status(400).json({ message: 'A notícia deve conter um titulo.' })
    }

    if (!req.body.img) {
        return res.status(400).json({ message: 'A notícia deve conter uma Imagem.' })
    }

    if (!req.body.texto) {
        return res.status(400).json({ message: 'A notícia deve conter um texto descritivo.' })
    }

    if (!req.body.categoria) {
        return res.status(400).json({ message: 'A notícia deve conter uma categoria.' })
    }

    //Salvando o usuário. O metodo create está detalhado na documentotação do mogoose
    const noticia = await noticiaModel.create({
        titulo: req.body.titulo,
        img: req.body.img,
        texto: req.body.texto,
        categoria: req.body.categoria,
    })
    return res.status(201).json(`Noticia ${req.body.titulo}, adicionada com suceso!`);
});

app.listen(8080, () => {
    console.log('Servidor respondendo na porta 8080');
})