//Função para conectar ao banco de dados
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

async function mostrarLivrosFiltros(nome, titulo_original, genero, idioma, autor, editora, id_vendedor){
    const client = await connect();
    try{
         //Criação a conexão com o banco de dados
        //Argumentando o código SQL
        const res = await client.query("SELECT * FROM livro WHERE (nome ILIKE '%' || $1 || '%' OR $1 IS NULL) AND (titulo_original ILIKE '%' || $2 || '%' OR $2 IS NULL) AND (genero ILIKE '%' || $3 || '%' OR $3 IS NULL) AND (idioma ILIKE '%' || $4 || '%' OR $4 IS NULL) AND (autor ILIKE '%' || $5 || '%' OR $5 IS NULL) AND (editora ILIKE '%' || $6 || '%' OR $6 IS NULL) AND (id_vendedor = $7 OR $7 IS NULL);", [nome, titulo_original, genero, idioma, autor, editora, id_vendedor])
        return res.rows;
    }
    finally{
        client.release()
    }
}

async function mostrarLivrosVendedor(id_vendedor) {
    const client = await connect();
    try{
        const res = await client.query("SELECT * FROM Livro WHERE id_vendedor=$1", [id_vendedor]);
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

async function inserirLivro(nome, titulo_original, genero, idioma, autor, iditora, preco, numero_paginas, quantidade, isbn, descricao, data_publicacao, imagem, id_vendedor) {
    const client = await connect();
    try{
        //Criando a conexão com o banco de dados 
        //Argumentando o código SQL
        await client.query("INSERT INTO Livro (nome, titulo_original, genero, idioma, autor, editora, preco, numero_paginas, quantidade, isbn, descricao, data_publicacao, imagem, id_vendedor) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)", [nome, titulo_original, genero, idioma, autor, iditora, preco, numero_paginas, quantidade, isbn, descricao, data_publicacao, imagem, id_vendedor]);
    }
    finally{
        client.release()
    }
}

async function modificarPrecoLivro(id, preco) {
    const client = await connect();
    try{
        //Criando a conexão com o banco de dados
        //Argumentando o código SQL
        await client.query("UPDATE Livro SET preco=$1 WHERE id=$2", [preco, id])
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
    modificarPrecoLivro,
    deletarLivro,
    mostrarLivrosFiltros,
    mostrarGeneros,
    mostrarIdiomas,
    mostrarLivrosVendedor
}
