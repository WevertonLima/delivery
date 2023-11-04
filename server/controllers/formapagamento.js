const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql.js');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    // obtem as formas de pagamento ativas
    const obterFormasPagamentoAtivas = async (req) => {

        try {

            var ComandoSQL = await readCommandSql.retornaStringSql('obterFormasPagamentoAtivas', 'formapagamento');
            var result = await db.Query(ComandoSQL);

            return {
                status: 'success',
                data: result,
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter as formas de pagamento.'
            }
        }

    }

    return Object.create({
        obterFormasPagamentoAtivas
    })

}

module.exports = Object.assign({ controllers })