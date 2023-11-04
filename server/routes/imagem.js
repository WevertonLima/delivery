const ct = require('../controllers/imagem')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    // Faz o upload da imagem na pasta
    server.post('/image/upload', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().upload(req);
        res.send(result);
    });

    // Remove a imagem da pasta
    server.post('/image/remove', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().remove(req);
        res.send(result);
    });

    // Faz o upload do Logotipo na pasta
    server.post('/image/logo/upload', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().uploadLogo(req);
        res.send(result);
    });

    // Remove o Logotipo da pasta
    server.post('/image/logo/remove', Acesso.verificaTokenAcesso, async (req, res) => {
        const result = await ct.controllers().removeLogo(req);
        res.send(result);
    });

}