const ct = require('../controllers/formapagamento')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    // obtem as formas de pagamento ativas
    server.get('/formapagamento', async (req, res) => {
        const result = await ct.controllers().obterFormasPagamentoAtivas(req);
        res.send(result);
    });

}