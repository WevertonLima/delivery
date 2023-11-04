document.addEventListener("DOMContentLoaded", function(event) {
    app.event.init(true);
    carrinho.event.init();
});

var carrinho = {};

carrinho.event = {

    init: () => {

        carrinho.method.validarTaxaPorEndereco();
        
    }

}

carrinho.method = {

    validarTaxaPorEndereco: () => {

        let dados = {
            //endereco: 'Rua André Bovolato, 105, Jardim das Acácias, Bebedouro-SP, 14711-254'
            endereco: 'Rua Ângelo Salvador, 47, Vila Major Cicero de Carvalho, Bebedouro-SP, 14702-052'
        }

        app.method.post('/pedido/taxa', JSON.stringify(dados),
            (response) => {

                console.log('response', response)

                if (response.status == "error") {
                    console.log(response.message)
                    return;
                }

            },
            (error) => {
                console.log('error', error)
            }, true
        )
        
    }

    

}