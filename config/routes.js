// definição de rota para acessar os usuários pela url /clientes usando o metodo http POST.
module.exports = app => {
  app.post('/signup', app.api.cliente.saveCliente)
  app.post('/signin', app.api.auth.signin)
  app.post('/validateToken', app.api.auth.validateToken)
  // as urls acima são públicas, disponiveis para qualquer usuário, as demais são protegidas

  app.route('/clientes')
    .all(app.config.passport.authenticate())
    .post(app.api.cliente.saveCliente)
    .get(app.api.cliente.getCliente)
  // .all() é um filtro que chama o metodo autenticate do arquivo passport para validar a sessão e a partir disso permitir ou negar o acesso aos serviços da aplicação
  // .post vai associar qual metodo será chamado quando ele receber uma requisição nessa rota usando post.
  // consign usa o caminho app.api.cliente.save para chamar a instancia, acessar a api, entrar no arquivo cliente e pegar a função save retornada pelo modulo.

  // um exemplo da mesma configuração, sem usar o consign:
  // const cliente = require('../api.cliente')
  // module.exports = app => {
  //   app.route('/clientes')
  //     .post(cliente.save)
  // }

  app.route('/clientes/:login')
    .all(app.config.passport.authenticate())
    .put(app.api.cliente.saveCliente)
    .get(app.api.cliente.getClienteByLogin)
    .delete(app.api.cliente.removeCliente)
  // o método save serve tanto para inserir quanto para alterar um usuário, por isso a diferença entre o POST e o PUT está no parâmetro fornecido na url (no caso o :id ou a ausencia dele), é assim que o método descobri qual tipo de requisição está sendo feita

  app.route('/funcionarios')
    .all(app.config.passport.authenticate())
    .post(app.api.funcionario.saveFuncionario)
    .get(app.api.funcionario.getFuncionario)

  app.route('/funcionarios/:login')
    .all(app.config.passport.authenticate())
    .put(app.api.funcionario.saveFuncionario)
    .get(app.api.funcionario.getFuncionarioByLogin)
    .delete(app.api.funcionario.removeFuncionario)

  app.route('/categorias')
    .all(app.config.passport.authenticate())
    .post(app.api.categoria.saveCategoria)
    .get(app.api.categoria.getCategoria)

  app.route('/categorias/:id')
    .all(app.config.passport.authenticate())
    .put(app.api.categoria.saveCategoria)
    .get(app.api.categoria.getCategoriaById)
    .delete(app.api.categoria.removeCategoria)

  app.route('/produtos')
    .all(app.config.passport.authenticate())
    .post(app.api.produto.saveProduto)
    .get(app.api.produto.getProduto)

  app.route('/produtos/:id')
    .all(app.config.passport.authenticate())
    .put(app.api.produto.saveProduto)
    .get(app.api.produto.getProdutoById)
    .delete(app.api.produto.removeProduto)

}

