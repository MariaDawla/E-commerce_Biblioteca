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
//Caminho URL: http://localhost:11915/livro
app.get("/livro", async (req, res) => {
    const departamentos = await dbLivro.mostrarLivros();
    res.status(200).json(departamentos);

})

//Criando uam rota para retornar livros com bases nos flitros
//Caminho URL: http://localhost:11915/livros
app.get("/livros", async(req, res) => {
    const { nome, idioma, genero, autor, editora, id_vendedor } = req.query;
    const livrosFiltrados = await dbLivro.mostrarLivrosFiltros(nome, idioma, genero, autor, editora, id_vendedor);
    res.status(200).json(livrosFiltrados);
})

app.get("/livrosVendedor/:id_vendedor", async(req, res) => {
    const id_vendedor = req.params.id_vendedor;
    const livroVendedores = await dbLivro.mostrarLivrosVendedor(id_vendedor)
    res.status(200).json(livroVendedores);
})

//Criando uma rota para retornar os generos existentes
// Caminho URL: http://localhost:11915/generos
app.get("/generos", async(req, res) => {
    const generos = await dbLivro.mostrarGeneros();
    res.status(200).json(generos);
})

//Criando uma rota para retornar os idiomas existentes
//Caminho URL: http://localhost:11915/idiomas
app.get("/idiomas", async(req, res) => {
    const idiomas = await dbLivro.mostrarIdiomas();
    res.status(200).json(idiomas);
})

//Criando uma rota para utilizar a função mostrarLivro
// "/:id" usado como parematro.
//Caminho URL: http://localhost:11915/livro:id
app.get("/livro/:id", async (req, res) => {
    
    const id = req.params.id; 
    const idInt = parseInt(id)

    if (idInt != id) {
        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    } else {
        const departamentos = await dbLivro.mostrarLivro(id);
        res.status(200).json(departamentos);

    }

})

//Rota para função inserirLivro
//Caminha URL: http://localhost:11915/livroADD?nome=x&titulo_original=x&genero=x&idioma=x&autor=x&iditora=x&preco=x&numero_paginas=x&isbn=x&data_publicacao=x&imagem=x
app.use(express.json());
app.post("/livroADD/", async (req, res) => {
    const { nome, titulo_original, genero, idioma, autor, editora, preco, numero_paginas, quantidade, isbn, descricao, data_publicacao, imagem, id_vendedor} = req.body; 
    if(preco != parseFloat(preco)){
        res.status(400).json({mensagem: "Você digitou alguma letra no campo 'preco', digita apenas números"})
    } 
    else if (numero_paginas != parseInt(numero_paginas)) {
        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'numero_paginas'. Escreva apenas números inteiros para da certo!"})
    } 
    else if (isbn != parseInt(isbn)){
        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'ISBN'. screva apenas números inteiros para da certo!"})
    } 
    else {
        const livroInserido = await dbLivro.inserirLivro(nome, titulo_original, genero, idioma, autor, editora, preco, numero_paginas, quantidade, isbn, descricao, data_publicacao, imagem, id_vendedor); //Executando o método inserirLivro
        res.status(201).json(livroInserido);
    }
})

//Rota para função modificarPrecoLivro
//Caminho URL: http://localhost:11915/livroUPT?id=x&nome=x&titulo_original=x&genero=x&idioma=x&autor=x&iditora=x&preco=x&numero_paginas=x&isbn=x&data_publicacao=x&imagem=x
app.use(express.json());
app.put("/livroUPT/", async (req, res) => {
    const {id, nome, titulo_original, genero, idioma, autor, editora, preco, numero_paginas, quantidade, isbn, descricao, data_publicacao, imagem} = req.body;

    console.log("id da URL: "+id)
    console.log("preço da URL: "+preco)

    const idInt = parseInt(id);
    const precoFloat = parseFloat(preco);

    console.log("id convertido: "+ idInt)
    console.log("preço convertido: "+ precoFloat)

    if(id != idInt){
        res.status(400).json({mensagem: "Você escreveu uma alguma letra no 'id'. Tem que ser um número"})
    } 
    else if (preco != precoFloat){
        res.status(400).json({mensagem: "Você escreveu uma alguma letra no 'preco'. Tem que ser um número"})
    } 
    else {
        const livroAtulizado = await dbLivro.modificarLivro(id, nome, titulo_original, genero, idioma, autor, editora, preco, numero_paginas, quantidade, isbn, descricao, data_publicacao, imagem);
        res.status(200).json(livroAtulizado);
    }
    
})

//Rota para função deletarLivro
//Caminho URL: http://localhost:11915/livroDEL/id
app.get("/livroDEL/:id", async (req, res) => {

    const id = req.params.id

    const idInt = parseInt(id)

    if(id != idInt){
        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    }else{
        await dbLivro.deletarLivro(id);
        res.status(200).json({mensagem: "Livro deletado com sucesso"});
    }
})

//=================================USUARIO=================================//
//Criando uma rota para utilizar a função mostrarUsuarios
//Caminho URL: http://localhost:11915/usuario
app.get("/usuario", async (req, res) => {
    res.status(200).json(await dbUsuario.mostrarUsuarios());
})

app.get("/login", async(req, res) => {
    const { email, senha } = req.query;
    const usuarioLogado = await dbUsuario.fazerLogin(email, senha)
    res.status(200).json(usuarioLogado);
})

//Criando uma rota para utilizar a função mostrarUsuario (com parâmetro)
// "/:id" usado como parematro.
//Caminho URL: http://localhost:11915/usuario/id
app.get("/usuario/:id", async (req, res) => {
    
    const id = req.params.id; 

    const idInt = parseInt(id)

    if (idInt != id) {
        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    } else {
        const departamentos = await dbUsuario.mostrarUsuario(id);
        res.status(200).json(departamentos);
    }

})

//Rota para função inserirUsuario
//Caminho URL: http://localhost:11915/usuarioADD?nome=x&email=x&senha=x&cpf=x&telefone=x&cidade=x&rua=x&bairro=x&numero=x&cep=x
app.use(express.json());
app.post("/usuarioADD/", async (req, res) => {

    const { nome, email, senha, cpf, telefone, cidade, rua, bairro, numero, cep } = req.body; 

    if(numero != parseInt(numero)){

        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'numero'. Escreva um número inteiro para da certo!"})

    } else {

        await dbUsuario.inserirUsuario(nome, email, senha, cpf, telefone, cidade, rua, bairro, numero, cep);
        res.status(201).json({ mensagem: "Usuario inserido com sucesso!" }); 
    }
})

//Rota para função modificarUsuario
//Caminho URL: http://localhost:11915/usuarioUPT?id=x&nome=x&email=x&senha=x&cpf=x&telefone=x&cidade=x&rua=x&bairro=x&numero=x&cep=x
app.use(express.json());
app.put("/usuarioUPT/", async (req, res) => {

    const {id, nome, email, senha, telefone, cidade, rua, bairro, numero, cep} = req.body; 

    if(id != parseInt(id)){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id'. Escreva um número inteiro para da certo!"})
    } else if (numero != parseInt(numero)){
        if(numero != null){
            res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'numero'. Escreva um número inteiro para da certo!"})
        }
    } else {
        await dbUsuario.modificarUsuario(id, nome, email, senha, telefone, cidade, rua, bairro, numero, cep);
        res.status(200).json({mensagem: "Usuario atualizado com sucesso!"});
    }
    
})

//Rota para função deletarUsuario
//Caminho URL: http://localhost:11915/usuarioDEL/id
app.get("/UsuarioDEL/:id", async (req, res) => {

    const id = req.params.id

    if(id != parseInt(id)){
        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    }else{
        await dbUsuario.deletarUsuario(id);
        res.status(200).json({mensagem: "Usuario deletado com sucesso"});
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
        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    } else {
        const estoque = await dbEstoque.mostrar_Livro_no_Estoque(id);
        res.status(200).json(estoque);
    }

})

//Rota para função inserirLivroNoEstoque
//Caminho URL: http://localhost:11915/estoqueADD?id_livro=x&quantidade=x
app.use(express.json());
app.post("/estoqueADD/", async (req, res) => {

    const {id_livro, quantidade} = req.body;

    if(id_livro != parseInt(id_livro)){

        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_livro'. Escreva um número inteiro para da certo!"})

    } else if (quantidade != parseInt(quantidade)){

        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'quantidade'. Escreva um número inteiro para da certo!"})

    } else {
    
        await dbEstoque.inserirLivroNoEstoque(id_livro, quantidade);

        res.status(201).json({ mensagem: "Estoque inserido com sucesso!" }); 
    }
})

//Rota para função modificar_Quantidade_do_Livro_no_Estoque
//Caminho URL: http://localhost:11915/usuarioUPT?id=x&nome=x&email=x&senha=x&cpf=x&telefone=x&cidade=x&rua=x&bairro=x&numero=x&cep=x
app.use(express.json());
app.put("/estoqueUPT/", async (req, res) => {

    const {id, quantidade} = req.body; 

    if(id != parseInt(id)){
        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id'. Escreva um número inteiro para da certo!"})
    } else if (quantidade != parseInt(quantidade)){
           
        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'quantidade'. Escreva um número inteiro para da certo!"})
        
    } else {
        await dbEstoque.modificar_Quantidade_do_Livro_no_Estoque(id, quantidade);
        res.status(200).json({mensagem: "Estoque atualizado com sucesso!"});
    }
    
})

//Rota para função deletarEstoque
//Caminho URL: http://localhost:11915/estoqueDEL/id
app.get("/estoqueDEL/:id", async (req, res) => {

    const id = req.params.id

    if(id != parseInt(id)){
        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    }else{
        await dbEstoque.deletar_Livro_no_Estoque(id);
        res.status(200).json({mensagem: "Livro deletado, do estoque, com sucesso"});
    }
})


//================================================================PEDIDO==========================================================//
//Criando uma rota para utilizar a função mostrarPedidos
//Caminho URL: http://localhost:11915/pedido

app.get("/pedido", async (req, res) => {
    res.status(200).json(await dbPedido.mostrarPedidos());
})

//Criando uma rota para utilizar a função mostrarPedido
// "/:id" usado como parematro.
//Caminho URL: http://localhost:11915/pedido/id

app.get("/pedido/:id", async (req, res) => {
    
    const id = req.params.id;

    if (parseInt(id) != id) {
        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    } else {
        const estoque = await dbPedido.mostrarPedidoUsuario(id);
        res.status(200).json(estoque);
    }

})

//Rota para função inserirPedido
//Caminho URL: http://localhost:11915/pedidoADD?id_usuario=x&id_livro=x&quantidade=x

app.use(express.json());
app.post("/pedidoADD/", async (req, res) => {
    const { id_usuario, itens } = req.body;

    // Verifica se veio um array válido
    if (!Array.isArray(itens) || itens.length === 0) {
        res.status(400).json({ mensagem: "A lista de itens está vazia ou inválida." });
    }
    else{
        await dbPedido.inserirPedido(id_usuario, itens);
        res.status(201).json({ mensagem: "Pedido realizado com sucesso!" });
    }
});

//Rota para função deletarPedido
//Caminho URL: http://localhost:11915/pedidoDEL/id
app.get("/pedidoDEL/:id", async (req, res) => {

    const id = req.params.id

    if(id != parseInt(id)){
        res.status(400).json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    }else{
        await dbPedido.deletarPedido(id);
        res.status(200).json({mensagem: "Pedido deletado com sucesso"});
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
app.use(express.json());
app.post("/carrinho_livroADD/", async (req, res) => {

    const {id_carrinho, id_livro} = req.body; // Pegando os parâmetros da URL

    if(id_livro != parseInt(id_livro)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_livro'. Escreva um número inteiro para da certo!"})

    } else if (id_carrinho != parseInt(id_carrinho)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_carrinho'. Escreva um número inteiro para da certo!"})

    } else {
        await dbCarrinho_livro.inserirCarrinho_livro(id_carrinho, id_livro);
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
app.use(express.json());
app.post("/livro_pedidoADD/", async (req, res) => {

    const {id_livro, id_pedido} = req.body;

    if(id_livro != parseInt(id_livro)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_livro'. Escreva um número inteiro para da certo!"})

    } else if (id_pedido != parseInt(id_pedido)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_pedido'. Escreva um número inteiro para da certo!"})

    } else {
        await dbLivro_pedido.inserirLivro_pedido(id_livro, id_pedido);

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
app.use(express.json());
app.post("/usuario_pedidoADD/", async (req, res) => {

    const {id_usuario, id_pedido} = req.body; 

    if(id_usuario != parseInt(id_usuario)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_usuario'. Escreva um número inteiro para da certo!"})

    } else if (id_pedido != parseInt(id_pedido)){

        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'id_pedido'. Escreva um número inteiro para da certo!"})

    } else {
        await dbUsuario_pedido.inserirUsuario_pedido(id_usuario, id_pedido);

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
    res.status(200).json(carrinhos);
})


//Mostrar o carrinho de cada usuário
app.get("/carrinhoUsuario/:id", async (req, res) => {
    const id = req.params.id
    const idInt = parseInt(id)
    if(id != idInt){
        res.status(400).json({mensagem: "Parâmetro Inválido"})
    }else{
        const carrinhoUsuario = await dbCarrinho.mostrarCarrinhoUsuario(id);
        res.status(200).json(carrinhoUsuario);
    }
})


//Inserir novo carrinho
app.use(express.json());
app.post("/novoCarrinho", async (req, res) => {
    const {id_usuario, id_livro} = req.body; //Pegando os parâmetros da URL
    console.log("Id do usuário: " + id_usuario);
    const idUsuarioInt = parseInt(id_usuario);
    console.log("Id do livro: " + id_livro);
    const idLivroInt = parseInt(id_livro);

    if(id_usuario != idUsuarioInt){
        res.status(400).json({mensagem: "Parâmetros Inválidos!"})
    } 
    else if (id_livro != idLivroInt){
        res.status(400).json({mensagem: "Parâmetros Inválidos"})
    } 
    else {
        const novoCarrinho = await dbCarrinho.inserirCarrinho(idUsuarioInt, idLivroInt);
        res.status(201).json(novoCarrinho);
    }
})


//Deletar um item do carrinho de um determinado usuário
app.get("/deletarCarrinho/:id", async (req, res) => {

    const id = req.params.id; //Pegando os parâmetros da URL

    console.log("Id do carrinho: " + id)
    const idCarrinhoInt = parseInt(id);
    
    if(id != idCarrinhoInt){
        res.status(400).json({mensagem: "Parâmetros Inválidos!"})
    }
    else {
        await dbCarrinho.deletarLivroCarrinho(id);
        res.status(200).json({mensagem: "Livro deletado com sucesso do carinho"});    
    }
})




