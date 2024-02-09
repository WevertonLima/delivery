const ct = require('../controllers/taxaentrega')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    // obtem os tipos de taxas de entrega
    server.get('/taxaentregatipo', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().obterTaxaEntregaTipo(req);
        res.send(result);
    });

}