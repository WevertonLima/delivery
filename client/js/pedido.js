document.addEventListener("DOMContentLoaded", function (event) {
    app.event.init(false);
    pedido.event.init();
});

var pedido = {};

pedido.event = {

    init: () => {

        pedido.method.obterUltimoPedido();
        pedido.method.obterItensCarrinho();

    }

}

pedido.method = {

    // obtem último pedido
    obterUltimoPedido: () => {

        // primeiro, pega o carrinho que já existe no local
        let pedido = app.method.obterValorSessao('order');

        if (pedido != undefined) {

            let order = JSON.parse(pedido);

            console.log('order', order);

            document.querySelector('#containerNenhumPedido').classList.add('hidden');
            document.querySelector('#containerAcompanhamento').classList.remove('hidden');

        }
        else {
            document.querySelector('#containerNenhumPedido').classList.remove('hidden');
            document.querySelector('#containerAcompanhamento').classList.add('hidden');
        }


    },

    // valida quantos itens tem no carrinho e exibe o icone
    obterItensCarrinho: () => {

        // primeiro, pega o carrinho que já existe no local
        let carrinho = app.method.obterValorSessao('cart');

        if (carrinho != undefined) {

            let cart = JSON.parse(carrinho);

            if (cart.itens.length > 0) {
                document.querySelector("#icone-carrinho-vazio").classList.add('hidden');
                document.querySelector("#total-carrinho").classList.remove('hidden');
                document.querySelector("#total-carrinho").innerText = cart.itens.length;
            }
            else {
                document.querySelector("#icone-carrinho-vazio").classList.remove('hidden');
                document.querySelector("#total-carrinho").classList.add('hidden');
                document.querySelector("#total-carrinho").innerText = 0;
            }

        }
        else {
            document.querySelector("#icone-carrinho-vazio").classList.remove('hidden');
            document.querySelector("#total-carrinho").classList.add('hidden');
            document.querySelector("#total-carrinho").innerText = 0;
        }

    }

}

