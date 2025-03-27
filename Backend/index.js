require("dotenv").config();

const dbLivro = require("./livro") //importa as funções do arquivo livro.js
const dbCarrinho = require("./carrinho") 

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
    const departamentos = await dbLivro.mostrarLivros();
    res.json(departamentos);
})

//Criando uma rota para utilizar a função mostrarDepartamentos (com parâmetro)
// "/:id" usado como parematro.
app.get("/livro/:id", async (req, res) => {
    
    const id = req.params.id; 

    const idInt = parseInt(id)

    if (idInt != id) {
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    } else {
        const departamentos = await dbLivro.mostrarLivro(id);
        res.json(departamentos);

    }

})

//Rota para função inserirDepartamento
app.get("/livroADD/", async (req, res) => {
    const { nome, titulo_original, genero, idioma, autor, iditora, preco, numero_paginas, isbn, data_publicacao, imagem } = req.query; // Pegando os parâmetros da URL

    if(preco != parseFloat(preco)){
        res.json({mensagem: "Você digitou alguma letra no campo 'preco', digita apenas números"})
    } else if (numero_paginas != parseInt(numero_paginas)) {
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'numero_paginas'. Escreva apenas números inteiros para da certo!"})
    } else if (isbn != parseInt(isbn)){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'ISBN'. screva apenas números inteiros para da certo!"})
    } else {
        await db.inserirLivro(nome, titulo_original, genero, idioma, autor, iditora, preco, numero_paginas, isbn, data_publicacao, imagem);//Executando o método inserirLivro
    res.json({ mensagem: "Livro inserido com sucesso!" }); //Resposta para o usuário
    }
})

//Rota para função modificarPrecoLivro
app.get("/livroUPT/", async (req, res) => {
    const {id, preco} = req.query; //Pegando os parâmetros da URL

    console.log("id da URL: "+id)
    console.log("preço da URL: "+preco)

    const idInt = parseInt(id);
    const precoFloat = parseFloat(preco);

    console.log("id convertido: "+idInt)
    console.log("preço convertido: "+precoFloat)

    if(id != idInt){
        res.json({mensagem: "Você escreveu uma alguma letra no 'id'. Tem que ser um número"})
    } else if (preco != precoFloat){
        res.json({mensagem: "Você escreveu uma alguma letra no 'preco'. Tem que ser um número"})
    } else {
        await dbLivro.modificarPrecoLivro(idInt, precoFloat);
        res.json({mensagem: "Livro atualizado com sucesso!"});
    }
    
})

//Rota para função deletarDepartamento
app.get("/livroDEL/:id", async (req, res) => {

    const id = req.params.id

    const idInt = parseInt(id)

    if(id != idInt){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    }else{
        await dbLivro.deletarLivro(id);
        res.json({mensagem: "Livro deletado com sucesso"});
    }
})

app.listen(port)

console.log("Backend rodando")

//Rotas para Carrinho

//Mostrar a tabela
app.get("/carrinhos", async (req, res) => {
    const carrinhos = await dbCarrinho.mostrarCarrinhos();
    res.json(carrinhos);
})


//Mostrar o carrinho de cada usuário
app.get("/carrinhoUsuario/:id", async (req, res) => {
    const id = req.params.id
    const idInt = parseInt(id)
    if(id != idInt){
        res.json({mensagem: "Parâmetro Inválido"})
    }else{
        const carrinhoUsuario = await dbCarrinho.mostrarCarrinhoUsuario(id);
        res.json(carrinhoUsuario);
    }
})


//Inserir novo carrinho
app.get("/novoCarrinho", async (req, res) => {
    const {id_usuario, id_livro, quantidade} = req.query; //Pegando os parâmetros da URL

    console.log("Id do usuário: " + id_usuario);
    const idUsuarioInt = parseInt(id_usuario);
    console.log("Id do livro: " + id_livro);
    const idLivroInt = parseInt(id_livro);
    console.log("Quantidade: " + quantidade);
    const quantidadeInt = parseInt(quantidade);

    if(id_usuario != idUsuarioInt){
        res.json({mensagem: "Parâmetros Inválidos!"})
    } else if (id_livro != idLivroInt){
        res.json({mensagem: "Parâmetros Inválidos"})
    } else if (quantidade != quantidadeInt){
            res.json({mensagem: "Parâmetros Inválidos"})
    } else {
        const novoCarrinho = await dbCarrinho.inserirCarrinho(idUsuarioInt, idLivroInt, quantidade);
        res.json(novoCarrinho);
    }
})


//Deletar um item do carrinho de um determinado usuário
app.get("/deletarCarrinho/:id", async (req, res) => {

    const {id_usuario, id_livro} = req.query; //Pegando os parâmetros da URL

    console.log("Id do usuário: " + id_usuario)
    const idUsuarioInt = parseInt(id_usuario);
    console.log("Id do livro: " + id_livro)
    const idLivroInt = parseInt(id_livro)



    if(id_usuario != idUsuarioInt){
        res.json({mensagem: "Parâmetros Inválidos!"})
    } else if (id_livro != idLivroInt){
        res.json({mensagem: "Parâmetros Inválidos"})
    } else {
        const carrinhoDeletado = await dbCarrinho.deletarLivroCarrinho(idUsuarioInt, idLivroInt);
        res.json(carrinhoDeletado);
    }
})






