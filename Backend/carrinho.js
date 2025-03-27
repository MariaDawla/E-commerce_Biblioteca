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
async function mostrarCarrinhos(){
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    const res = await client.query("SELECT * FROM Carrinho");
    //Retornando os resultados por linhas
    return res.rows;
}

async function mostrarCarrinhoUsuario(id_usuario){
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    const res = await client.query("SELECT * FROM Carrinho WHERE id_usuario=$1", [id_usuario]);
    //Retornando os resultados por linhas
    return res.rows;
}


async function inserirCarrinho(id_usuario, id_livro, quantidade) {
    const client = await connect();

    try {
        // Verifica se o usuário existe
        const usuarioExiste = await client.query("SELECT id_usuario FROM Usuarios WHERE id = $1", [id_usuario]);
        if (usuarioExiste.rowCount === 0) {
            throw new Error("Usuário não encontrado!");
        }

        // Verifica se o livro existe
        const livroExiste = await client.query("SELECT id_livro, preco_unitario FROM Livros WHERE id = $1", [id_livro]);
        if (livroExiste.rowCount === 0) {
            throw new Error("Livro não encontrado!");
        }
        const precoLivro = livroExiste.rows[0].preco_unitario;

        // Inserindo no carrinho, pois ambos existem
        await client.query(
            "INSERT INTO Carrinho (id_usuario, id_livro, preco_unitario, quantidade) values ($1, $2, $3, $4)",
            [id_usuario, id_livro, precoLivro, quantidade]
        );
        return res.rows;
        
    } catch (err) {
        return { erro: err.message };
    } finally {
        await client.end();
    }
}


async function deletarLivroCarrinho(id_usuario, id_livro) {
    //Criando a conexão com banco de dados 
    const client = await connect();
    //Argumentando o código SQL
    await client.query("DELETE FROM Carrinho WHERE id_usuario=$1 AND id_livro=$2", [id_usuario, id_livro])
}

//exportando as funções desse arquivo para outro arquivo 
module.exports = {
    mostrarCarrinhoUsuario,
    mostrarCarrinhos,
    inserirCarrinho,
    deletarLivroCarrinho
}
