// arquivo de validações dos dados para lidar c as requisições (inserção correta de dados)

module.exports = app => {
  // famosa função se existe ok, se não, retorna um erro
  function existsOrError(value, msg) {
    if (!value) throw msg
    // se o valor não existe é lançada uma mensagem
    if (Array.isArray(value) && value.length === 0) throw msg
    // se o valor for um array & se for um array vazio é lançada uma mensagem
    if (typeof value === 'string' && !value.trim()) throw msg
    // se o tipo é uma string & se é uma string em branco é lançada uma mensagem
  }

  // função para o que não deve existir, logicamente oposta a existsOrErro
  function notExistsOrError(value, msg) {
    try {
      existsOrError(value, msg)
      // ve se passa pelos testes da exists
    } catch (msg) {
      // se não passar 'parado aí mocinho, você está preso'
      return
    }
    throw msg
  }

  // função para testar se há valores iguais ou não
  function equalsOrError(valueA, valueB, msg) {
    if (valueA !== valueB) throw msg
    // se A diferente de B passa uma mensagem
  }

  return { existsOrError, notExistsOrError, equalsOrError }
}