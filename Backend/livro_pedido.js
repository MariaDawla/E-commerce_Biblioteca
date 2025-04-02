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

//Função para mostrar livro_pedido
async function mostrarLivros_pedido(){
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    const res = await client.query("SELECT * FROM livro_pedido");
    //Retornando os resultados por linhas
    return res.rows;
}

//Função para mostrar os Livro_pedido por id
async function mostrarLivro_pedido(id){
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    const res = await client.query("SELECT * FROM livro_pedido WHERE id=$1", [id]);
    //Retornando os resultados por linhas
    return res.rows;
}

//Função para inserir os Livro_pedido
async function inserirLivro_pedido(id_livro, id_pedido) {
    //Criando a conexão com o banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    await client.query("INSERT INTO livro_pedido (id_livro, id_pedido, id_livro, id_pedido) values ($1, $2, $3, $4)", [id_livro, id_pedido, id_livro, id_pedido]);
}

//Função para deletar o Livro_pedido
async function deletarLivro_pedido(id) {
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    await client.query("DELETE FROM livro_pedido WHERE id=$1", [id])
}

//exportando as funções desse arquivo para outro arquivo 
module.exports = {
    mostrarLivros_pedido,
    mostrarLivro_pedido,
    inserirLivro_pedido,
    deletarLivro_pedido
}
