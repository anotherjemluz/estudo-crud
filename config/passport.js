const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
  const params = {
    secretOrKey: authSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }

  // a estrategia usa os parametros obtidos da requisição como referência
  const strategy = new Strategy(params, (payload, done) => {
    app.db('cliente')
      .where({ login: payload.login })
      .first()
      .then(cliente => done(null, cliente ? { ...payload } : false ))
      .catch(err => done(err, false))

    // realiza um acesso ao banco de dados que, se bem sucedido, retorna o payload do usuário.
    // caso a aplicação da estratégia não dê certo retorna false
  })

  passport.use(strategy)

  return {
    authenticate: () => passport.authenticate('jwt', { session: false })
  }
}
