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

    const saveFuncionario = async (requisicao, resposta) => {
        // metodod assíncrono para inserir e alterar um usuário 
        // resposta.send('funcionario save')

        const funcionario = { ...requisicao.body }
        // no body da requisição há um json, que é interceptado pelo bodyparse, gerando um objeto 

        if (requisicao.params.login) funcionario.login = requisicao.params.login
        // verifica se um id foi passado aos parametros da requisição e o atribui para o id de funcionario
        // isso será usado no médoto PUT

        try {
            // tratamento de falhas
            existsOrError(funcionario.nome, 'Nome não inserido.')
            existsOrError(funcionario.login, 'Login não inserido.')
            existsOrError(funcionario.senha, 'Senha não inserida.')
            existsOrError(funcionario.confirmarSenha, 'Confirmação de senha inválida.')
            equalsOrError(funcionario.senha, funcionario.confirmarSenha, 'Senhas não conferem.')
            existsOrError(funcionario.salario, 'Salário não inserido.')

            // const funcionarioFromDB = await app.db('funcionario').where({ login: funcionario.login }).first()
            // atribui a funcionarioFromDB o primeiro usuário do banco de dados onde o login corresponder ao login inserido.
            // a expressão await (que só pode ser usada em funções assincronas) congela a execução da função até que a promisse seja entregue.
            // app.db acessa o knex.

            // if (!funcionario.id) {
                // essa vaidaçãosó deve ser feita se o funcionario id não estiver setado
                // notExistsOrError(funcionarioFromDB, 'funcionario já cadastrado.')
                // o funcionarioFromDB se refere ao novo usuário que pretende ser inserido no banco de dados, por isso antes ele busca se há algum parecido com o await
            // }
        } catch (msg) {
            return resposta.status(400).send(msg)
            // 400 é um erro de quem está fazendo a requisição, no caso o funcionario que não inseriu os dados corretamente
        }

        // se ele passou por todos os testes de validação do try, então ele pode ser inserido ou atualizado
        funcionario.senha = encryptPass(funcionario.senha)
        // vai criptografar a senha fornecida pelo usuário
        delete funcionario.confirmarSenha
        // exclui a confirmação da senha já que ela não vai ser inserida no banco de dados

        const funcionarioFromDB = await app.db('funcionario').where({ login: funcionario.login }).first()
        // atribui a funcionarioFromDB o primeiro usuário do banco de dados onde o login corresponder ao login inserido.
        // a expressão await (que só pode ser usada em funções assincronas) congela a execução da função até que a promisse seja entregue.
        // app.db acessa o knex.

        if (funcionarioFromDB) {
            app.db('funcionario')
                .update(funcionario)
                .where({ login: funcionario.login })
                .then(_ => resposta.status(204).send())
                .catch(err => resposta.status(500).send(err))
            // realiza um update no banco de dados onde o id corresponder ao id inserido
            // se deu tudo certo ele retorna 204, que é uma confirmação de sucesso mas sem conteúdo
            // caso dê algo errado no update, ele retorna o erro 500, pois provavelmente é algum problema interno no servidor
        } else {
            app.db('funcionario')
                .insert(funcionario)
                .then(_ => resposta.status(204).send())
                .catch(err => resposta.status(500).send(err))
            // se não existe nenhum usuário no banco de dados c aquele id então é um caso de inserção de um novo usuário
        }
    }

    const getFuncionario = (requisicao, resposta) => {
        // metodo para obter uma lista dos usuários 
        app.db('funcionario')
            .select('login', 'nome', 'senha', 'salario')
            .then(funcionarios => resposta.json(funcionarios))
            .catch(err => resposta.status(500).send(err))
        // faz um select na tabela de usuários retornando id nome e login
        // se tudo der certo ele retorna o objeto json contendo oso usuários
    }

    const getFuncionarioByLogin = (requisicao, resposta) => {
        // metodo para obter uma lista dos usuários 
        app.db('funcionario')
            .select('nome', 'login', 'senha', 'salario')
            .where({ login: requisicao.params.login })
            .first()
            .then(funcionario => resposta.json(funcionario))
            .catch(err => resposta.status(500).send(err))
        // faz um select na tabela de usuários retornando id nome e login
        // se tudo der certo ele retorna o objeto json contendo oso usuários
    }

    const removeFuncionario = async (requisicao, resposta) => {
        try{
            const rowsDeleted = await 
            app.db('funcionario')
                .where({ login: requisicao.params.login })
                .del()
            
            existsOrError(requisicao.params.login, 'Login do funcionario não informado.')

            resposta.status(204).send()
        } catch (msg) {
            resposta.status(400).send(msg)
        }
    } 

    return { saveFuncionario, getFuncionario, getFuncionarioByLogin, removeFuncionario }
} // module exports retorna um objeto com as funções do escopo 