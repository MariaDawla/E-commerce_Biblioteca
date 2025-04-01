const dbLivro = require("./livro") //importa as funções do arquivo livro.js

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

//Função para mostrar o estoque
async function mostrar_Livros_no_Estoque(){
    const client = await connect();
    try{
        //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        const res = await client.query("SELECT * FROM estoque");
        //Retornando os resultados por linhas
        return res.rows;
    }
    finally{
        client.release()
    }
    
}

async function mostrar_Livro_no_Estoque(id){
    const client = await connect();
    try{
         //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        const res = await client.query("SELECT * FROM estoque WHERE id=$1", [id]);
        //Retornando os resultados por linhas
        return res.rows;
    }
    finally{
        client.release()
    }
   
}

async function inserirLivroNoEstoque(id_livro, quantidade) {
    const client = await connect();
    try{
         //Criando a conexão com o banco de dados 
        //Argumentando o código SQL
        await client.query("INSERT INTO estoque (id_livro, quantidade, id_livro) values ($1, $2, $3)", [id_livro, quantidade, id_livro]);
    }
    finally{
        client.release()
    }
   
}

async function modificar_Quantidade_do_Livro_no_Estoque(id_livro, quantidade) {
    const client = await connect();
    try{
        //Criando a conexão com o banco de dados
        //Verificação e execução de comando sql
        await client.query("UPDATE estoque SET quantidade=quantidade-$1 WHERE id_livro=$2", [quantidade, id_livro])
    }
    finally{
        client.release()
    }
}

async function deletar_Livro_no_Estoque(id) {
    const client = await connect();
    try{
        //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        await client.query("DELETE FROM estoque WHERE id=$1", [id])
    }
    finally{
        client.release()
    }
  
}

//exportando as funções desse arquivo para outro arquivo 
module.exports = {
    mostrar_Livros_no_Estoque,
    mostrar_Livro_no_Estoque,
    inserirLivroNoEstoque,
    modificar_Quantidade_do_Livro_no_Estoque,
    deletar_Livro_no_Estoque
}
