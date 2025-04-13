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

//Função para mostrar os pedidos
async function mostrarPedidos(){
    const client = await connect();
    try{
        //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        const res = await client.query("SELECT * FROM Pedido");
        //Retornando os resultados por linhas
        return res.rows;
    }
    finally{
        client.release()
    }
    
}

async function mostrarPedidoUsuario(id_usuario){
    const client = await connect();
    try{
         //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        const res = await client.query("SELECT p.id_usuario, l.id, l.nome, l.autor, l.preco, l.descricao, l.imagem, p.data_pedido FROM Pedido p JOIN Livro l ON p.id_livro = l.id where p.id_usuario=$1", [id_usuario]);
        //Retornando os resultados por linhas
        return res.rows;
    }
    finally{
        client.release()
    }
}

// async function inserirPedido(id_usuario, id_livro, preco_unitario, quantidade) {
//     const client = await connect();
//     try{
//         //Criando a conexão com o banco de dados 
//         //AQUI
//         preco_total = preco_unitario * quantidade

//         //Argumentando o código SQL
//         await client.query("INSERT INTO pedido (id_usuario, id_livro, preco_unitario, quantidade, data_pedido) values ($1, $2, $3, $4, CURRENT_DATE)", [id_usuario, id_livro, preco_total, quantidade]);

//         //Atualizar o estoque
//         dbEstoque.modificar_Quantidade_do_Livro_no_Estoque(id_livro, quantidade)
//     }
//     finally{
//         client.release()
//     }
// }

async function inserirPedido(id_usuario, itens) {
    const client = await connect();
    try {
        for (const item of itens) {
            const { id_livro, preco_unitario, quantidade } = item;
            const preco_total = preco_unitario * quantidade;

            await client.query(
                "INSERT INTO pedido (id_usuario, id_livro, preco_unitario, quantidade, data_pedido) values ($1, $2, $3, $4, CURRENT_DATE)",
                [id_usuario, id_livro, preco_total, quantidade]
            );

            // Atualiza o estoque
            await dbEstoque.modificar_Quantidade_do_Livro_no_Estoque(id_livro, quantidade);
        }
    } finally {
        client.release();
    }
}

async function deletarPedido(id) {
    const client = await connect();
    try{
         //Criando a conexão com banco de dados 
        //Argumentando o código SQL
        await client.query("DELETE FROM Pedido WHERE id=$1", [id])
    }
    finally{
        client.release()
    }
}

//exportando as funções desse arquivo para outro arquivo 
module.exports = {
    mostrarPedidos,
    mostrarPedidoUsuario,
    inserirPedido,
    deletarPedido
}
