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
    
    const id = req.params.id; 

    const idInt = parseInt(id)

    if (idInt != id) {
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, escreva um número inteiro para da certo!"})
    } else {
        const departamentos = await db.mostrarLivro(id);
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
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'ISBN'. Escreva apenas números inteiros para da certo!"})
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
        await db.modificarPrecoLivro(idInt, precoFloat);
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
        await db.deletarLivro(id);
        res.json({mensagem: "Livro deletado com sucesso"});
    }
})

app.listen(port)

console.log("Backend rodando")