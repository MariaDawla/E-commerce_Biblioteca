
const dbEstoque = require("./estoque") //importa as funções do arquivo estoque.js
//Função para conectar ao banco de dado
async function connect() {
   

    //Importando o Poll da biblioteca pg(postgresql)
    const {Pool} = require("pg");


    //Configurando o Pool, ou seja, colocando todas as informações necessárias para criar a conexão
    const pool = new Pool({
        user: process.env.user,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: process.env.port,
        max: 20,
        ssl: {
            rejectUnauthorized: false,
        },
    });
 
    //pool.connection: vai estabelecer a conexão entre o programa(a máquina) e o banco de dados
    const client = await pool.connect();
    console.log("Banco de Dados conectado")
    client.release()

    //"global": área global usada para guardar. Nesse caso vai está guardando o objeto connection
    global.connection = pool;

     /*Usando uma Singleton. Singleton: É uma estratégia usada pra evitar criar várias objetos apenas para fazer uma execução, 
                                        então além de criar vários objetos, uma singleton vai reutilizar os objetos já criados*/
    if(global.connection)
        return global.connection.connect();
    
}

//Função para mostrar os departamentos
async function mostrarLivros(){
    const client = await connect();
    try{
        //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        const res = await client.query("SELECT * FROM Livro");
        //Retornando os resultados por linhas
        return res.rows;
    }
    finally{
        client.release()
    }
}

async function mostrarLivrosFiltros(nome, idioma, genero, autor, editora, id_vendedor){
    const client = await connect();
    try{
         //Criação a conexão com o banco de dados
        //Argumentando o código SQL
        const res = await client.query("SELECT * FROM livro WHERE titulo_original = (SELECT titulo_original FROM livro WHERE nome ILIKE '%' || $1 || '%'LIMIT 1) AND ($2 IS NULL OR idioma ILIKE '%' || $2 || '%') AND ($3 IS NULL OR genero ILIKE '%' || $3 || '%') AND ($4 IS NULL OR autor ILIKE '%' || $4 || '%') AND ($5 IS NULL OR editora ILIKE '%' || $5 || '%') AND ($6::INTEGER IS NULL OR id_vendedor = $6);", [nome, idioma, genero, autor, editora, id_vendedor])
        return res.rows;
    }
    finally{
        client.release()
    }
}

async function mostrarLivrosVendedor(id_vendedor) {
    const client = await connect();
    try{
        const res = await client.query("SELECT livro.id, livro.nome, livro.titulo_original, livro.genero, livro.idioma, livro.autor, livro.editora, livro.preco, livro.numero_paginas, livro.isbn, livro.descricao, livro.data_publicacao, livro.imagem, livro.id_vendedor, estoque.quantidade FROM estoque JOIN livro ON livro.id = estoque.id_livro WHERE livro.id_vendedor = $1;", [id_vendedor]);
        return res.rows;
    }
    finally{
        client.release()
    }
}

async function mostrarIdiomas(){
    const client = await connect();
    try{
        const res = await client.query("SELECT DISTINCT idioma FROM livro")
        return res.rows;
    }
    finally{
        client.release()
    }
}

async function mostrarGeneros(){
    const client = await connect();
    try{
        const res = await client.query("SELECT DISTINCT genero FROM livro")
        return res.rows;
    }
    finally{
        client.release()
    }
}


async function mostrarLivro(id){
    const client = await connect();
    try{
         //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        const res = await client.query("SELECT * FROM Livro WHERE id=$1", [id]);
        //Retornando os resultados por linhas
        return res.rows;
    }
    finally{
        client.release()
    }
   
}

async function inserirLivro(nome, titulo_original, genero, idioma, autor, editora, preco, numero_paginas, quantidade, isbn, descricao, data_publicacao, imagem, id_vendedor) {
    const client = await connect();
    try{
        //Criando a conexão com o banco de dados 
        //Argumentando o código SQL
        const res = await client.query("INSERT INTO Livro (nome, titulo_original, genero, idioma, autor, editora, preco, numero_paginas, quantidade, isbn, descricao, data_publicacao, imagem, id_vendedor) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id", [nome, titulo_original, genero, idioma, autor, editora, preco, numero_paginas, quantidade, isbn, descricao, data_publicacao, imagem, id_vendedor]);
        
        const id_livro = res.rows[0].id;
        await dbEstoque.inserirLivroNoEstoque(id_livro, quantidade)
        return res.rows;   
    }
    finally{
        client.release()
    }
}

async function modificarLivro(id, nome, titulo_original, genero, idioma, autor, editora, preco, numero_paginas, quantidade, isbn, descricao, data_publicacao, imagem) {
    const client = await connect();
    try{
        // //Criando a conexão com o banco de dados
        // if(nome != null){
        //     await client.query("UPDATE Livro SET nome=$1 WHERE id=$2", [nome, id])
        // }
        // if(titulo_original != null){
        //     await client.query("UPDATE Livro SET titulo_original=$1 WHERE id=$2", [titulo_original, id])
        // }
        // if(genero != null){
        //     await client.query("UPDATE Livro SET genero=$1 WHERE id=$2", [genero, id])
        // }
        // if(idioma != null){
        //     await client.query("UPDATE Livro SET idioma=$1 WHERE id=$2", [idioma, id])
        // }
        // if(autor != null){
        //     await client.query("UPDATE Livro SET autor=$1 WHERE id=$2", [autor, id])
        // }
        // if(editora != null){
        //     await client.query("UPDATE Livro SET editora=$1 WHERE id=$2", [editora, id])
        // }
        // if(numero_paginas != null){
        //     await client.query("UPDATE Livro SET numero_paginas=$1 WHERE id=$2", [numero_paginas, id])
        // }
        // if(quantidade != null){
        //     await client.query("UPDATE Livro SET quantidade=$1 WHERE id=$2", [quantidade, id])
        // }
        // if(isbn != null){
        //     await client.query("UPDATE Livro SET isbn=$1 WHERE id=$2", [isbn, id])
        // }
        // if(descricao != null){
        //     await client.query("UPDATE Livro SET descricao=$1 WHERE id=$2", [descricao, id])
        // }
        // if(data_publicacao != null){
        //     await client.query("UPDATE Livro SET data_publicacao=$1 WHERE id=$2", [data_publicacao, id])
        // }
        // if(imagem != null){
        //     await client.query("UPDATE Livro SET imagem=$1 WHERE id=$2", [imagem, id])
        // }
        //Argumentando o código SQL
        const res = await client.query("UPDATE Livro SET nome=$1, titulo_original=$2, genero=$3, idioma=$4, autor=$5, editora=$6, preco=$7, numero_paginas=$8, quantidade=$9, isbn=$10, descricao=$11, data_publicacao=$12, imagem=$13 WHERE id=$14", [nome, titulo_original, genero, idioma, autor, editora, preco, numero_paginas, quantidade, isbn, descricao, data_publicacao, imagem, id])
        return res.rows;
    }
    finally{
        client.release()
    }
}

async function deletarLivro(id) {
    const client = await connect();
    try{
         //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        await client.query("DELETE FROM Livro WHERE id=$1", [id])
    }
    finally{
        client.release()
    }
}

//exportando as funções desse arquivo para outro arquivo 
module.exports = {
    mostrarLivros,
    mostrarLivro,
    inserirLivro,
    modificarLivro,
    deletarLivro,
    mostrarLivrosFiltros,
    mostrarGeneros,
    mostrarIdiomas,
    mostrarLivrosVendedor
}
