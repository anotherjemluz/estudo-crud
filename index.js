// para rodar basta executar o comando 'npm start' da pasta backend

const  app = require('express')()
// "importando" o express

const consign = require('consign')
// importando o consign

const db = require('./config/db')
// imporrta o arquivo de configuração do banco de dados

app.db = db
// db é o knex já configurado para o banco de dados a ser utilizado

// o consign ajuda a gerneciar as dependencias dentro da aplicação, como um intermediario que vai mapea-las
consign()
  .include('./config/passport.js')
  .then('./config/middlewares.js')
  // carrega os middlewares para injeta-los em seguida
  .then('./api/validation.js')
  // carrega as validações (pra prevenir o erro de carregar os usuários antes das validações)
  .then('./api')
  // carrega a pasta api
  .then('./config/routes.js')  
  // carrega as rotas 
  .into(app)
  // injata-os em app

var port = process.env.PORT || 3000
app.listen(port, () => {
  // função para escutar a porta 3000 e retornar um callback
  console.log('Umbler escutando na porta %s', port);
  // atenção: verifique se não há nenhum outro processo em paralelo a ser rodado na mesma porta, do contrario o beckend n irá startar.
  // se houver, aloque para outra porta que esteja livre
  // se vc rodar 2x é provavel que dê erro tbm pois já tem uma versão rodando 
})