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
        return {
            status: 'success',
            data: {},
        }

    }

    return Object.create({
        salvarOpcionaisProduto
        , obterOpcionaisProduto
    })

}

module.exports = Object.assign({ controllers })