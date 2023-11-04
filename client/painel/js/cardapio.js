$(document).ready(function () {
    cardapio.event.init();
})

var cardapio = {};

cardapio.event = {

    init: () => {

        $('[data-toggle="tooltip"]').tooltip();
        $("#categoriasMenu").sortable({
            scroll: false, // para não scrollar a tela
            update: function(event, ui) {
                // função para atualizar a ordem da lista
                cardapio.method.atualizarOrdem();
            },
            handle: ".drag-icon" // define a classe que pode receber o "drag and drop"
        });

        $("#listaProdutos-one").sortable({
            scroll: false, // para não scrollar a tela
            update: function(event, ui) {
                // função para atualizar a ordem da lista
                cardapio.method.atualizarOrdem();
            },
            handle: ".drag-icon-produto" // define a classe que pode receber o "drag and drop"
        });

        //cardapio.method.carregarListaIcones();

    }

}

cardapio.method = {


    atualizarOrdem: () => {

        

    },

    carregarListaIcones: () => {

        $.each(ICONES, (i, e) => {
            $("#categorias").append(e.icon);
        })

    },

    upload: () => {

        var formData = new FormData();

        formData.append('image', $('input[type=file]')[0].files[0]);

        app.method.upload('/image/upload', formData,
            (response) => {
                console.log(response)
            },
            (xhr, ajaxOptions, error) => {
                console.log('xhr', xhr)
                console.log('ajaxOptions', ajaxOptions)
                console.log('error', error)
            }, true
        )

    },

    remove: () => {

        var data = {
            imagem: 'OK - Alinhe elementos  com Flexbox - 1.png'
        }

        app.method.post('/image/remove', JSON.stringify(data),
            (response) => {
                console.log(response)
            },
            (xhr, ajaxOptions, error) => {
                console.log('xhr', xhr)
                console.log('ajaxOptions', ajaxOptions)
                console.log('error', error)
            }, true
        )

    },


}