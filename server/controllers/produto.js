const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql.js');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    // obtem a lista de produtos para exibir no cardápio
    const listaCardapio = async (req) => {

        try {

            var ComandoSQL = await readCommandSql.retornaStringSql('listaCardapio', 'produto');
            var result = await db.Query(ComandoSQL);

            return {
                status: 'success',
                data: result,
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter os produtos.'
            }
        }

    }

    // obtem os dados do produto por ID
    const obterPorId = async (req) => {

        try {

            const id = req.params.id;

            var ComandoSQL = await readCommandSql.retornaStringSql('obterPorId', 'produto');
            var result = await db.Query(ComandoSQL, { idproduto: id });

            return {
                status: 'success',
                data: result,
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter dados do produto.'
            }
        }

    }

    // obtem os produtos pela categoria ID
    const obterPorCategoriaId = async (req) => {

        try {

            const id = req.params.id;

            var ComandoSQL = await readCommandSql.retornaStringSql('obterPorCategoriaId', 'produto');
            var result = await db.Query(ComandoSQL, { idcategoria: id });

            return {
                status: 'success',
                data: result,
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter os produtos.'
            }
        }

    }

    // Salva os dados do produto
    const salvarDados = async (req) => {

        try {

            // valida se é pra adicionar ou atualizar um produto

            var idproduto = req.body.idproduto;

            if (idproduto > 0) {

                // atualizar produto

                var ComandoSQL = await readCommandSql.retornaStringSql('atualizarProduto', 'produto');
                var result = await db.Query(ComandoSQL, req.body);

                console.log(result);

                return {
                    status: "success",
                    message: "Produto atualizado com sucesso!"
                }

            }
            else {

                // adicionar produto

                var ComandoSQL = await readCommandSql.retornaStringSql('adicionarProduto', 'produto');
                var result = await db.Query(ComandoSQL, req.body);

                console.log(result);

                return {
                    status: "success",
                    message: "Produto adicionado com sucesso!"
                }

            }

        } catch (ex) {
            return {
                status: "error",
                message: "Falha ao salvar produto. Tente novamente.",
                ex: ex
            }
        }

    }

    // Ordena os produtos
    const ordenarProdutos = async (req) => {

        try {

            var lista = req.body;

            const promises = await lista.map(async elem => {
                new Promise(async (resolve, reject) => {

                    var ComandoSQL = await readCommandSql.retornaStringSql('atualizarOrdemProduto', 'produto');
                    await db.Query(ComandoSQL, elem);

                    resolve(elem);

                });
            })

            await Promise.all(promises);

            return {
                status: 'success',
                message: 'Produtos ordenados com sucesso.'
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao ordenar os produtos.'
            }
        }

    }

    // Duplica o produto
    const duplicarProduto = async (req) => {

        try {

            var idproduto = req.body.idproduto;

            // obtem as informações do produto

            var ComandoSQLProduto = await readCommandSql.retornaStringSql('obterPorId', 'produto');
            var dados_produto = await db.Query(ComandoSQLProduto, { idproduto: idproduto });

            // altera o nome para "Cópia" e insere no banco de dados

            dados_produto[0].nome = dados_produto[0].nome + " - Cópia";

            var ComandoSQLAddProduto = await readCommandSql.retornaStringSql('adicionarProduto', 'produto');
            await db.Query(ComandoSQLAddProduto, dados_produto[0]);

            return {
                status: 'success',
                message: 'Produto duplicado com sucesso.'
            }


        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao duplicar o produto.'
            }
        }

    }

    // Remover o produto
    const removerProduto = async (req) => {

        try {

            var idproduto = req.body.idproduto;

            // remove o produto

            var ComandoSQL = await readCommandSql.retornaStringSql('removerPorProdutoId', 'produto');
            await db.Query(ComandoSQL, { idproduto: idproduto });

            return {
                status: 'success',
                message: 'Produto removido.'
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao remover o produto.'
            }
        }

    }

    return Object.create({
        listaCardapio
        , obterPorId
        , obterPorCategoriaId
        , salvarDados
        , ordenarProdutos
        , duplicarProduto
        , removerProduto
    })

}

module.exports = Object.assign({ controllers })