const dbEstoque = require("./estoque") //importa as funções do arquivo estoque.js

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

//Função para mostrar os pedidos
async function mostrarPedidos(){
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    const res = await client.query("SELECT * FROM Pedido");
    //Retornando os resultados por linhas
    return res.rows;
}

async function mostrarPedido(id){
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    const res = await client.query("SELECT * FROM Pedido WHERE id=$1", [id]);
    //Retornando os resultados por linhas
    return res.rows;
}

async function inserirPedido(id_usuario, id_livro, preco_unitario, quantidade) {
    //Criando a conexão com o banco de dados 
    const client = await connect();

    //AQUI
    preco_total = preco_unitario * quantidade

    //Argumentando o código SQL
    await client.query("INSERT INTO pedido (id_usuario, id_livro, preco_unitario, quantidade) values ($1, $2, $3, $4)", [id_usuario, id_livro, preco_total, quantidade]);

    //Atualizar o estoque
    dbEstoque.modificar_Quantidade_do_Livro_no_Estoque(id_livro, quantidade)

}

async function deletarPedido(id) {
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    await client.query("DELETE FROM Pedido WHERE id=$1", [id])
}

//exportando as funções desse arquivo para outro arquivo 
module.exports = {
    mostrarPedidos,
    mostrarPedido,
    inserirPedido,
    deletarPedido
}
