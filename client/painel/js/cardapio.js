$(document).ready(function () {
    cardapio.event.init();
})

var cardapio = {};

var CATEGORIAS = [];
var PRODUTOS = [];

var CATEGORIA_ID = 0;
var PRODUTO_ID = 0;


cardapio.event = {

    init: () => {

        $("#categoriasMenu").sortable({
            scroll: false, // para não scrollar a tela
            update: function (event, ui) {
                // função para atualizar a ordem da lista
                cardapio.method.atualizarOrdemCategorias();
            },
            handle: ".drag-icon" // define a classe que pode receber o "drag and drop"
        });

        $('.money').mask('#.##0,00', {reverse: true});

        cardapio.method.carregarListaIcones();
        cardapio.method.obterCategorias();

    }

}

cardapio.method = {

    // obtem a lista de categorias
    obterCategorias: () => {

        app.method.loading(true);
        document.getElementById("categoriasMenu").innerHTML = '';

        CATEGORIAS = [];

        app.method.get('/categoria',
            (response) => {
                console.log('response', response);
                app.method.loading(false);

                if (response.status == "error") {
                    console.log(response.message)
                    return;
                }

                // passa a lista das categorias para a variavel global
                CATEGORIAS = response.data;

                cardapio.method.carregarCategorias(response.data)
            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        );
    },

    // carrega as categorias na tela
    carregarCategorias: (lista) => {

        if (lista.length > 0) {

            // percorre as categorias e adiciona na tela
            lista.forEach((e, i) => {

                let icone = ICONES.filter((elem) => { return elem.name === e.icone });

                console.log('icone', icone)

                let temp = cardapio.template.categoria.replace(/\${id}/g, e.idcategoria)
                    .replace(/\${titulo}/g, e.nome)
                    .replace(/\${icone}/g, icone[0].icon)

                // adiciona a categoria na tela
                document.querySelector("#categoriasMenu").innerHTML += temp;

                // último item, inicia o evento de tooltip
                if ((i + 1) == lista.length) {

                    $('[data-toggle="tooltip"]').tooltip();

                }

            })

        }
        else {
            // nenhuma categoria encontrada, adiciona uma linha em branco
        }

    },

    // método que atualiza a ordem das categorias
    atualizarOrdemCategorias: () => {

        let categorias = []

        let listacategorias = $("#categoriasMenu > .card");

        $.each(listacategorias, (i, e) => {

            let idcategoria = $(e).attr('data-idcategoria');           

            categorias.push({
                idcategoria: idcategoria,
                ordem: i + 1
            })

            // último item, manda as informações para a API
            if ((i + 1) == listacategorias.length) {

                app.method.loading(true);

                app.method.post('/categoria/ordenar', JSON.stringify(categorias),
                    (response) => {
                        console.log(response)

                        app.method.loading(false);

                        if (response.status === 'error') {
                            app.method.mensagem(response.message);
                            return;
                        }

                        app.method.mensagem(response.message, 'green');                       

                    },
                    (error) => {
                        app.method.loading(false);
                        console.log('error', error)
                    }
                )

            }

        })

    },

    // carrega a lista dos icones da categoria (modal form)
    carregarListaIcones: () => {

        $.each(ICONES, (i, e) => {
            $("#ddlIconeCategoria").append(`<option value="${e.name}">${e.unicode}</option>`);
        })

    },

    // obtem os produtos quando clica para expardir a categoria
    obterProdutosCategoria: (idcategoria, forcar = false) => {

        // valida se já existe conteudo dentro do elemento
        let conteudo = document.getElementById("listaProdutos-" + idcategoria).children.length;

        if (conteudo <= 0 || forcar) {

            document.getElementById("listaProdutos-" + idcategoria).innerHTML = '';

            // caso não exista conteúdo, obtem os produtos da categoria

            PRODUTOS[idcategoria] = [];

            app.method.loading(true);

            app.method.get('/produto/categoria/' + idcategoria,
                (response) => {
                    console.log('response', response);
                    app.method.loading(false);

                    if (response.status == "error") {
                        console.log(response.message)
                        return;
                    }

                    PRODUTOS[idcategoria] = response.data;

                    cardapio.method.carregarProdutos(response.data, idcategoria)
                },
                (error) => {
                    app.method.loading(false);
                    console.log('error', error)
                }
            );

        }

    },

    // carrega os produtos dentro da categoria
    carregarProdutos: (lista, idcategoria) => {

        if (lista.length > 0) {

            // percorre as categorias e adiciona na tela
            lista.forEach((e, i) => {

                let _imagem = e.imagem;

                if (e.imagem == null) {
                    _imagem = 'default.jpg';
                }

                let temp = cardapio.template.produto.replace(/\${id}/g, e.idproduto)
                    .replace(/\${imagem}/g, _imagem)
                    .replace(/\${nome}/g, e.nome)
                    .replace(/\${descricao}/g, e.descricao)
                    .replace(/\${preco}/g, e.valor.toFixed(2).replace('.', ','))
                    .replace(/\${idcategoria}/g, idcategoria)

                document.querySelector("#listaProdutos-" + idcategoria).innerHTML += temp;


                // último item, inicia o evento de drag
                if ((i + 1) == lista.length) {

                    // incia o tooltip
                    $('[data-toggle="tooltip"]').tooltip();

                    $("#listaProdutos-" + idcategoria).sortable({
                        scroll: false, // para não scrollar a tela
                        update: function (event, ui) {
                            // função para atualizar a ordem da lista
                            cardapio.method.atualizarOrdemProdutos(idcategoria);
                        },
                        handle: ".drag-icon-produto" // define a classe que pode receber o "drag and drop"
                    });

                }

            })

        }
        else {
            // nenhuma categoria encontrada, adiciona uma linha em branco
        }


    },

    // método para abrir a modal de adicionar nova categoria
    abrirModalAdicionarCategoria: () => {

        CATEGORIA_ID = 0;

        // limpa os campos
        $("#ddlIconeCategoria").val('-1');
        $("#txtNomeCategoria").val('');

        // abre a modal
        $('#modalCategoria').modal({ backdrop: 'static' });
        $('#modalCategoria').modal('show');       

    },

    // abre a modal de confirmação para duplicar
    abrirModalDuplicarCategoria: (idcategoria) => {

        // seta a categoria selecionada
        CATEGORIA_ID = idcategoria;

        // abre a modal
        $('#modalDuplicarCategoria').modal('show');

    },

    // abre a modal de confirmação para duplicar
    abrirModalRemoverCategoria: (idcategoria) => {

        // seta a categoria selecionada
        CATEGORIA_ID = idcategoria;

        // abre a modal
        $('#modalRemoverCategoria').modal('show');

    },

    // método para abrir a modal de editar a categoria
    editarCategoria: (idcategoria) => {

        // seta a categoria selecionada, pra depois atualizar ela
        CATEGORIA_ID = idcategoria;

        let categoria = CATEGORIAS.filter((e) => { return e.idcategoria == idcategoria});

        // se existir a categoria, abre a modal
        if (categoria.length > 0) {

            // altera os campos da modal
            $("#ddlIconeCategoria").val(categoria[0].icone);
            $("#txtNomeCategoria").val(categoria[0].nome);

            // abre a modal
            $('#modalCategoria').modal({ backdrop: 'static' });
            $('#modalCategoria').modal('show');       

        }

    },

    // método para confirmar o cadastro / edição da categoria
    salvarCategoria: () => {

        // valida os campos

        let icone = $("#ddlIconeCategoria").val();
        let nome = $("#txtNomeCategoria").val().trim();

        if (icone == "-1") {
            app.method.mensagem("Selecione o ícone da categoria, por favor.")
            return;
        }

        if (nome.length <= 0) {
            app.method.mensagem("Informe o nome da categoria, por favor.")
            return;
        }

        let dados = {
            idcategoria: CATEGORIA_ID,
            nome: nome,
            icone: icone
        }

        app.method.loading(true);

        app.method.post('/categoria', JSON.stringify(dados),
            (response) => {
                console.log(response)

                app.method.loading(false);

                $('#modalCategoria').modal('hide');

                if (response.status === 'error') {
                    app.method.mensagem(response.message);
                    return;
                }

                app.method.mensagem(response.message, 'green');

                cardapio.method.obterCategorias();
            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        )

    },

    // método para duplicar a categoria
    duplicarCategoria: () => {

        let idcategoria = CATEGORIA_ID;

        var dados = {
            idcategoria: idcategoria
        }

        app.method.loading(true);

        app.method.post('/categoria/duplicar', JSON.stringify(dados),
            (response) => {
                console.log(response)

                app.method.loading(false);

                $('#modalDuplicarCategoria').modal('hide');

                if (response.status === 'error') {
                    app.method.mensagem(response.message);
                    return;
                }

                app.method.mensagem(response.message, 'green');

                cardapio.method.obterCategorias();

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        )

    },

    // método para remover a categoria
    removerCategoria: () => {

        let idcategoria = CATEGORIA_ID;

        var dados = {
            idcategoria: idcategoria
        }

        app.method.loading(true);

        app.method.post('/categoria/remover', JSON.stringify(dados),
            (response) => {
                console.log(response)

                app.method.loading(false);

                $('#modalRemoverCategoria').modal('hide');

                if (response.status === 'error') {
                    app.method.mensagem(response.message);
                    return;
                }

                app.method.mensagem(response.message, 'green');

                cardapio.method.obterCategorias();

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        )

    },

    // PRODUTO --------

    // método que atualiza a ordem dos produtos
    atualizarOrdemProdutos: (idcategoria) => {

        let produtos = []

        let listaprodutos = $("#listaProdutos-" + idcategoria + " > .card");

        console.log('listaprodutos', listaprodutos)

        $.each(listaprodutos, (i, e) => {

            let idproduto = $(e).attr('data-idproduto');

            produtos.push({
                idproduto: idproduto,
                ordem: i + 1
            })

            // último item, manda as informações para a API
            if ((i + 1) == listaprodutos.length) {

                app.method.loading(true);

                app.method.post('/produto/ordenar', JSON.stringify(produtos),
                    (response) => {
                        console.log(response)

                        app.method.loading(false);

                        if (response.status === 'error') {
                            app.method.mensagem(response.message);
                            return;
                        }

                        app.method.mensagem(response.message, 'green');                       

                    },
                    (error) => {
                        app.method.loading(false);
                        console.log('error', error)
                    }
                )

            }

        })

    },
    
    // método para abrir a modal de adicionar novo produto
    abrirModalAdicionarProduto: (idcategoria) => {

        CATEGORIA_ID = idcategoria;
        PRODUTO_ID = 0;

        // limpa os campos
        $("#txtNomeProduto").val('');
        $("#txtPrecoProduto").val('');
        $("#txtDescricaoProduto").val('');

        // abre a modal
        $('#modalProduto').modal({ backdrop: 'static' });
        $('#modalProduto').modal('show');

    },

    // abre a modal de confirmação para duplicar
    abrirModalDuplicarProduto: (idcategoria, idproduto) => {

        // seta o produto selecionado
        CATEGORIA_ID = idcategoria;
        PRODUTO_ID = idproduto;

        // abre a modal
        $('#modalDuplicarProduto').modal('show');

    },

    // abre a modal de confirmação para remover
    abrirModalRemoverProduto: (idcategoria, idproduto) => {

        // seta o produto selecionado
        CATEGORIA_ID = idcategoria;
        PRODUTO_ID = idproduto;

        // abre a modal
        $('#modalRemoverProduto').modal('show');

    },

    // método para abrir a modal de editar o produto
    editarProduto: (idcategoria, idproduto) => {

        // seta o produto selecionado, pra depois atualizar ele
        CATEGORIA_ID = idcategoria;
        PRODUTO_ID = idproduto;

        // obtem o produto da lista global
        let produto = PRODUTOS[idcategoria].filter((e) => { return e.idproduto == idproduto});

        // se existir o produto, abre a modal
        if (produto.length > 0) {

            console.log('produto', produto)

            // altera os campos da modal
            $("#txtNomeProduto").val(produto[0].nome);
            $("#txtPrecoProduto").val((produto[0].valor).toFixed(2).toString().replace('.', ','));
            $("#txtDescricaoProduto").val(produto[0].descricao);

            // abre a modal
            $('#modalProduto').modal({ backdrop: 'static' });
            $('#modalProduto').modal('show');       

        }

    },

    // método para confirmar o cadastro / edição do produto
    salvarProduto: () => {

        // valida os campos

        let nome = $("#txtNomeProduto").val().trim();
        let valor = parseFloat($("#txtPrecoProduto").val().replace(/\./g, '').replace(',', '.'));
        let descricao = $("#txtDescricaoProduto").val().trim();

        if (nome.length <= 0) {
            app.method.mensagem("Informe o nome do produto, por favor.")
            return;
        }

        // valida se o valor é um número (se não está vazio) e se é = 0 ou menor
        if (isNaN(valor) || valor <= 0) {
            app.method.mensagem("Informe o valor do produto, por favor.")
            return;
        }

        let dados = {
            idproduto: PRODUTO_ID,
            nome: nome,
            valor: valor,
            descricao: descricao
        }

        app.method.loading(true);

        app.method.post('/produto', JSON.stringify(dados),
            (response) => {
                console.log(response)

                app.method.loading(false);

                $('#modalProduto').modal('hide');

                if (response.status === 'error') {
                    app.method.mensagem(response.message);
                    return;
                }

                app.method.mensagem(response.message, 'green');

                // força o método de obter os produtos da categoria aberta
                cardapio.method.obterProdutosCategoria(CATEGORIA_ID, true);
            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        )

    },

    // método para duplicar o produto
    duplicarProduto: () => {

        let idproduto = PRODUTO_ID;

        var dados = {
            idproduto: idproduto
        }

        app.method.loading(true);

        app.method.post('/produto/duplicar', JSON.stringify(dados),
            (response) => {
                console.log(response)

                app.method.loading(false);

                $('#modalDuplicarProduto').modal('hide');

                if (response.status === 'error') {
                    app.method.mensagem(response.message);
                    return;
                }

                app.method.mensagem(response.message, 'green');

                // força o método de obter os produtos da categoria aberta
                cardapio.method.obterProdutosCategoria(CATEGORIA_ID, true);

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        )

    },

    // método para remover o produto
    removerProduto: () => {

        let idproduto = PRODUTO_ID;

        var dados = {
            idproduto: idproduto
        }

        app.method.loading(true);

        app.method.post('/produto/remover', JSON.stringify(dados),
            (response) => {
                console.log(response)

                app.method.loading(false);

                $('#modalRemoverProduto').modal('hide');

                if (response.status === 'error') {
                    app.method.mensagem(response.message);
                    return;
                }

                app.method.mensagem(response.message, 'green');

                // força o método de obter os produtos da categoria aberta
                cardapio.method.obterProdutosCategoria(CATEGORIA_ID, true);

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        )

    },
        

}

cardapio.template = {

    categoria: `
        <div class="card mt-3" data-idcategoria="\${id}">
            <div class="card-drag" id="heading-\${id}">
                <div class="drag-icon">
                    <i class="fas fa-ellipsis-v"></i>
                    <i class="fas fa-ellipsis-v"></i>
                </div>
                <div class="infos">
                    <a href="#!" class="name mb-0" data-bs-toggle="collapse" data-bs-target="#collapse-\${id}" aria-expanded="true" aria-controls="collapse-\${id}" onclick="cardapio.method.obterProdutosCategoria('\${id}')">
                        <span class="me-2">\${icone}</span>
                        <b>\${titulo}</b>
                    </a>
                </div>
                <div class="actions">
                    <a href="#!" class="icon-action" data-toggle="tooltip" data-placement="top" title="Editar" onclick="cardapio.method.editarCategoria('\${id}')">
                        <i class="fas fa-pencil-alt"></i>
                    </a>
                    <a href="#!" class="icon-action" data-toggle="tooltip" data-placement="top" title="Duplicar" onclick="cardapio.method.abrirModalDuplicarCategoria('\${id}')">
                        <i class="far fa-copy"></i>
                    </a>
                    <a href="#!" class="icon-action" data-toggle="tooltip" data-placement="top" title="Remover" onclick="cardapio.method.abrirModalRemoverCategoria('\${id}')">
                        <i class="fas fa-trash-alt"></i>
                    </a>
                </div>
            </div>

            <div id="collapse-\${id}" class="collapse" aria-labelledby="heading-\${id}" data-parent="#categoriasMenu">
                <div class="card-body">
                    <p class="title-produtos mb-0"><b>Produtos</b></p>

                    <div class="lista-produtos" id="listaProdutos-\${id}">

                    </div>

                    <div class="card card-select mt-3">
                        <div class="infos-produto-opcional">
                            <p class="mb-0 color-primary" onclick="cardapio.method.abrirModalAdicionarProduto('\${id}')">
                                <i class="fas fa-plus-circle"></i>&nbsp; Adicionar novo produto
                            </p>
                        </div>
                    </div>

                </div>  
            </div>
        </div>
    `,

    produto: `
    <div class="card mt-3 pl-0" data-idproduto="\${id}">
        <div class="d-flex">
            <div class="drag-icon-produto">
                <i class="fas fa-ellipsis-v"></i>
                <i class="fas fa-ellipsis-v"></i>
            </div>
            <div class="container-img-produto" style="background-image: url('/public/images/\${imagem}'); background-size: cover;">
                <a href="#!" class="icon-action me-1 mb-1" data-toggle="tooltip" data-placement="top" title="Editar">
                    <i class="fas fa-pencil-alt"></i>
                </a>
            </div>
            <div class="infos-produto">
                <p class="name"><b>\${nome}</b></p>
                <p class="description">\${descricao}</p>
                <p class="price"><b>R$ \${preco}</b></p>
            </div>
            <div class="actions">
                <a href="#!" class="icon-action" data-toggle="tooltip" data-placement="top" title="Opcionais">
                    <span class="badge-adicionais">2</span>
                    <i class="fas fa-layer-group"></i>
                </a>
                <a href="#!" class="icon-action" data-toggle="tooltip" data-placement="top" title="Editar" onclick="cardapio.method.editarProduto('\${idcategoria}', '\${id}')">
                    <i class="fas fa-pencil-alt"></i>
                </a>
                <a href="#!" class="icon-action" data-toggle="tooltip" data-placement="top" title="Duplicar" onclick="cardapio.method.abrirModalDuplicarProduto('\${idcategoria}', '\${id}')">
                    <i class="far fa-copy"></i>
                </a>
                <a href="#!" class="icon-action" data-toggle="tooltip" data-placement="top" title="Remover" onclick="cardapio.method.abrirModalRemoverProduto('\${idcategoria}', '\${id}')">
                    <i class="fas fa-trash-alt"></i>
                </a>
            </div>
        </div>
    </div>
    `

}