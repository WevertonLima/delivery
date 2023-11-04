const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql.js');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    // obtem os horários de funcionamento da empresa
    const obterHorarios = async (req) => {

        try {

            var ComandoSQL = await readCommandSql.retornaStringSql('obterHorarios', 'horario');
            var result = await db.Query(ComandoSQL);

            return {
                status: 'success',
                data: result,
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter os horários da empresa.'
            }
        }

    }

    return Object.create({
        obterHorarios
    })

}

module.exports = Object.assign({ controllers })