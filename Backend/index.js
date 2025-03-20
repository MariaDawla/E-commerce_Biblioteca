require("dotenv").config();

//importações
const dbLivro = require("./livro") //importa as funções do arquivo livro.js
const dbUsuario = require("./usuario")

const port = process.env.PORT;

const express = require("express")

const app = express();

app.use(express.json());

//====================================================ROTAS==========================================================//
app.get("/", (req, res) =>{
    res.json({
        message: "Funcionando"
    })
})

//===============================LIVRO===================================
//Criando uma rota para utilizar a função mostrarLivros
app.get("/livro", async (req, res) => {
    const departamentos = await dbLivro.mostrarLivros();
    res.json(departamentos);
})

//Criando uma rota para utilizar a função mostrarLivro
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

//Rota para função inserirLivro
//Caminha URL: http://localhost:11915/livroADD?nome=x&titulo_original=x&genero=x&idioma=x&autor=x&iditora=x&preco=x&numero_paginas=x&isbn=x&data_publicacao=x&imagem=x
app.get("/livroADD/", async (req, res) => {
    const { nome, titulo_original, genero, idioma, autor, iditora, preco, numero_paginas, isbn, data_publicacao, imagem } = req.query; // Pegando os parâmetros da URL

    if(preco != parseFloat(preco)){
        res.json({mensagem: "Você digitou alguma letra no campo 'preco', digita apenas números"})
    } else if (numero_paginas != parseInt(numero_paginas)) {
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'numero_paginas'. Escreva apenas números inteiros para da certo!"})
    } else if (isbn != parseInt(isbn)){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'ISBN'. screva apenas números inteiros para da certo!"})
    } else {
        await dbLivro.inserirLivro(nome, titulo_original, genero, idioma, autor, iditora, preco, numero_paginas, isbn, data_publicacao, imagem);//Executando o método inserirLivro
    res.json({ mensagem: "Livro inserido com sucesso!" }); //Resposta para o usuário
    }
})

//Rota para função modificarPrecoLivro
//Caminho URL: http://localhost:11915/livroUPT?id=x&preco=x
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

//Rota para função deletarLivro
//Caminho URL: http://localhost:11915/livroDEL/id
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

//=================================USUARIO=================================//
//Criando uma rota para utilizar a função mostrarUsuarios
//Caminho URL: http://localhost:11915/usuario
app.get("/usuario", async (req, res) => {
    res.json(await dbUsuario.mostrarUsuarios);
})

//Criando uma rota para utilizar a função mostrarUsuario (com parâmetro)
// "/:id" usado como parematro.
//Caminho URL: http://localhost:11915/usuario/id
app.get("/usuario/:id", async (req, res) => {
    
    const id = req.params.id; 

    const idInt = parseInt(id)

    if (idInt != id) {
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    } else {
        const departamentos = await dbUsuario.mostrarUsuario(id);
        res.json(departamentos);

    }

})

//Rota para função inserirUsuario
//Caminho URL: http://localhost:11915/usuarioADD?nome=x&email=x&senha=x&cpf=x&telefone=x&cidade=x&rua=x&bairro=x&num_endereco=x&cep=x
app.get("/usuarioADD/", async (req, res) => {

    const { nome, email, senha, cpf, telefone, cidade, rua, bairro, num_endereco, cep } = req.query; // Pegando os parâmetros da URL

    if(num_endereco != parseInt(num_endereco)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'num_endereco'. Escreva um número inteiro para da certo!"})

    } else {

        //Executando o método inserirUsuario
        await dbUsuario.inserirUsuario(nome, email, senha, cpf, telefone, cidade, rua, bairro, num_endereco, cep);

        //Resposta para o usuário
        res.json({ mensagem: "Usuario inserido com sucesso!" }); 
    }
})

//Rota para função modificarUsuario
//Caminho URL: http://localhost:11915/usuarioUPT?id=x&nome=x&email=x&senha=x&cpf=x&telefone=x&cidade=x&rua=x&bairro=x&num_endereco=x&cep=x
app.get("/usuarioUPT/", async (req, res) => {

    //Pegando os parâmetros da URL
    const {id, nome, email, senha, telefone, cidade, rua, bairro, num_endereco, cep} = req.query; 

    if(id != parseInt(id)){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id'. Escreva um número inteiro para da certo!"})
    } else if (num_endereco != parseInt(num_endereco)){
        if(num_endereco != null){
            res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'num_endereco'. Escreva um número inteiro para da certo!"})
        }
    } else {
        await dbUsuario.modificarUsuario(id, nome, email, senha, telefone, cidade, rua, bairro, num_endereco, cep);
        res.json({mensagem: "Usuario atualizado com sucesso!"});
    }
    
})

//Rota para função deletarUsuario
//Caminho URL: http://localhost:11915/usuarioDEL/id
app.get("/UsuarioDEL/:id", async (req, res) => {

    const id = req.params.id

    if(id != parseInt(id)){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    }else{
        await dbUsuario.deletarUsuario(id);
        res.json({mensagem: "Usuario deletado com sucesso"});
    }
})

app.listen(port)

console.log("Backend rodando")