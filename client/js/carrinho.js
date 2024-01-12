document.addEventListener("DOMContentLoaded", function (event) {
    carrinho.event.init();
});

var carrinho = {};

var PRODUTO_SELECIONADO = '';
var CARRINHO_ATUAL = [];
var TAXAS_ENTREGA = [];
var TAXA_ATUAL = 0;

var MODAL_ENDERECO = new bootstrap.Modal(document.getElementById('modalEndereco'));

carrinho.event = {

    init: () => {

        carrinho.method.obterCarrinho();
        carrinho.method.obterTiposEntrega();
        carrinho.method.obterTaxaEntrega();
        carrinho.method.obterEndereco();

    }

}

carrinho.method = {

    // ----------- ITENS DO CARRINHO ------------

    // carrega o carrinho
    obterCarrinho: () => {

        CARRINHO_ATUAL = [];

        let carrinhoLocal = app.method.obterValorSessao('cart');

        if (carrinhoLocal != undefined) {

            let cart = JSON.parse(carrinhoLocal);

            CARRINHO_ATUAL = cart.itens;

            if (cart.itens.length > 0) {

                // exibe o container dos produtos
                document.querySelector("#carrinho-vazio").classList.add('hidden');
                document.querySelector("#carrinho-cheio").classList.remove('hidden');
                document.querySelector("#opcoes-entrega").classList.remove('hidden');
                document.querySelector("#btnFazerPedido").classList.remove('hidden');
                document.querySelector("#btnVoltar").classList.add('hidden');

                carrinho.method.carregarProdutosCarrinho(cart.itens);

            }
            else {
                document.querySelector("#carrinho-vazio").classList.remove('hidden');
                document.querySelector("#carrinho-cheio").classList.add('hidden');
                document.querySelector("#opcoes-entrega").classList.add('hidden');
                document.querySelector("#btnFazerPedido").classList.add('hidden');
                document.querySelector("#btnVoltar").classList.remove('hidden');
            }

        }
        else {
            document.querySelector("#carrinho-vazio").classList.remove('hidden');
            document.querySelector("#carrinho-cheio").classList.add('hidden');
            document.querySelector("#opcoes-entrega").classList.add('hidden');
            document.querySelector("#btnFazerPedido").classList.add('hidden');
            document.querySelector("#btnVoltar").classList.remove('hidden');
        }

    },

    // carrega os produtos na tela
    carregarProdutosCarrinho: (list) => {

        document.querySelector('#listaProdutos').innerHTML = '';

        if (list.length > 0) {

            // preenche os produtos na tela
            list.forEach((e, i) => {

                let itens = '';

                if (e.opcionais.length > 0) {
                    // monta a lista de opcionais
                    for (let index = 0; index < e.opcionais.length; index++) {
                        let element = e.opcionais[index];

                        itens += carrinho.template.opcional.replace(/\${nome}/g, `${e.quantidade}x ${element.nomeopcional}`)
                            .replace(/\${preco}/g, `+ R$ ${(element.valoropcional * e.quantidade).toFixed(2).replace('.', ',')}`)
                    }
                }

                let obs = '';

                // valida se existe observação
                if (e.observacao.length > 0) {
                    obs = carrinho.template.obs.replace(/\${observacao}/g, e.observacao);
                }

                let temp = carrinho.template.produto.replace(/\${guid}/g, e.guid)
                    .replace(/\${nome}/g, `${e.quantidade}x ${e.nome}`)
                    .replace(/\${preco}/g, `R$ ${(e.quantidade * e.valor).toFixed(2).replace('.', ',')}`)
                    .replace(/\${obs}/g, obs)
                    .replace(/\${opcionais}/g, itens)

                // adiciona a categoria ao menu
                document.querySelector("#listaProdutos").innerHTML += temp;

            });

            carrinho.method.atualizarValorTotal();

        }

    },

    // atualiza o valor total do carrinho
    atualizarValorTotal: () => {

        if (CARRINHO_ATUAL.length > 0) {

            // total carrinho
            let total = 0;

            // preenche os produtos na tela
            CARRINHO_ATUAL.forEach((e, i) => {

                let subTotal = 0;

                if (e.opcionais.length > 0) {
                    // monta a lista de opcionais
                    for (let index = 0; index < e.opcionais.length; index++) {
                        let element = e.opcionais[index];

                        subTotal += element.valoropcional * e.quantidade;
                    }
                }

                subTotal += (e.quantidade * e.valor);
                total += subTotal;

            });

            // valida se tem taxa 
            if (TAXA_ATUAL > 0) {
                total += TAXA_ATUAL;

                // exibe o label de taxa
                document.querySelector("#containerTaxaEntrega").classList.remove('hidden');
                document.querySelector("#lblTaxaEntrega").innerText = `+ R$ ${(TAXA_ATUAL).toFixed(2).replace('.', ',')}`;
            }
            else {
                // oculta o label de taxa
                document.querySelector("#containerTaxaEntrega").classList.add('hidden');
                document.querySelector("#lblTaxaEntrega").innerText = '-';
            }

            document.querySelector("#lblTotalCarrinho").innerText = `R$ ${(total).toFixed(2).replace('.', ',')}`;

        }

    },

    // abre a modal para "editar" ou "remover" o produto
    abrirModalOpcoesProduto: (guid) => {

        PRODUTO_SELECIONADO = guid;
        document.querySelector('#modalActionsProduto').classList.remove('hidden');

    },

    // fecha a modal de actions produto
    fecharModalActionsProduto: () => {

        PRODUTO_SELECIONADO = '';
        document.querySelector('#modalActionsProduto').classList.add('hidden');

    },

    // edita o produto do carrinho
    editarProdutoCarrinho: () => {

        if (PRODUTO_SELECIONADO.length > 0) {



        }

    },

    // remove o produto do carrinho
    removerProdutoCarrinho: () => {

        if (PRODUTO_SELECIONADO.length > 0) {

            let carrinhoLocal = app.method.obterValorSessao('cart');

            if (carrinhoLocal != undefined) {

                let cart = JSON.parse(carrinhoLocal);

                if (cart.itens.length > 0) {

                    let outros = cart.itens.filter((e) => { return e.guid != PRODUTO_SELECIONADO; });
                    cart.itens = outros;

                    // salva o novo carrinho
                    app.method.gravarValorSessao(JSON.stringify(cart), 'cart');

                    // carrega o carrinho novamente
                    carrinho.method.obterCarrinho();

                    PRODUTO_SELECIONADO = '';
                    document.querySelector('#modalActionsProduto').classList.add('hidden');

                    app.method.mensagem("Item removido.", "green")

                }

            }

        }

    },


    // ----------- TIPO DE ENTREGA - DELIVERY OU RETIRADA ------------ 

    // obtem os tipos de entrega definidas
    obterTiposEntrega: () => {

        app.method.get('/entrega/tipo',
            (response) => {
                console.log('response', response);

                if (response.status == "error") {
                    console.log(response.message)
                    return;
                }

                let delivery = response.data.filter((e) => { return e.idtipoentrega == 1 });
                let retirada = response.data.filter((e) => { return e.idtipoentrega == 2 });

                // valida se o delivery está ativo
                if (delivery[0].ativo) {

                    let tempo = '';

                    if ((delivery[0].tempominimo != null && delivery[0].tempominimo > 0) &&
                        (delivery[0].tempomaximo != null && delivery[0].tempomaximo > 0)) {
                        tempo = ` (${delivery[0].tempominimo}-${delivery[0].tempomaximo}min)`;
                    }

                    document.querySelector("#lblTipoEntregaTempo").innerText = `Entrega${tempo}`
                    document.querySelector("#containerTipoEntrega").classList.remove('hidden');
                }

                // valida se a retirada está ativa
                if (retirada[0].ativo) {

                    let tempo = '';

                    if ((retirada[0].tempominimo != null && retirada[0].tempominimo > 0) &&
                        (retirada[0].tempomaximo != null && retirada[0].tempomaximo > 0)) {
                        tempo = ` (${retirada[0].tempominimo}-${retirada[0].tempomaximo}min)`;
                    }

                    document.querySelector("#lblTipoRetiradaTempo").innerText = `Retirada${tempo}`
                    document.querySelector("#containerTipoRetirada").classList.remove('hidden');
                }

            },
            (error) => {
                console.log('error', error)
            }, true
        )

    },

    // botão de tipo entrega clicado
    changeTipoEntrega: () => {

        let check = document.querySelector('#chkEntrega').checked;

        if (check) {

            // exibe o container de endereço
            document.querySelector("#containerEnderecoEntrega").classList.remove('hidden');

            // remove o check do outro tipo
            document.querySelector('#chkRetirada').checked = false;

            carrinho.method.validarEnderecoSelecionado();

        }
        else {
            // remove o container de endereço
            document.querySelector("#containerEnderecoEntrega").classList.add('hidden');

            document.querySelector("#containerTaxaEntrega").classList.add('hidden');

            TAXA_ATUAL = 0;
            carrinho.method.atualizarValorTotal();

        }

    },

    // botão de tipo retirada clicado
    changeTipoRetirada: () => {

        let check = document.querySelector('#chkRetirada').checked;

        if (check) {

            // remove o container de endereço
            document.querySelector("#containerEnderecoEntrega").classList.add('hidden');

            // remove o check do outro tipo
            document.querySelector('#chkEntrega').checked = false;

            document.querySelector("#containerTaxaEntrega").classList.add('hidden');

        }

        TAXA_ATUAL = 0;
        carrinho.method.atualizarValorTotal();

    },

    // valida se tem endereço selecionado para exibir a taxa de entrega
    validarEnderecoSelecionado: () => {

        if (TAXAS_ENTREGA.length == 0) {
            document.querySelector("#containerTaxaEntrega").classList.add('hidden');
            return;
        }

        // Taxa Única
        if (TAXAS_ENTREGA[0].idtaxaentregatipo == 1) {
            TAXA_ATUAL = TAXAS_ENTREGA[0].valor;
        }

        // Taxa por Distância
        if (TAXAS_ENTREGA[0].idtaxaentregatipo == 2) {

            // obtem o endereço selecionado do local
            let enderecoAtual = app.method.obterValorSessao('address');

            if (enderecoAtual != undefined) {

                let endereco = JSON.parse(enderecoAtual);

                carrinho.method.carregarEnderecoSelecionado(endereco);

                // obtem a diferença da distnacia entre a loja e o endereço selecionado
                let dados = {
                    endereco: `${endereco.endereco}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}-${endereco.estado}, ${endereco.cep}`
                }

                app.method.loading(true);
        
                app.method.post('/pedido/taxa', JSON.stringify(dados),
                    (response) => {

                        app.method.loading(false);
        
                        console.log('response', response)
        
                        if (response.status == "error") {
                            console.log(response.message)
                            return;
                        }

                        TAXA_ATUAL = response.taxa;
                        carrinho.method.atualizarValorTotal();

                    },
                    (error) => {    
                        app.method.loading(false);
                        console.log('error', error)
                    }, true
                )
                
            }
            else {
                TAXA_ATUAL = 0;
            }

        }

        // Sem taxa
        if (TAXAS_ENTREGA[0].idtaxaentregatipo == 3) {
            TAXA_ATUAL = 0;
        }

        carrinho.method.atualizarValorTotal();

    },

    // carrega o endereço na tela
    carregarEnderecoSelecionado: (endereco) => {



    },

    // ----------- TAXA DE ENTREGA ------------

    // obtem as taxas de entrega definidas
    obterTaxaEntrega: () => {

        app.method.get('/entrega/taxa',
            (response) => {
                console.log('response', response);

                if (response.status == "error") {
                    console.log(response.message)
                    return;
                }

                TAXAS_ENTREGA = response.data;

            },
            (error) => {
                console.log('error', error)
            }, true
        )

    },



    // ----------- ENDEREÇO ------------

    obterEndereco: () => {

        // obtem o endereço selecionado do local
        let enderecoAtual = app.method.obterValorSessao('address');

        if (enderecoAtual != undefined) {

            let endereco = JSON.parse(enderecoAtual);

            document.querySelector("#lblEnderecoSelecionado").innerText = `${endereco.endereco}, ${endereco.numero}, ${endereco.bairro} ${endereco.complemento ? ` - ${endereco.complemento}` : ''}`;
            document.querySelector("#lblCepEnderecoSelecionado").innerText = `${endereco.cidade}-${endereco.estado} / ${endereco.cep}`;

            document.querySelector("#cardAddEndereco").classList.add('hidden');
            document.querySelector("#cardEnderecoSelecionado").classList.remove('hidden');

        }
        else {
            document.querySelector("#cardAddEndereco").classList.remove('hidden');
            document.querySelector("#cardEnderecoSelecionado").classList.add('hidden');
        }

    },

    abrirModalEndereco: () => {

        MODAL_ENDERECO.show();

    },

    salvarEndereco: () => {

        // validação dos campos
        let cep = document.getElementById("txtCEP").value.trim();
        let endereco = document.getElementById("txtEndereco").value.trim();
        let bairro = document.getElementById("txtBairro").value.trim();
        let cidade = document.getElementById("txtCidade").value.trim();
        let uf = document.getElementById("ddlUf").value.trim();
        let numero = document.getElementById("txtNumero").value.trim();
        let complemento = document.getElementById("txtComplemento").value.trim();

        if (cep.length <= 0) {
            app.method.mensagem('Informe o CEP, por favor.');
            document.getElementById("txtCEP").focus();
            return;
        }

        if (endereco.length <= 0) {
            app.method.mensagem('Informe o Endereço, por favor.');
            document.getElementById("txtEndereco").focus();
            return;
        }

        if (bairro.length <= 0) {
            app.method.mensagem('Informe o Bairro, por favor.');
            document.getElementById("txtBairro").focus();
            return;
        }

        if (cidade.length <= 0) {
            app.method.mensagem('Informe a Cidade, por favor.');
            document.getElementById("txtCidade").focus();
            return;
        }

        if (uf == "-1") {
            app.method.mensagem('Informe a UF, por favor.');
            document.getElementById("ddlUf").focus();
            return;
        }

        if (numero.length <= 0) {
            app.method.mensagem('Informe o Número, por favor.');
            document.getElementById("txtNumero").focus();
            return;
        }

        let dados = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            estado: uf,
            numero: numero,
            complemento: complemento
        }

        // salva no local
        app.method.gravarValorSessao(JSON.stringify(dados), 'address');

        carrinho.method.obterEndereco();
        carrinho.method.validarEnderecoSelecionado();
        MODAL_ENDERECO.hide();

    },

    // API ViaCEP
    buscarCep: () => {

        // cria a variavel com o valor do cep
        var cep = document.getElementById("txtCEP").value.trim().replace(/\D/g, '');

        // verifica se o CEP possui valor informado
        if (cep != "") {

            // Expressão regular para validar o CEP
            var validacep = /^[0-9]{8}$/;

            if (validacep.test(cep)) {

                //Cria um elemento javascript.
                var script = document.createElement('script');

                //Sincroniza com o callback.
                script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=carrinho.method.callbackCep';

                //Insere script no documento e carrega o conteúdo.
                document.body.appendChild(script);

            }
            else {
                app.method.mensagem('Formato do CEP inválido.');
                document.getElementById("txtCEP").focus();
            }

        }
        else {
            app.method.mensagem('Informe o CEP, por favor.');
            document.getElementById("txtCEP").focus();
        }

    },

    // método chamado quando retorna algo da API de CEP
    callbackCep: (dados) => {

        if (!("erro" in dados)) {

            // Atualizar os campos com os valores retornados
            document.getElementById("txtEndereco").value = dados.logradouro;
            document.getElementById("txtBairro").value = dados.bairro;
            document.getElementById("txtCidade").value = dados.localidade;
            document.getElementById("ddlUf").value = dados.uf;
            document.getElementById("txtNumero").focus();

        }
        else {
            app.method.mensagem('CEP não encontrado. Preencha as informações manualmente.');
            document.getElementById("#txtEndereco").focus();
        }

    },

    // abre a modal para "editar" ou "remover" o endereco
    abrirModalOpcoesEndereco: (guid) => {

        document.querySelector('#modalActionsEndereco').classList.remove('hidden');

    },

    // fecha a modal de actions endereco
    fecharModalActionsEndereco: () => {

        document.querySelector('#modalActionsEndereco').classList.add('hidden');

    },

    // edita o endereco do carrinho
    editarEnderecoCarrinho: () => {

        // obtem o endereço selecionado do local
        let enderecoAtual = app.method.obterValorSessao('address');

        if (enderecoAtual != undefined) {

            let endereco = JSON.parse(enderecoAtual);

            document.getElementById("txtCEP").value = endereco.cep;
            document.getElementById("txtEndereco").value = endereco.endereco;
            document.getElementById("txtBairro").value = endereco.bairro;
            document.getElementById("txtNumero").value = endereco.numero;
            document.getElementById("txtCidade").value = endereco.cidade;
            document.getElementById("txtComplemento").value = endereco.complemento;
            document.getElementById("ddlUf").value = endereco.estado;

            document.querySelector('#modalActionsEndereco').classList.add('hidden');
            MODAL_ENDERECO.show();

        }

    },

    // remove o endereco do carrinho
    removerEnderecoCarrinho: () => {

        localStorage.removeItem("address");

        carrinho.method.obterEndereco();
        carrinho.method.validarEnderecoSelecionado();

        document.querySelector('#modalActionsEndereco').classList.add('hidden');

    },

}

carrinho.template = {

    produto: `
        <div class="card mb-2 pr-0">
            <div class="container-detalhes">
                <div class="detalhes-produto">
                    <div class="infos-produto">
                        <p class="name"><b>\${nome}</b></p>
                        <p class="price"><b>\${preco}</b></p>
                    </div>
                    \${opcionais}
                    \${obs}
                </div>
                <div class="detalhes-produto-edit" onclick="carrinho.method.abrirModalOpcoesProduto('\${guid}')">
                    <i class="fas fa-pencil-alt"></i>
                </div>
            </div>
        </div>
    `,

    opcional: `
        <div class="infos-produto">
            <p class="name-opcional mb-0">\${nome}</p>
            <p class="price-opcional mb-0">\${preco}</p>
        </div>
    `,

    obs: `
        <div class="infos-produto">
            <p class="obs-opcional mb-0">- \${observacao}</p>
        </div>
    `,

}