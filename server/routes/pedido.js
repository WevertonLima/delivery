const ct = require("../controllers/pedido");
const UsuarioTokenAcesso = require("../common/protecaoAcesso");
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {
  // obtem as categorias em ordem para listar no cardapio
  server.get("/pedido/status/:idpedidostatus", async (req, res) => {
    console.log("Opa");
    const result = await ct.controllers().listarTodas(req);
    res.send(result);
  });

    // calcula a taxa do delivery
    server.post('/pedido/taxa', async (req, res) => {
        const result = await ct.controllers().calcularTaxaDelivery(req);
        res.send(result);
    });

  // cria um novo pedido
  server.post("/pedido", async (req, res) => {
    const result = await ct.controllers().salvarPedido(req);
    res.send(result);
  });

  // obtem o pedido por id
  server.get("/pedido/:idpedido", async (req, res) => {
    const result = await ct.controllers().obterPedidoPorId(req);
    res.send(result);
  });

  // move o pedido por status
  server.post("/pedido/moverstatus", async (req, res) => {
    const result = await ct.controllers().moverStatus(req);
    res.send(result);
  });
};
