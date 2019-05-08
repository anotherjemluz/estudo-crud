const bcrypt = require('bcrypt-nodejs')
// importando o bcrypt

module.exports = app => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation
  // "importando" as funções de validação

  const encryptPass = password => {
    const salt = bcrypt.genSaltSync(10)
    // tempero da senha - hashs que são geradas a partir da senha, quando chamado em momentos diferentes são geradas hashs diferentes
    return bcrypt.hashSync(password, salt)
    // retorna a senha criptografada
  }

  const saveCliente = async (requisicao, resposta) => {
  // metodod assíncrono para inserir e alterar um usuário 
    // resposta.send('cliente save')
    
    const cliente = { ...requisicao.body }
    // no body da requisição há um json, que é interceptado pelo bodyparse, gerando um objeto 
    
    if (requisicao.params.login) cliente.login =  requisicao.params.login
    // verifica se um id foi passado aos parametros da requisição e o atribui para o id de cliente
    // isso será usado no médoto PUT

    try {
    // tratamento de falhas
      existsOrError(cliente.nome, 'Nome não inserido.')
      existsOrError(cliente.login, 'Login não inserido.')
      existsOrError(cliente.senha, 'Senha não inserida.')
      existsOrError(cliente.confirmarSenha, 'Confirmação de senha inválida.')
      equalsOrError(cliente.senha, cliente.confirmarSenha, 'Senhas não conferem.')

      // const clienteFromDB = await app.db('cliente').where({ login: cliente.login }).first()
      // atribui a clienteFromDB o primeiro usuário do banco de dados onde o login corresponder ao login inserido.
      // a expressão await (que só pode ser usada em funções assincronas) congela a execução da função até que a promisse seja entregue.
      // app.db acessa o knex.

      // if (clienteFromDB) {
        // essa vaidaçãosó deve ser feita se o cliente id não estiver setado
        // notExistsOrError(clienteFromDB, 'Cliente já cadastrado.')
        // o clienteFromDB se refere ao novo usuário que pretende ser inserido no banco de dados, por isso antes ele busca se há algum parecido com o await
      // }
    } catch (msg) {
       return resposta.status(400).send(msg)
      // 400 é um erro de quem está fazendo a requisição, no caso o cliente que não inseriu os dados corretamente
    }

    // se ele passou por todos os testes de validação do try, então ele pode ser inserido ou atualizado
    cliente.senha = encryptPass(cliente.senha)
    // vai criptografar a senha fornecida pelo usuário
    delete cliente.confirmarSenha
    // exclui a confirmação da senha já que ela não vai ser inserida no banco de dados

    const clienteFromDB = await app.db('cliente').where({ login: cliente.login }).first()
    // atribui a clienteFromDB o primeiro usuário do banco de dados onde o login corresponder ao login inserido.
    // a expressão await (que só pode ser usada em funções assincronas) congela a execução da função até que a promisse seja entregue.
    // app.db acessa o knex.

    if (clienteFromDB) {
      app.db('cliente')
        .update(cliente)
        .where({ login: cliente.login })
        .then(_ => resposta.status(204).send())
        .catch(err => resposta.status(500).send(err))
      // realiza um update no banco de dados onde o id corresponder ao id inserido
      // se deu tudo certo ele retorna 204, que é uma confirmação de sucesso mas sem conteúdo
      // caso dê algo errado no update, ele retorna o erro 500, pois provavelmente é algum problema interno no servidor
    } else {
      app.db('cliente')
        .insert(cliente)
        .then(_ => resposta.status(204).send())
        .catch(err => resposta.status(500).send(err))
      // se não existe nenhum usuário no banco de dados c aquele id então é um caso de inserção de um novo usuário
    }
  } 

  const getCliente = (requisicao, resposta) => {
    // metodo para obter uma lista dos usuários 
    app.db('cliente')
      .select('login', 'nome', 'senha')
      .then(clientes => resposta.json(clientes))
      .catch(err => resposta.status(500).send(err))
      // faz um select na tabela de usuários retornando id nome e login
      // se tudo der certo ele retorna o objeto json contendo oso usuários
  }

  const getClienteByLogin = (requisicao, resposta) => {
    // metodo para obter uma lista dos usuários 
    app.db('cliente')
      .select('nome', 'login', 'senha')
      .where({ login: requisicao.params.login })
      .first()
      .then(cliente => resposta.json(cliente))
      .catch(err => resposta.status(500).send(err))
      // faz um select na tabela de usuários retornando id nome e login
      // se tudo der certo ele retorna o objeto json contendo oso usuários
  }

  const removeCliente = async (requisicao, resposta) => {
    try{
      const rowsDeleted = await 
      app.db('cliente')
        .where({ login: requisicao.params.login })
        .del()
      // remove baseado no login inserido na url
        
      existsOrError(requisicao.params.login, 'Login do cliente não informado.')
      // tratamento de falhas

      resposta.status(204).send()
      // se o delete deu certo retorna um Sucess No Content
    } catch (msg) {
      resposta.status(400).send(msg)
    }
  }

  return { saveCliente, getCliente, getClienteByLogin, removeCliente }
} // module exports retorna um objeto com as funções do escopo 