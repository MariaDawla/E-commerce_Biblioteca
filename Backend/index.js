require("dotenv").config();

const db = require("./db") 

const port = process.env.PORT;

const express = require("express")

const app = express();

app.use(express.json());

app.get("/", (req, res) =>{
    res.json({
        message: "Funcionando"
    })
})

//Criando uma rota para utilizar a função mostrarDepartamentos
app.get("/livro", async (req, res) => {
    const departamentos = await db.mostrarLivros();
    res.json(departamentos);
})

//Criando uma rota para utilizar a função mostrarDepartamentos (com parâmetro)
// "/:id" usado como parematro.
app.get("/livro/:id", async (req, res) => {
    const departamentos = await db.mostrarLivro(req.params.id);
    res.json(departamentos);
})

//Rota para função inserirDepartamento
app.get("/livroADD/", async (req, res) => {
    const { nome, titulo_original, genero, idioma, autor, iditora, preco, numero_paginas, isbn, data_publicacao, imagem } = req.query; // Pegando os parâmetros da URL
    await db.inserirLivro(nome, titulo_original, genero, idioma, autor, iditora, preco, numero_paginas, isbn, data_publicacao, imagem);
    res.json({ mensagem: "Livro inserido com sucesso!" });
})

//Rota para função modificarPrecoLivro
app.get("/livroUPT/", async (req, res) => {
    const {id, preco} = req.query; //Pegando os parâmetros da URL

    console.log(id)
    console.log(preco)

    const idInt = parseInt(id, 10);
    const precoFloat = parseFloat(preco);

    console.log(idInt)
    console.log(precoFloat)

    if(id != idInt){
        res.json({mensagem: "Você escreveu uma alguma letra no 'id'. Tem que ser um número"})
    } else if (preco != precoFloat){
        res.json({mensagem: "Você escreveu uma alguma letra no 'preco'. Tem que ser um número"})
    } else {
        await db.modificarPrecoLivro(idInt, precoFloat);
        res.json({mensagem: "Livro atualizado com sucesso!"});
    }
    
})

//Rota para função deletarDepartamento
app.get("/livroDEL/:id", async (req, res) => {
    await db.deletarLivro(req.params.id);
    res.json({mensagem: "Livro deletado com sucesso"});
})

app.listen(port)

console.log("Backend rodando")