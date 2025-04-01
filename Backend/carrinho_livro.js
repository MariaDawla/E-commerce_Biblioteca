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

//Função para mostrar os Carrinho_livro
async function mostrarCarrinhos_livro(){
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    const res = await client.query("SELECT * FROM carrinho_livro");
    //Retornando os resultados por linhas
    return res.rows;
}

//Função para mostrar os Carrinho_livro por id
async function mostrarCarrinho_livro(id){
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    const res = await client.query("SELECT * FROM carrinho_livro WHERE id=$1", [id]);
    //Retornando os resultados por linhas
    return res.rows;
}

//Função para inserir os Carrinho_livro
async function inserirCarrinho_livro(id_carrinho, id_livro) {
    //Criando a conexão com o banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    await client.query("INSERT INTO carrinho_livro (id_carrinho, id_livro, id_carrinho, id_livro) values ($1, $2, $3, $4)", [id_carrinho, id_livro, id_carrinho, id_livro]);
}

//Função para deletar o Carrinho_livro
async function deletarCarrinho_livro(id) {
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    await client.query("DELETE FROM carrinho_livro WHERE id=$1", [id])
}

//exportando as funções desse arquivo para outro arquivo 
module.exports = {
    mostrarCarrinhos_livro,
    mostrarCarrinho_livro,
    inserirCarrinho_livro,
    deletarCarrinho_livro
}
