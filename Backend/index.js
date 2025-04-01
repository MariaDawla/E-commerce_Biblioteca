require("dotenv").config();

//importações
const dbCarrinho = require("./carrinho")
const dbLivro = require("./livro") //importa as funções do arquivo livro.js
const dbUsuario = require("./usuario") //importa as funções do arquivo usuario.js
const dbEstoque = require("./estoque") //importa as funções do arquivo estoque.js
const dbPedido = require("./pedido") //importa as funções do arquivo pedido.js
const dbCarrinho_livro = require("./carrinho_livro") //importa as funções do arquivo carrinho_livro.js
const dbLivro_pedido = require("./livro_pedido") //importa as funções do arquivo livro_pedido.js
const dbUsuario_pedido = require("./usuario_pedido") //importa as funções do arquivo usuario_pedido.js
const port = process.env.PORT;

const express = require("express")

const app = express();
const cors = require('cors')

app.use(cors());

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

//Criando uam rota para retornar livros com bases nos flitros
app.get("/livros", async(req, res) => {
    const { nome, titulo_original, genero, idioma, autor, editora } = req.query;
    const livrosFiltrados = await dbLivro.mostrarLivrosFiltros(nome, titulo_original, genero, idioma, autor, editora);
    res.json(livrosFiltrados);

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
    const { nome, titulo_original, genero, idioma, autor, iditora, preco, numero_paginas, isbn, descricao, data_publicacao, imagem } = req.query; // Pegando os parâmetros da URL

    if(preco != parseFloat(preco)){
        res.json({mensagem: "Você digitou alguma letra no campo 'preco', digita apenas números"})
    } else if (numero_paginas != parseInt(numero_paginas)) {
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'numero_paginas'. Escreva apenas números inteiros para da certo!"})
    } else if (isbn != parseInt(isbn)){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'ISBN'. screva apenas números inteiros para da certo!"})
    } else {
        await dbLivro.inserirLivro(nome, titulo_original, genero, idioma, autor, iditora, preco, numero_paginas, isbn, descricao, data_publicacao, imagem);//Executando o método inserirLivro
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
    res.json(await dbUsuario.mostrarUsuarios());
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


//================================================================ESTOQUE==========================================================//
//Criando uma rota para utilizar a função mostrar_Livros_no_Estoque
//Caminho URL: http://localhost:11915/estoque
app.get("/estoque", async (req, res) => {
    res.json(await dbEstoque.mostrar_Livros_no_Estoque());
})

//Criando uma rota para utilizar a função mostrar_Livro_no_Estoque
// "/:id" usado como parematro.
//Caminho URL: http://localhost:11915/estoque/id
app.get("/estoque/:id", async (req, res) => {
    
    const id = req.params.id;

    if (parseInt(id) != id) {
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    } else {
        const estoque = await dbEstoque.mostrar_Livro_no_Estoque(id);
        res.json(estoque);

    }

})

//Rota para função inserirLivroNoEstoque
//Caminho URL: http://localhost:11915/estoqueADD?id_livro=x&quantidade=x
app.get("/estoqueADD/", async (req, res) => {

    const {id_livro, quantidade} = req.query; // Pegando os parâmetros da URL

    if(id_livro != parseInt(id_livro)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_livro'. Escreva um número inteiro para da certo!"})

    } else if (quantidade != parseInt(quantidade)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'quantidade'. Escreva um número inteiro para da certo!"})

    } else {
        //Executando o método inserirLivroNoEstoque
        await dbEstoque.inserirLivroNoEstoque(id_livro, quantidade);

        //Resposta para o usuário
        res.json({ mensagem: "Estoque inserido com sucesso!" }); 
    }
})

//Rota para função modificar_Quantidade_do_Livro_no_Estoque
//Caminho URL: http://localhost:11915/usuarioUPT?id=x&nome=x&email=x&senha=x&cpf=x&telefone=x&cidade=x&rua=x&bairro=x&num_endereco=x&cep=x
app.get("/estoqueUPT/", async (req, res) => {

    //Pegando os parâmetros da URL
    const {id, quantidade} = req.query; 

    if(id != parseInt(id)){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id'. Escreva um número inteiro para da certo!"})
    } else if (quantidade != parseInt(quantidade)){
           
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'quantidade'. Escreva um número inteiro para da certo!"})
        
    } else {
        await dbEstoque.modificar_Quantidade_do_Livro_no_Estoque(id, quantidade);
        res.json({mensagem: "Estoque atualizado com sucesso!"});
    }
    
})

//Rota para função deletarEstoque
//Caminho URL: http://localhost:11915/estoqueDEL/id
app.get("/estoqueDEL/:id", async (req, res) => {

    const id = req.params.id

    if(id != parseInt(id)){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    }else{
        await dbEstoque.deletar_Livro_no_Estoque(id);
        res.json({mensagem: "Livro deletado, do estoque, com sucesso"});
    }
})


//================================================================PEDIDO==========================================================//
//Criando uma rota para utilizar a função mostrarPedidos
//Caminho URL: http://localhost:11915/pedido
app.get("/pedido", async (req, res) => {
    res.json(await dbPedido.mostrarPedidos());
})

//Criando uma rota para utilizar a função mostrarPedido
// "/:id" usado como parematro.
//Caminho URL: http://localhost:11915/pedido/id
app.get("/pedido/:id", async (req, res) => {
    
    const id = req.params.id;

    if (parseInt(id) != id) {
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    } else {
        const estoque = await dbPedido.mostrarPedido(id);
        res.json(estoque);

    }

})

//Rota para função inserirPedido
//Caminho URL: http://localhost:11915/pedidoADD?id_usuario=x&id_livro=x&quantidade=x
app.get("/pedidoADD/", async (req, res) => {

    const {id_usuario, id_livro, quantidade} = req.query; // Pegando os parâmetros da URL

    //Condições
    if (id_usuario != parseInt(id_usuario)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_usuario'. Escreva um número inteiro para da certo!"})

    } else if(id_livro != parseInt(id_livro)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_livro'. Escreva um número inteiro para da certo!"})

    }  else if (quantidade != parseInt(quantidade)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'quantidade'. Escreva um número inteiro para da certo!"})

    } else {
        const preco_unitario = await query("SELECT preco_unitario FROM Livro WHERE id=$1", [id_livro])

        //Executando o método inserirPedido
        await dbPedido.inserirPedido(id_usuario, id_livro, preco_unitario, quantidade);

        //Resposta para o usuário
        res.json({ mensagem: "Pedido inserido com sucesso!" }); 
    }
})

//Rota para função deletarPedido
//Caminho URL: http://localhost:11915/pedidoDEL/id
app.get("/pedidoDEL/:id", async (req, res) => {

    const id = req.params.id

    if(id != parseInt(id)){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    }else{
        await dbPedido.deletarPedido(id);
        res.json({mensagem: "Pedido deletado com sucesso"});
    }
})

//================================================================Carrinho_livro==========================================================//
//Criando uma rota para utilizar a função mostrarCarrinhos_livro
//Caminho URL: http://localhost:11915/carrinho_livro
app.get("/carrinho_livro", async (req, res) => {
    res.json(await dbCarrinho_livro.mostrarCarrinhos_livro());
})

//Criando uma rota para utilizar a função mostrarCarrinho_livro
// "/:id" usado como parematro.
//Caminho URL: http://localhost:11915/carrinho_livro/id
app.get("/carrinho_livro/:id", async (req, res) => {
    
    const id = req.params.id;

    if (parseInt(id) != id) {
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    } else {
        const estoque = await dbCarrinho_livro.mostrarCarrinho_livro(id);
        res.json(estoque);

    }

})

//Rota para função inserirCarrinho_livro
//Caminho URL: http://localhost:11915/carrinho_livroADD?id_carrinho=x&id_livro=x
app.get("/carrinho_livroADD/", async (req, res) => {

    const {id_carrinho, id_livro} = req.query; // Pegando os parâmetros da URL

    if(id_livro != parseInt(id_livro)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_livro'. Escreva um número inteiro para da certo!"})

    } else if (id_carrinho != parseInt(id_carrinho)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_carrinho'. Escreva um número inteiro para da certo!"})

    } else {
        //Executando o método inserirLivroNoEstoque
        await dbCarrinho_livro.inserirCarrinho_livro(id_carrinho, id_livro);

        //Resposta para o usuário
        res.json({ mensagem: "carrinho_livro inserido com sucesso!" }); 
    }
})

//Rota para função deletarCarrinho_livro
//Caminho URL: http://localhost:11915/carrinho_livroDEL/id
app.get("/carrinho_livroDEL/:id", async (req, res) => {

    const id = req.params.id

    if(id != parseInt(id)){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    }else{
        await dbCarrinho_livro.deletarCarrinho_livro(id);
        res.json({mensagem: "carrinho_livro deletado com sucesso"});
    }
})


//================================================================Livro_pedido==========================================================//
//Criando uma rota para utilizar a função mostrarLivros_pedido
//Caminho URL: http://localhost:11915/livro_pedido
app.get("/livro_pedido", async (req, res) => {
    res.json(await dbLivro_pedido.mostrarLivros_pedido());
})

//Criando uma rota para utilizar a função mostrarLivro_pedido
// "/:id" usado como parematro.
//Caminho URL: http://localhost:11915/livro_pedido/id
app.get("/livro_pedido/:id", async (req, res) => {
    
    const id = req.params.id;

    if (parseInt(id) != id) {
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    } else {
        const estoque = await dbLivro_pedido.mostrarLivro_pedido(id);
        res.json(estoque);

    }

})

//Rota para função inserirLivro_pedido
//Caminho URL: http://localhost:11915/livro_pedidoADD?id_livro=x&id_pedido=x
app.get("/livro_pedidoADD/", async (req, res) => {

    const {id_livro, id_pedido} = req.query; // Pegando os parâmetros da URL

    if(id_livro != parseInt(id_livro)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_livro'. Escreva um número inteiro para da certo!"})

    } else if (id_pedido != parseInt(id_pedido)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_pedido'. Escreva um número inteiro para da certo!"})

    } else {
        //Executando o método inserirLivroNoEstoque
        await dbLivro_pedido.inserirLivro_pedido(id_livro, id_pedido);

        //Resposta para o usuário
        res.json({ mensagem: "livro_pedido inserido com sucesso!" }); 
    }
})

//Rota para função deletarLivro_pedido
//Caminho URL: http://localhost:11915/livro_pedidoDEL/id
app.get("/livro_pedidoDEL/:id", async (req, res) => {

    const id = req.params.id

    if(id != parseInt(id)){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    }else{
        await dbLivro_pedido.deletarLivro_pedido(id);
        res.json({mensagem: "livro_pedido deletado com sucesso"});
    }
})

//================================================================Usuario_pedido==========================================================//
//Criando uma rota para utilizar a função mostrarUsuarios_pedido
//Caminho URL: http://localhost:11915/usuario_pedido
app.get("/usuario_pedido", async (req, res) => {
    res.json(await dbUsuario_pedido.mostrarUsuarios_pedido());
})

//Criando uma rota para utilizar a função mostrarUsuario_pedido
// "/:id" usado como parematro.
//Caminho URL: http://localhost:11915/livro_pedido/id
app.get("/usuario_pedido/:id", async (req, res) => {
    
    const id = req.params.id;

    if (parseInt(id) != id) {
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    } else {
        const estoque = await dbUsuario_pedido.mostrarUsuario_pedido(id);
        res.json(estoque);

    }

})

//Rota para função inserirLivro_pedido
//Caminho URL: http://localhost:11915/usuario_pedidoADD?id_usuario=x&id_pedido=x
app.get("/usuario_pedidoADD/", async (req, res) => {

    const {id_usuario, id_pedido} = req.query; // Pegando os parâmetros da URL

    if(id_usuario != parseInt(id_usuario)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_usuario'. Escreva um número inteiro para da certo!"})

    } else if (id_pedido != parseInt(id_pedido)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_pedido'. Escreva um número inteiro para da certo!"})

    } else {
        //Executando o método inserirLivroNoEstoque
        await dbUsuario_pedido.inserirUsuario_pedido(id_usuario, id_pedido);

        //Resposta para o usuário
        res.json({ mensagem: "usuario_pedido inserido com sucesso!" }); 
    }
})

//Rota para função deletarLivro_pedido
//Caminho URL: http://localhost:11915/usuario_pedidoDEL/id
app.get("/usuario_pedidoDEL/:id", async (req, res) => {

    const id = req.params.id

    if(id != parseInt(id)){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    }else{
        await dbUsuario_pedido.deletarUsuario_pedido(id);
        res.json({mensagem: "usuario_pedido deletado com sucesso"});
    }
})

app.listen(port)

console.log("Backend rodando")


//================================================================Carrinho==========================================================//
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






