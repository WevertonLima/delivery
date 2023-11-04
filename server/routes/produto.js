const ct = require('../controllers/produto')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    // obtem a lista de produtos para exibir no cardápio
    server.get('/produto', async (req, res) => {
        const result = await ct.controllers().listaCardapio(req);
        res.send(result);
    });

    // obtem a lista de produtos para exibir no cardápio
    server.get('/produto/:id', async (req, res) => {
        const result = await ct.controllers().obterPorId(req);
        res.send(result);
    });

}