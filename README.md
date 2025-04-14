# E-commerce_Biblioteca

# Backend
 
O Backend foi desenvolvido 100% pela linguagem de programação Java Script. 
 
O Backend é divido por 13 arquivos, 2 arquivos sendo a linha de configuração do projeto node.js, e os outros 11 sendo usados para execução direta do projeto.
 
Os dois arquivos comentados são: o "package-lock.json" e o "package.json". Eles contém as dependencias que a aplicação utiliza. Os outros 11 são: ".env", "carrinho.js", "carrinho_livro.js", "estoque.js", "index.js", "livro.js", "livro_pedido.js", "pedido.js", "usuario.js" e o "usuario_pedido.js".
 
## .env
O .env foi o primeiro arquivo criado no Backend. Esse arquivo é usado para armazenar as informações: user, host, database, password e port, que são necessarias para conectar com o banco de dados.
 
    
## .index.js
### introdução
O index.js foi o segundo arquivo criado. Esse arquivo tem a função principal de interagir diretamente com o frontend, disponibilizando as funções dos outros arquivos.
 
### Primeiros códigos
Antes de qualquer coisa foi feito 2 coisas para fazer o backend funcionar. A primeira foi iniciar a biblioteca dotenv (uma biblioteca para gestão de variavel de ambiente) para ter acesso as informações do .env e já pegar a informação "port" para criar as rotas. A segunda foi iniciar a biblioteca express (Biblioteca para cirar backend) e criar uma aplicação nodejs com uma variável chamada "app". Abaixo está como foi feito as duas etapas:
 
```javascript
require("dotenv").config(); //iniciando a biblioteca dotenv
 
const port = process.env.PORT; //pegando a informação PORT
 
const express = require("express") //inicando a biblioteca express
 
const app = express(); //Criando a aplicação
 
````
 
### Cors
No meio do processo vimos que precisavamos fazer um cors para conectar sem erro no Frontend. Primeiro nós importamos o módulo cors no meu arquivo Node.js e depois permiti que qualquer origem acesse os recursos da minha aplicação. Veja abaixo como foi feito: 
 
```javascript
const cors = require('cors')
 
app.use(cors());
 
````
 
### Rotas
Agora que tudo foi configurado, vamos para rotas. As rotas é o caminho que o frontend vai usar para utilizar as funções CRUD. 
 
As rotas sempre vão ter a entrada que as informações vão ser todas passadas em uma URL. Dois parâmetros, para o request e o response. Uma linha de código que vai pegar as informações que estão no request e passar em ordem para cada variavel, pois todas as informações colocadas na URL vai para o request. Vão ter condições, para verificar se o dado foi colocado na entrada corretamente. E retornar uma mensagem em formato json. Veja o exemplo, de uma das rotas, abaixo para entender como foi feito:
 
```javascript
//"/usuarioADD/", para indicar a rota. "(req, res)", são os parÂmetros
app.post("/usuarioADD/", async (req, res) => {
 
    //A linha de códgio para pegar as informações da requisição
    const { nome, email, senha, cpf, telefone, cidade, rua, bairro, numero, cep } = req.body; // Pegando os parâmetros da URL
 
    //As condições: 
    if(numero != parseInt(numero)){
        res.json({mensagem: "Você escreveu algo diferente de um número inteiro, no campo 'numero'. Escreva um número inteiro para da certo!"})
 
    } else {
        
        //A execução das funções de outros arquivos
        await dbUsuario.inserirUsuario(nome, email, senha, cpf, telefone, cidade, rua, bairro, numero, cep);
 
        //uma mensagem para indicar que deu tudo certo
        res.json({ mensagem: "Usuario inserido com sucesso!" }); 
    }
})
 
 
````
 
Existem rotas de todoas as funções crud de todos outros 9 arquivos, que vão ser apresnetados no próximo tópico.
 
## Arquivos databases
 
Os 9 arquivos que sobraram, "carrinho.js", "carrinho_livro.js", "estoque.js", "livro.js", "livro_pedido.js", "pedido.js", "usuario.js" e o "usuario_pedido.js", são nomeados de acordo com o nome das tabelas do banco de dados, ou seja, se quiser mexer na tabela usuario, eu tenho que utilizar as funções que estão no "usuario.js"
 
Todos eles contém 4 funções, cada uma representando as quatro operações básicas do desenvolvimento de uma aplicação, o CRUD, uma função para conectar com o banco de dados e mais algumas funções que foram necessárias para a aplicação.
 
### Função connect()
 
A função connect, como o nome já diz, é a função que vai conectar o backend com o banco de dados
 
Primeiro de tudo, eu iniciei uma connection pool. A connection pool, uma estratégia de conexão que abre algumas conexões com o banco de dados e usar apenas o necessário. Para isso eu usei uma linha código que vai pegar apenas a classe pool da biblioteca pg. Após isso eu passei as informações do banco de dados (que estava no arquivo .env) e estabeleci a conexão. Vejo no código abaixo como foi feito: 
 
```javascript
 
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
 
     //Usando uma Singleton. 
    if(global.connection)
        return global.connection.connect();
    
}
 
````
 
Obs: A ultima condição, que retorna: "global.connection.connect();", é uma estratégia chamada Singleton, usada pra evitar criar várias objetos apenas para fazer uma execução. Ela foi usada nessa aplicação para que sempre fique em conexão com o banco de forma simples
 
### Funções CRUD
As funções CRUD são teoricamente iguais. Tem nome, os parâmetros, uma linha para usar a função connection(), o argumento SQL, algumas tem condições para atualizar apenas que não são null e uma linha de comando que devolve a conexão ao pool para que outra parte do código possa usá-la, se não liberar pode acabar esgotando as conexões disponíveis. Vejo uma função como exemplo abaixo: 
 
```javascript
 
async function deletarUsuario(id) {
    try{
         //Criando a conexão com banco de dados 
        const client = await connect();
        //Argumentando o código SQL
        await client.query("DELETE FROM Usuario WHERE id=$1", [id])
    }
    finally{
        client.release() //devolve a conexão de volta para o pool
    }
  
}
 
````
 
### Exportação
Para liberar as funções, para que outros arquivos usem, foi feita a sintaxe de exportação do CommonJS — um sistema de módulos bastante usado no Node.js. Veja abaixo um exemplo do arquivo usuario.js
 
```javascript
module.exports = {
    mostrarUsuarios,
    mostrarUsuario,
    inserirUsuario,
    modificarUsuario,
    deletarUsuario,
    fazerLogin
}
````
