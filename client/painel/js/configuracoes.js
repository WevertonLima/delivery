document.addEventListener("DOMContentLoaded", function (event) {
    config.event.init();
});

var config = {};

config.event = {

    init: () => {

        app.method.validaToken();
        app.method.carregarDadosEmpresa();

        // inicia a primeira Tab
        config.method.openTab('delivery-retirada');

    }

}

config.method = {

    // método para carregar as tabs
    openTab: (tab) => {

        Array.from(document.querySelectorAll(".tab-content")).forEach(e => e.classList.remove('active'));
        Array.from(document.querySelectorAll(".tab-item")).forEach(e => e.classList.add('hidden'));

        document.querySelector("#tab-" + tab).classList.add('active');
        document.querySelector("#" + tab).classList.remove('hidden');

        switch (tab) {
            case 'delivery-retirada':
                config.method.obterConfigTipoEntrega();
                break;

            case 'taxa-entrega':
                config.method.obterConfigTaxaEntrega();
                break;

            case 'forma-pagamento':
                config.method.obterConfigFormaPagamento();
                break;

            default:
                break;
        }

    },

    // -------- TAB DELIVERY E RETIRADA -----------

    // obtem os dados da empresa
    obterConfigTipoEntrega: () => {

        app.method.loading(true);

        app.method.get('/entrega/tipo',
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    console.log(response.message)
                    return;
                }

                console.log(response.data)

                let delivery = response.data.filter((e) => { return e.idtipoentrega == 1 });
                let retirada = response.data.filter((e) => { return e.idtipoentrega == 2 });

                // valida as configs do delivery
                config.method.changeOpcaoDelivery(delivery[0].ativo);
                document.querySelector("#txtTempoMinimoDelivery").value = delivery[0].tempominimo != null ? delivery[0].tempominimo : 0;
                document.querySelector("#txtTempoMaximoDelivery").value = delivery[0].tempomaximo != null ? delivery[0].tempomaximo : 0;

                // valida as configs da Retirada
                config.method.changeOpcaoRetirada(retirada[0].ativo);
                document.querySelector("#txtTempoMinimoRetirada").value = retirada[0].tempominimo != null ? retirada[0].tempominimo : 0;
                document.querySelector("#txtTempoMaximoRetirada").value = retirada[0].tempomaximo != null ? retirada[0].tempomaximo : 0;

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        )

    },

    // clique na opção de retirada
    changeOpcaoRetirada: (isCheck) => {

        let check = document.querySelector("#chkOpcaoRetirada").checked;

        if (isCheck != undefined) {
            check = isCheck;
        }

        if (check) {
            document.querySelector("#chkOpcaoRetirada").checked = true;
            document.querySelector("#lblSwitchRetirada").innerText = 'Ligado';
            document.querySelector("#containerTempoRetirada").classList.remove('disabled');
            document.querySelector("#txtTempoMinimoRetirada").disabled = false;
            document.querySelector("#txtTempoMaximoRetirada").disabled = false;
            document.querySelector("#btnSalvarOpcaoRetirada").classList.remove('disabled');

            // valida se é o click no botão
            if (isCheck == undefined) {
                config.method.salvarOpcaoRetiradaCheck(true);
            }
        }
        else {
            document.querySelector("#chkOpcaoRetirada").checked = false;
            document.querySelector("#lblSwitchRetirada").innerText = 'Desligado';
            document.querySelector("#containerTempoRetirada").classList.add('disabled');
            document.querySelector("#txtTempoMinimoRetirada").disabled = true;
            document.querySelector("#txtTempoMaximoRetirada").disabled = true;
            document.querySelector("#btnSalvarOpcaoRetirada").classList.add('disabled');

            // valida se é o click no botão
            if (isCheck == undefined) {
                config.method.salvarOpcaoRetiradaCheck(false);
            }
        }

    },

    // clique na opção de delivery
    changeOpcaoDelivery: (isCheck) => {

        let check = document.querySelector("#chkOpcaoDelivery").checked;

        if (isCheck != undefined) {
            check = isCheck;
        }

        if (check) {
            document.querySelector("#chkOpcaoDelivery").checked = true;
            document.querySelector("#lblSwitchDelivery").innerText = 'Ligado';
            document.querySelector("#containerTempoDelivery").classList.remove('disabled');
            document.querySelector("#txtTempoMinimoDelivery").disabled = false;
            document.querySelector("#txtTempoMaximoDelivery").disabled = false;
            document.querySelector("#btnSalvarOpcaoDelivery").classList.remove('disabled');

            // valida se é o click no botão
            if (isCheck == undefined) {
                config.method.salvarOpcaoDeliveryCheck(true);
            }

        }
        else {
            document.querySelector("#chkOpcaoDelivery").checked = false;
            document.querySelector("#lblSwitchDelivery").innerText = 'Desligado';
            document.querySelector("#containerTempoDelivery").classList.add('disabled');
            document.querySelector("#txtTempoMinimoDelivery").disabled = true;
            document.querySelector("#txtTempoMaximoDelivery").disabled = true;
            document.querySelector("#btnSalvarOpcaoDelivery").classList.add('disabled');

            // valida se é o click no botão
            if (isCheck == undefined) {
                config.method.salvarOpcaoDeliveryCheck(false);
            }
        }

    },

    // salva as configurações de Retirada
    salvarOpcaoRetirada: () => {

        let minimo = parseInt(document.querySelector("#txtTempoMinimoRetirada").value);
        let maximo = parseInt(document.querySelector("#txtTempoMaximoRetirada").value);

        if (isNaN(minimo) || minimo < 0) {
            app.method.mensagem("Tempo mínimo da retirada incorreto.");
            return;
        }

        if (isNaN(maximo) || maximo < 0) {
            app.method.mensagem("Tempo máximo da retirada incorreto.");
            return;
        }

        let dados = {
            tipo: 2,
            minimo: minimo,
            maximo: maximo
        }

        app.method.loading(true);

        app.method.post('/entrega/tipo', JSON.stringify(dados),
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

    },

    // salva as configurações do Delivery
    salvarOpcaoDelivery: () => {

        let minimo = parseInt(document.querySelector("#txtTempoMinimoDelivery").value);
        let maximo = parseInt(document.querySelector("#txtTempoMaximoDelivery").value);

        if (isNaN(minimo) || minimo < 0) {
            app.method.mensagem("Tempo mínimo do delivery incorreto.");
            return;
        }

        if (isNaN(maximo) || maximo < 0) {
            app.method.mensagem("Tempo máximo do delivery incorreto.");
            return;
        }

        let dados = {
            tipo: 1,
            minimo: minimo,
            maximo: maximo
        }

        app.method.loading(true);

        app.method.post('/entrega/tipo', JSON.stringify(dados),
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

    },

    // salva a opção de ativar ou desativar
    salvarOpcaoRetiradaCheck: (ativar) => {

        app.method.loading(true);

        var dados = {
            tipo: 2,
            ativar: ativar ? 1 : 0
        }

        app.method.post('/entrega/tipo/ativar', JSON.stringify(dados),
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

    },

    // salva a opção de ativar ou desativar
    salvarOpcaoDeliveryCheck: (ativar) => {

        app.method.loading(true);

        var dados = {
            tipo: 1,
            ativar: ativar ? 1 : 0
        }

        app.method.post('/entrega/tipo/ativar', JSON.stringify(dados),
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

    },


    // -------- TAB FORMAS DE PAGAMENTO -----------

    obterConfigTaxaEntrega: () => {

        app.method.loading(true);

        app.method.get('/taxaentregatipo',
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    console.log(response.message)
                    return;
                }

                console.log(response.data)

                let taxaunica = response.data.filter((e) => { return e.idtaxaentregatipo == 1 });
                let taxadistancia = response.data.filter((e) => { return e.idtaxaentregatipo == 2 });
                let semtaxa = response.data.filter((e) => { return e.idtaxaentregatipo == 3 });

                document.querySelector("#chkSemTaxa").checked = semtaxa[0].ativo ? true : false;
                document.querySelector("#chkTaxaUnica").checked = taxaunica[0].ativo ? true : false;
                document.querySelector("#chkTaxaDistancia").checked = taxadistancia[0].ativo ? true : false;

                if (semtaxa[0].ativo) {
                    document.querySelector("#container-sem-taxa").classList.remove('hidden');
                }
                else if (taxaunica[0].ativo) {
                    document.querySelector("#container-taxa-unica").classList.remove('hidden');
                }
                else {
                    document.querySelector("#container-taxa-distancia").classList.remove('hidden');
                }

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        )

    },

    // abre a tab da taxa selecionada
    openTabTaxa: (tab, pai) => {

        Array.from(document.querySelectorAll(".tab-item-taxa")).forEach(e => e.classList.add('hidden'));
        document.querySelector("#" + tab).classList.remove('hidden');

        document.querySelector("#chkSemTaxa").checked = false;
        document.querySelector("#chkTaxaUnica").checked = false;
        document.querySelector("#chkTaxaDistancia").checked = false;

        document.querySelector("#" + pai).checked = true;

        switch (tab) {
            case 'container-sem-taxa':
                config.method.obterConfigSemTaxa();
                break;

            case 'container-taxa-unica':
                config.method.obterConfigTaxaUnica();
                break;

            case 'container-taxa-distancia':
                config.method.obterConfigTaxaDistancia();
                break;

            default:
                break;
        }

    },

    // seta as configurações da tab de Sem taxa
    obterConfigSemTaxa: () => {

        // Primeiro, já seta a taxa como ativa
        var dados = {
            semtaxa: 1,
            taxaunica: 0,
            taxadistancia: 0
        }

        // app.method.post('/formapagamento/ativar', JSON.stringify(dados),
        //     (response) => {
        //         console.log(response)

        //         app.method.loading(false);

        //         if (response.status === 'error') {
        //             app.method.mensagem(response.message);
        //             return;
        //         }

        //         app.method.mensagem(response.message, 'green');

        //     },
        //     (error) => {
        //         app.method.loading(false);
        //         console.log('error', error)
        //     }
        // )

    },

    // seta as configurações da tab de Taxa Unica
    obterConfigTaxaUnica: () => {

    },

    // seta as configurações da tab de Taxa por Distancia
    obterConfigTaxaDistancia: () => {

    },


    // -------- TAB FORMAS DE PAGAMENTO -----------

    // obtem as formas de pagamento
    obterConfigFormaPagamento: () => {

        app.method.loading(true);

        app.method.get('/formapagamento/painel',
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    console.log(response.message)
                    return;
                }

                console.log(response.data)

                let pix = response.data.filter((e) => { return e.idformapagamento == 1 });
                let dinheiro = response.data.filter((e) => { return e.idformapagamento == 2 });
                let cartaocredito = response.data.filter((e) => { return e.idformapagamento == 3 });
                let cartaodebito = response.data.filter((e) => { return e.idformapagamento == 4 });

                // valida as configs
                config.method.changeOpcaoFormaPagamento(1, 'pix', pix[0].ativo);
                config.method.changeOpcaoFormaPagamento(2, 'dinheiro', dinheiro[0].ativo);
                config.method.changeOpcaoFormaPagamento(3, 'cartaocredito', cartaocredito[0].ativo);
                config.method.changeOpcaoFormaPagamento(4, 'cartaodebito', cartaodebito[0].ativo);


            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        )

    },

    // clique na forma de pagamento
    changeOpcaoFormaPagamento: (id, input, isCheck) => {

        let check = document.querySelector("#chkFormaPagamento-" + input).checked;

        if (isCheck != undefined) {
            check = isCheck;
        }

        if (check) {
            document.querySelector("#chkFormaPagamento-" + input).checked = true;

            // valida se é o click no botão
            if (isCheck == undefined) {
                config.method.salvarOpcaoFormaPagamento(id, true);
            }

        }
        else {
            document.querySelector("#chkFormaPagamento-" + input).checked = false;

            // valida se é o click no botão
            if (isCheck == undefined) {
                config.method.salvarOpcaoFormaPagamento(id, false);
            }
        }


    },

    // salva a opção de forma de pagamento
    salvarOpcaoFormaPagamento: (id, ativar) => {

        app.method.loading(true);

        var dados = {
            forma: id,
            ativar: ativar ? 1 : 0
        }

        app.method.post('/formapagamento/ativar', JSON.stringify(dados),
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


}

