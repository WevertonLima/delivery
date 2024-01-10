const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql.js');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    // Lista todos os opcionais do produto
    const obterOpcionaisProduto = async (req) => {

        try {

            let idproduto = req.params.idproduto;

            var ComandoSQL = await readCommandSql.retornaStringSql('obterPorProdutoId', 'opcional');
            var result = await db.Query(ComandoSQL, {idproduto: idproduto});

            return {
                status: 'success',
                data: result,
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter as categorias.'
            }
        }

    }

    // Salva os dados da categoria
    const salvarOpcionaisProduto = async (req) => {

        try {

            // valida se é pra adicionar ou atualizar uma categoria

            var idopcional = req.body.idopcional;

            if (idopcional > 0) {

                // atualizar opcional

                var ComandoSQL = await readCommandSql.retornaStringSql('atualizarCategoria', 'categoria');
                var result = await db.Query(ComandoSQL, req.body);

                console.log(result);

                return {
                    status: "success",
                    message: "Categoria atualizada com sucesso!"
                }

            }
            else {

                // adicionar categoria

                var ComandoSQL = await readCommandSql.retornaStringSql('adicionarCategoria', 'categoria');
                var result = await db.Query(ComandoSQL, req.body);

                console.log(result);

                return {
                    status: "success",
                    message: "Categoria adicionada com sucesso!"
                }

            }

        } catch (ex) {
            return {
                status: "error",
                message: "Falha ao salvar categoria. Tente novamente.",
                ex: ex
            }
        }

    }

    return Object.create({
        salvarOpcionaisProduto
        , obterOpcionaisProduto
    })

}

module.exports = Object.assign({ controllers })