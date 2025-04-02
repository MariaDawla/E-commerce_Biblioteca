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
async function mostrarUsuarios(){
    const client = await connect();
    try{
          //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        const res = await client.query("SELECT * FROM Usuario");
        //Retornando os resultados por linhas
        return res.rows;
    }
    finally{
        client.release()
    }
  
}

async function mostrarUsuario(id){
    const client = await connect();
    try{
        //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        const res = await client.query("SELECT * FROM Usuario WHERE id=$1", [id]);
        //Retornando os resultados por linhas
        return res.rows;
    }
    finally{
        client.release()
    }
   
}

async function fazerLogin(email, senha){
    const client = await connect();
    try{
        const res = await client.query("SELECT * FROM usuario WHERE email=$1 AND senha=$2", [email, senha]);
        return res.rows;
    }
    finally{
        client.release()
    }
}

async function inserirUsuario(nome, email, senha, cpf, telefone, cidade, rua, bairro, num_endereco, cep) {
    const client = await connect();

    try{
        //Criando a conexão com o banco de dados 
        //Argumentando o código SQL
        await client.query("INSERT INTO Usuario (nome, email, senha, cpf, telefone, cidade, rua, bairro, num_endereco, cep) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [nome, email, senha, cpf, telefone, cidade, rua, bairro, num_endereco, cep]);
    }
    finally{
        client.release()
    }
}

async function modificarUsuario(id, nome, email, senha, telefone, cidade, rua, bairro, num_endereco, cep) {
    const client = await connect();
    try{
    //Criando a conexão com o banco de dados

    //Verificação e execução de comando sql
    if(nome != null){
        await client.query("UPDATE Usuario SET nome=$1 WHERE id=$2", [nome, id])
    }

    if(email != null){
        await client.query("UPDATE Usuario SET email=$1 WHERE id=$2", [email, id])
    }

    if(senha != null){
        await client.query("UPDATE Usuario SET senha=$1 WHERE id=$2", [senha, id])
    }

    if(telefone != null){
        await client.query("UPDATE Usuario SET telefone=$1 WHERE id=$2", [telefone, id])
    }

    if(cidade != null){
        await client.query("UPDATE Usuario SET cidade=$1 WHERE id=$2", [cidade, id])
    }

    if(rua != null){
        await client.query("UPDATE Usuario SET rua=$1 WHERE id=$2", [rua, id])
    }

    if(bairro != null){
        await client.query("UPDATE Usuario SET bairro=$1 WHERE id=$2", [bairro, id])
    }

    if(num_endereco != null){
        await client.query("UPDATE Usuario SET numero=$1 WHERE id=$2", [num_endereco, id])
    }

    if(cep != null){
        await client.query("UPDATE Usuario SET cep=$1 WHERE id=$2", [cep, id])
    }
    }
    finally{
        client.release()
    }
}

async function deletarUsuario(id) {
    try{
          //Criando a conexão com banco de dados 
        const client = await connect();
        //Argumentando o código SQL
        await client.query("DELETE FROM Usuario WHERE id=$1", [id])
    }
    finally{
        client.release()
    }
  
}

//exportando as funções desse arquivo para outro arquivo 
module.exports = {
    mostrarUsuarios,
    mostrarUsuario,
    inserirUsuario,
    modificarUsuario,
    deletarUsuario,
    fazerLogin
}
