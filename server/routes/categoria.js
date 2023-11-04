const ct = require('../controllers/categoria')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    // obtem as categorias em ordem para listar no cardapio
    server.get('/categoria', async (req, res) => {
        const result = await ct.controllers().listarTodas(req);
        res.send(result);
    });

}