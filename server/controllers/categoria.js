const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql.js');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    // Faz o upload da imagem na pasta
    const listarTodas = async (req) => {

        try {

            var ComandoSQL = await readCommandSql.retornaStringSql('listarTodas', 'categoria');
            var result = await db.Query(ComandoSQL);

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

    return Object.create({
        listarTodas
    })

}

module.exports = Object.assign({ controllers })