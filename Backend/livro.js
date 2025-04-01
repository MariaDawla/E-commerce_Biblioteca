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
        ssl: {
            rejectUnauthorized: false,
        },
    });
 
    //pool.connection: vai estabelecer a conexão entre o programa(a máquina) e o banco de dados
    const client = await pool.connect();
    console.log("Banco de Dados conectado")

    //Teste
    const res = await client.query("select now()")
    console.log(res.rows[0]);
    client.release();

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

async function mostrarLivrosFiltros(nome, titulo_original, genero, idioma, autor, editora){
    const client = await connect();
    try{
         //Criação a conexão com o banco de dados
        //Argumentando o código SQL
        const res = await client.query("SELECT * FROM livros WHERE (nome=$1 OR $1 IS NULL) AND (titulo_original=$2 OR $2 IS NULL) AND(genero=$3 OR $3 IS NULL) AND (idioma=$4 OR $4 IS NULL) AND (autor=$5 OR $5 IS NULL) AND (editora = $6 OR $6 IS NULL)", [nome, titulo_original, genero, idioma, autor, editora])
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

async function inserirLivro(nome, titulo_original, genero, idioma, autor, iditora, preco, numero_paginas, isbn, descricao, data_publicacao, imagem) {
    const client = await connect();
    try{
         //Criando a conexão com o banco de dados 
        //Argumentando o código SQL
        await client.query("INSERT INTO Livro (nome, titulo_original, genero, idioma, autor, editora, preco, numero_paginas, isbn, descricao, data_publicacao, imagem) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [nome, titulo_original, genero, idioma, autor, iditora, preco, numero_paginas, isbn, descricao, data_publicacao, imagem]);
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
    mostrarLivrosFiltros
}
