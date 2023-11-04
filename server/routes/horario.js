const ct = require('../controllers/horario')
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

module.exports = (server) => {

    // obtem os horários de funcionamento da empresa
    server.get('/empresa/horario', async (req, res) => {
        const result = await ct.controllers().obterHorarios(req);
        res.send(result);
    });

}