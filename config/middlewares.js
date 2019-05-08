// middleware 1: body parse (interpretador de requisições - usando json)
const bodyParser = require('body-parser')
// middleware 2: cors (permite o acesso da api local atráves de outras aplicações externas)
const cors = require('cors')

module.exports = app => { 
// app referesse a instancia do express criada no arquivo index.js
  app.use(bodyParser.json())
  app.use(cors())
  // use() é um metodo para aplicar middlewares
} // esse escopo é responsável por receber uma istancia e injetar os middlewares nela (é um padrão do consign)

// mesmo que você não tenha interesse de disponibilizar a api para aplicações externas, esse middleware é necessário por já se tratar de um ecossistema composto por 2 aplicações (pasta backend, e pasta frontend)

// a aplicação backend precisa do node para produção
// a aplicação frontend, por gerar arquivos estáticos, só precisa do node em desenvolvimento