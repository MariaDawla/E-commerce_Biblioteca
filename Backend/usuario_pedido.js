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

    //"global": área global usada para guardar. Nesse caso vai está guardando o objeto connection
    global.connection = pool;

     /*Usando uma Singleton. Singleton: É uma estratégia usada pra evitar criar várias objetos apenas para fazer uma execução, 
                                        então além de criar vários objetos, uma singleton vai reutilizar os objetos já criados*/
    if(global.connection)
        return global.connection.connect();
    
}

//Função para mostrar usuario_pedido
async function mostrarUsuarios_pedido(){
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    const res = await client.query("SELECT * FROM usuario_pedido");
    //Retornando os resultados por linhas
    return res.rows;
}

//Função para mostrar os usuario_pedido por id
async function mostrarUsuario_pedido(id){
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    const res = await client.query("SELECT * FROM usuario_pedido WHERE id=$1", [id]);
    //Retornando os resultados por linhas
    return res.rows;
}

//Função para inserir os Usuario_pedido
async function inserirUsuario_pedido(id_usuario, id_pedido) {
    //Criando a conexão com o banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    await client.query("INSERT INTO usuario_pedido (id_usuario, id_pedido, id_usuario, id_pedido) values ($1, $2, $3, $4)", [id_usuario, id_pedido, id_usuario, id_pedido]);
}

//Função para deletar o Usuario_pedido
async function deletarUsuario_pedido(id) {
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    await client.query("DELETE FROM usuario_pedido WHERE id=$1", [id])
}

//exportando as funções desse arquivo para outro arquivo 
module.exports = {
    mostrarUsuarios_pedido,
    mostrarUsuario_pedido,
    inserirUsuario_pedido,
    deletarUsuario_pedido
}
