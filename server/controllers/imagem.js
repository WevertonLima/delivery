const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql.js');
const readCommandSql = new ReadCommandSql();
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();

const mv = require('mv');
const fs = require('fs');

const controllers = () => {

    // Faz o upload da imagem do Produto na pasta
    const upload = async (req) => {

        try {

            const imagem = req.files.image;

            let name = imagem.name.split('.');

            const extension = name[name.length - 1];

            const new_path = `server/public/images/${name[0]}.${extension}`

            mv(imagem.path, new_path, {
                mkdirp: true // se não exisir, cria o diretorio
            }, (err, result) => {

                if (err) {
                    console.log('err', err)
                    return false
                }

                console.log('result', result)

            })

            return {
                status: 'success',
                message: 'Imagem atualizada com sucesso!',
            }

        } catch (ex) {
            console.log(ex)
            return {
                status: 'error',
                message: 'Falha ao salvar imagem.',
            }
        }

    }

    // Remove a imagem do Produto da pasta
    const remove = async (req) => {

        try {

            const imagem = req.body.imagem

            var filePath = `server/public/images/${imagem}`; 
            fs.unlinkSync(filePath);

            return {
                status: 'success',
                message: 'Imagem removida com sucesso!',
            }

        } catch (ex) {
            return {
                status: 'error',
                message: 'Falha ao remover imagem.',
            }
        }

    }

    // Faz o upload do Logotipo na pasta
    const uploadLogo = async (req) => {

        try {

            // obtem a empresa logada
            let _empresaId = Acesso.retornaCodigoTokenAcesso('IdEmpresa', req.headers['authorization']);

            const imagem = req.files.image;

            let name = imagem.name.split('.');

            const extension = name[name.length - 1];

            const new_path = `server/public/images/empresa/${name[0]}.${extension}`

            mv(imagem.path, new_path, {
                mkdirp: true // se não exisir, cria o diretorio
            }, (err, result) => {

                if (err) {
                    console.log('err', err)
                    return false
                }

                console.log('result', result)

            })

            var ComandoSQL = await readCommandSql.retornaStringSql('adicionarImagem', 'empresa');
            await db.Query(ComandoSQL, { idempresa: _empresaId, logotipo: `${name[0]}.${extension}` });

            return {
                status: 'success',
                message: 'Imagem atualizada com sucesso!',
                logotipo: `${name[0]}.${extension}`
            }

        } catch (ex) {
            console.log(ex)
            return {
                status: 'error',
                message: 'Falha ao salvar imagem.',
            }
        }

    }

    // Remove o Logotipo da pasta
    const removeLogo = async (req) => {

        try {

            // obtem a empresa logada
            let _empresaId = Acesso.retornaCodigoTokenAcesso('IdEmpresa', req.headers['authorization']);

            const imagem = req.body.imagem

            var filePath = `server/public/images/empresa/${imagem}`; 
            fs.unlinkSync(filePath);

            var ComandoSQL = await readCommandSql.retornaStringSql('removerImagem', 'empresa');
            await db.Query(ComandoSQL, { idempresa: _empresaId });

            return {
                status: 'success',
                message: 'Imagem removida com sucesso!',
            }

        } catch (ex) {
            console.log('ex', ex)
            return {
                status: 'error',
                message: 'Falha ao remover imagem.',
            }
        }

    }

    return Object.create({
        upload,
        remove,
        uploadLogo,
        removeLogo
    })

}

module.exports = Object.assign({ controllers })