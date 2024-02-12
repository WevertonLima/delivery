const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql.js');
const readCommandSql = new ReadCommandSql();
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

const controllers = () => {

    // Obtem as taxas de entrega
    const obterTaxaEntregaTipo = async (req) => {

        try {

            var ComandoSQL = await readCommandSql.retornaStringSql('obterTaxaEntregaTipo', 'taxaentrega');
            var result = await db.Query(ComandoSQL);

            return {
                status: 'success',
                data: result,
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter os tipos de entrega.'
            }
        }

    }

    return Object.create({
        obterTaxaEntregaTipo
    })

}

module.exports = Object.assign({ controllers })