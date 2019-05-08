const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

  const saveCategoria = async (requisicao, resposta) => {
    const categoria = { ...requisicao.body }

    if (requisicao.params.id) categoria.id = requisicao.params.id

    try {
      existsOrError(categoria.descricao, 'Descrição não inserida.')

      const categoriaFromDB = await 
        app.db('Categoria')
          .where({ descricao: categoria.descricao })
          .first()

      if (!categoria.id) {
        notExistsOrError(categoriaFromDB, 'Categoria já cadastrada.')
      }

    } catch (msg) {
      return resposta.status(400).send(msg)
    }

    if (categoria.id) {
      app.db('categoria')
        .update(categoria)
        .where({ id: categoria.id })
        .then(_ => resposta.status(204).send())
        .catch(err => resposta.status(500).send(err))

    } else {
      app.db('categoria')
        .insert(categoria)
        .then(_ => resposta.status(204).send())
        .catch(err => resposta.status(500).send(err))
    }
  }

  const getCategoria = (requisicao, resposta) => {
    app.db('categoria')
      .select('id', 'descricao')
      .then(categorias => resposta.json(categorias))
      .catch(err => resposta.status(500).send(err))

  }

  const getCategoriaById = (requisicao, resposta) => {
    app.db('categoria')
      .select('id', 'descricao')
      .where({ id: requisicao.params.id })
      .first()
      .then(categoria => resposta.json(categoria))
      .catch(err => resposta.status(500).send(err))
  }

  const removeCategoria = async (requisicao, resposta) => {
    try{
      existsOrError(requisicao.params.id, 'Código da categoria não informado.')
      
      const produtos = await app.db('produto')
        .where({ categoriaId: requisicao.params.id})
      notExistsOrError(produtos, 'Essa categoria está vinculada a produtos e não pode ser excluida.')
     
      const rowsDeleted = await app.db('categoria')
        .where({ id: requisicao.params.id })
        .del()
      existsOrError(rowsDeleted, 'Categoria não encontrada')

      resposta.status(204).send()

    } catch (msg) {
      resposta.status(400).send(msg) 
    }
  }

  return { saveCategoria, getCategoria, getCategoriaById, removeCategoria }
}
