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
async function mostrarCarrinhos(){
    const client = await pool.connect();
    try{
        //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        const res = await client.query("SELECT * FROM Carrinho");
        //Retornando os resultados por linhas
        return res.rows;
    }
    finally{
        client.release()
    }
 
}

async function mostrarCarrinhoUsuario(id_usuario){
    const client = await connect();
    try{
        //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        const res = await client.query("SELECT l.id, l.nome, l.autor, l.preco, l.descricao, l.imagem FROM Carrinho c JOIN Livro l ON c.id_livro = l.id where c.id_usuario=$1", [id_usuario]);
        //Retornando os resultados por linhas
        return res.rows;
    }
    finally{
        client.release()
    }
}


async function inserirCarrinho(id_usuario, id_livro) {
    const client = await connect();
    try {
        // Verifica se o usuário existe
        const usuarioExiste = await client.query("SELECT id FROM Usuario WHERE id = $1", [id_usuario]);
        if (usuarioExiste.rowCount === 0) {
            throw new Error("Usuário não encontrado!");
        }

        // Verifica se o livro existe
        const livroExiste = await client.query("SELECT preco FROM Livro WHERE id = $1", [id_livro]);
        if (livroExiste.rowCount === 0) {
            throw new Error("Livro não encontrado!");
        }
        const precoLivro = livroExiste.rows[0].preco;

        // Inserindo no carrinho
        await client.query(
            "INSERT INTO Carrinho (id_usuario, id_livro, preco_unitario) VALUES ($1, $2, $3)",
            [id_usuario, id_livro, precoLivro]
        );

        // Retorna os detalhes do livro adicionado
        const res = await client.query(
            "SELECT id, nome, autor, preco, descricao, imagem FROM Livro WHERE id = $1",
            [id_livro]
        );
        return res.rows;
        
    } 
    catch (err) {
        return { erro: err.message };
    } 
    finally {
        client.release();
    }
}


async function deletarLivroCarrinho(id_usuario, id_livro) {
    const client = await connect();
    try{
        //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        await client.query("DELETE FROM Carrinho WHERE id_usuario=$1 AND id_livro=$2", [id_usuario, id_livro])
    }
    finally{
        client.release()
    }
}

//exportando as funções desse arquivo para outro arquivo 
module.exports = {
    mostrarCarrinhoUsuario,
    mostrarCarrinhos,
    inserirCarrinho,
    deletarLivroCarrinho
}
