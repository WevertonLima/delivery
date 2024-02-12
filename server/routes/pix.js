const ct = require("../controllers/pix");

module.exports = (server) => {
  // obtem a lista de produtos para exibir no cardápio
  server.get("/pix", async (req, res) => {
    const result = await ct.controllers().gerarQRCode(req);
    res.send(result);
  });
};
