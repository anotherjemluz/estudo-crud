// o .env não deve ser mapeado pelo repositório, por cuestões de segurança, apesar do authSecret ser um código aleátorio, se ele é exposto a aplicação fica sujeita a falhas graves de segurança. 

// o token terá um tempo de expiração que irá controlar a duração da sessão do usuário

const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
  const signin = async (requisicao, resposta) => {
    if (!requisicao.body.login || !requisicao.body.senha) {
      return resposta.status(400).send('Informe o login e senha.')
      // verifica se os campos foram preenchidos
    } 

    const cliente = await
    app.db('cliente')
      .where({ login: requisicao.body.login })
      .first()
    // procura o usuário correspondente no banco de dados
    // se não encontrar o cliente correspondente no banco de dados, retorna erro 400
    if (!cliente) return resposta.status(400).send('Usuário ou senha não existe.')
  
    // como os hashs de senhas iguais são diferentes, para fazer o match entre a senha inserida e a presente no sistema criamos uma variável que irá usar a função compareSync do bcrypt para fazer a validação
    const isMatch = bcrypt.compareSync( requisicao.body.senha, cliente.senha )
    if (!isMatch) return resposta.status(401).send('Login ou senha inválidos.')

    // se tudo ocorreu bem o token deve ser gerado e junto com ele o tempo de expiração, para isso vamos precisamos saber em que momento o login foi realizado e a partir dele adicionar o tempo de expiração do token.

    const now = Math.floor(Date.now() / 1000) 
    // Date.now() no console javascript retorna a data de hj em milisegungos, contando a partir de 1 de janeiro de 1970
    // Dividimos por mil para converter os milisegundos para segundos 

    // payload irá armazenar os dados da sessão
    const payload = {
      login: cliente.login,
      nome: cliente.nome,
      iat: now,
      exp: now + (60 * 60 * 24 * 3)
      // iat corresponde à "issued at" ou "emitido em"
      // exp corresponde ao valor da emissão acrescido de 3 dias ( segundos * minutos * horas * dias )
    }

    resposta.json({
      ...payload, 
      token: jwt.encode(payload, authSecret)
      //o JSON Web Token irá usar o payload junto com o authSecret para gerar o token 
    })
    // o usuário então recebe como resposta da sua requisição os dados da sessão e um token de expiração.
  }

  // apos um token ser criado, qualquer nova requisição precisará de um cabeçalho chamado autorization para fazer a validação do token.
  const validateToken = async (requisicao, resposta) => {
    const clienteData = requisicao.body || null
    // se o não houver nada na requisição, clienteData assume nulo

    try {
      // se clienteData foi setado, ele decodifica o token existente na requisção
      if (clienteData) {
        const token = jwt.decode(clienteData.token, authSecret)
        
        // verifica se o token ainda é válido comparando a data de expiração com a data atual
        if (new Date(token.exp * 1000) > new Date()) {
          return resposta.send(true)
        }
      }
    } catch (e) {
      // seproblemas no token
    }
    resposta.send(false)
  }

  return { signin, validateToken }
}