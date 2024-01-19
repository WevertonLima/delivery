const ct = require('../controllers/pedido')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    // obtem a lista de produtos para exibir no cardápio
    server.post('/pedido/taxa', async (req, res) => {
        const result = await ct.controllers().calcularTaxaDelivery(req);
        res.send(result);
    });

    // cria um novo pedido
    server.post('/pedido', async (req, res) => {
        const result = await ct.controllers().salvarPedido(req);
        res.send(result);
    });

    // obtem o pedido por id
    server.get('/pedido/:idpedido', async (req, res) => {
        const result = await ct.controllers().obterPedidoPorId(req);
        res.send(result);
    });

}