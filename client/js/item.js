document.addEventListener("DOMContentLoaded", function(event) {
    app.event.init();
    item.event.init();
});

var item = {};
var ITEM_ID = 0;

item.event = {

    init: () => {

        var url = new URL(window.location.href);
        var p = url.searchParams.get("p");

        console.log('p', p)

        if (p != null && p.trim() != '' && !isNaN(p)) {

            ITEM_ID = p;
            item.method.obterDadosProduto();

        }
        else {
            window.location.href = '/index.html'
        }

    }

}

item.method = {

    // obtem os dados do produto
    obterDadosProduto: () => {

        app.method.get('/produto/' + ITEM_ID,
            (response) => {

                console.log(response)

                if (response.status == "error") {
                    console.log(response.message)
                    return;
                }

            },
            (error) => {
                console.log('error', error)
            }, true
        )

    },

    // carrega as categorias na tela
    carregarCategorias: (list) => {

        if (list.length > 0) {

            // limpa o menu das categorias
            document.querySelector("#listaCategorias").innerHTML = '';

            // limpa o cardápio
            document.querySelector("#listaItensCardapio").innerHTML = '';

            list.forEach((e, i) => {

                let active = '';

                // primeiro item, adiciona o active
                if (i == 0) {
                    active = 'active'
                }

                let temp = cardapio.templates.categoria.replace(/\${idcategoria}/g, e.idcategoria)
                    .replace(/\${nome}/g, e.nome)
                    .replace(/\${icone}/g, e.icone)
                    .replace(/\${active}/g, active)

                // adiciona a categoria ao menu
                document.querySelector("#listaCategorias").innerHTML += temp

                let tempHeaderCategoria = cardapio.templates.headerCategoria.replace(/\${idcategoria}/g, e.idcategoria)
                    .replace(/\${nome}/g, e.nome);

                // adiciona a categoria no cardápio
                document.querySelector("#listaItensCardapio").innerHTML += tempHeaderCategoria;

                // No último item, obtem os produtos
                if (list.length == (i + 1)) {
                    cardapio.method.obterProdutos();

                    // inicia a validação do scroll para setar a categoria ativa
                    document.addEventListener("scroll", (event) => {
                        cardapio.method.validarCategoriaScroll();
                    });

                }

            });

        }

    },

}

item.templates = {

    categoria: `
        <a href="#!" id="categoria-\${idcategoria}" class="item-categoria animated fadeIn btn btn-white btn-sm mb-3 me-3 \${active}" onclick="cardapio.method.selecionarCategoria('\${idcategoria}')">
            <i class="\${icone}"></i>&nbsp; \${nome}
        </a>
    `,

    headerCategoria: `
        <div class="container-group mb-5 animated fadeIn" id="categoria-header-\${idcategoria}">
            <p class="title-categoria"><b>\${nome}</b></p>
        </div>
    `,

    produto: `
        <div class="card mb-2 item-cardapio animated fadeInUp" onclick="cardapio.method.abrirProduto('\${idproduto}')">
            <div class="d-flex">
                <div class="container-img-produto" style="background-image: url('/public/images/\${imagem}'); background-size: cover;"></div>
                <div class="infos-produto">
                    <p class="name"><b>\${nome}</b></p>
                    <p class="description">\${descricao}</p>
                    <p class="price"><b>R$ \${valor}</b></p>
                </div>
            </div>
        </div>
    `

}