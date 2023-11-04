const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql.js');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    // obtem a lista de produtos para exibir no cardápio
    const listaCardapio = async (req) => {

        try {

            var ComandoSQL = await readCommandSql.retornaStringSql('listaCardapio', 'produto');
            var result = await db.Query(ComandoSQL);

            return {
                status: 'success',
                data: result,
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter os produtos.'
            }
        }

    }

    // obtem os dados do produto por ID
    const obterPorId = async (req) => {

        try {

            const id = req.params.id;

            var ComandoSQL = await readCommandSql.retornaStringSql('obterPorId', 'produto');
            var result = await db.Query(ComandoSQL, { idproduto: id });

            return {
                status: 'success',
                data: result,
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter dados do produto.'
            }
        }

    }

    return Object.create({
        listaCardapio
        , obterPorId
    })

}

module.exports = Object.assign({ controllers })