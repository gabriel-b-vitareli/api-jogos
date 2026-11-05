// Importando as bibliotecas
const express = require('express');
const {MongoClient,ObjectId} = require('mongodb');

// Criando a conexão com o banco:
const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
const produtos = client.db('loja').collection('jogos');

// Criando os métodos HTTP:
app.post('/jogos',async(req,res)=>{
    const novoProduto = await produtos.insertOne(req.body);
    res.status(201).json(novoProduto);
});

app.get('/jogos',async(req,res)=>{
    const listaProdutos = await produtos.find().toArray();
    res.json(listaProdutos);
});

app.get('/jogos/:id',async(req,res)=>{
    const produtoEspecifico = await produtos.findOne({_id:new ObjectId(req.params.id)});
    res.json(produtoEspecifico);
});

app.put('/jogos/:id',async(req,res)=>{
    const produtoAtualizado = await produtos.updateOne({_id:new ObjectId(req.params.id)},{$set: req.body});
    res.json(produtoAtualizado);
});

app.delete('/jogos/:id',async(req,res)=>{
    const produtoDeletado = await produtos.deleteOne({_id: new ObjectId(req.params.id)});
    res.json(produtoDeletado);
});

const PORT = process.env.PORT || 3000;

client.connect()
    .then(()=>{
        console.log('CONECTADO AO MONGODB'),
        app.listen(PORT, () => console.log(`API RODANDO NA PORTA ${PORT}`))
    })
    .catch((erro)=>console.log('ERRO AO CONECTAR',erro.message))