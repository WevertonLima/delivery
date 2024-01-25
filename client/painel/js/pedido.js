document.addEventListener("DOMContentLoaded", function (event) {
  pedido.event.init();
});

var pedido = {};

var PEDIDOS = [];
var PEDIDO_ID = 0;

pedido.event = {
  init: () => {
    app.method.loading(true);
    app.method.validaToken();
    app.method.carregarDadosEmpresa();

    pedido.method.obterPedidos(1);

    setTimeout(() => {
      app.method.loading(false);
    }, 1000);

    var modalDetalhe = document.getElementsById("modalDetalhes");

    modalDetalhe.addEventListener("show.bs.modal", (event) => {
      var button = event.relatedTarget;
      var idPedido = button.getAttribute("data-code");

      pedido.method.OpenPedidoModal(idPedido);
    });
  },
};

pedido.method = {
  openPedidoModal: (idPedido) => {
    app.method.get("/pedido/obterpedido/" + idPedido, (response) => {});
  },

  obterPedidos: (idpedidostatus) => {
    app.method.loading(true);
    document.getElementById("pedidosMenu").innerHTML = "";
    PEDIDOS = [];
    app.method.get(
      "/pedido/status/" + idpedidostatus,
      (response) => {
        console.log("response", response);
        app.method.loading(false);

        if (response.status == "error") {
          console.log(response.message);
          return;
        }

        // passa a lista das categorias para a variavel global
        PEDIDOS = response.data;

        pedido.method.carregarPedidos(response.data);
      },
      (error) => {
        app.method.loading(false);
        console.log("error", error);
      }
    );
  },

  // carrega as categorias na tela
  carregarPedidos: (lista) => {
    if (lista.length > 0) {
      // percorre as categorias e adiciona na tela
      lista.forEach((e, i) => {
        let temp = pedido.template.pedidos
          .replace(/\${nomecliente}/g, e.nomecliente)
          .replace(/\${total}/g, e.total)
          .replace(/\${id}/g, e.idpedido);

        // adiciona a categoria na tela
        document.querySelector("#pedidosMenu").innerHTML += temp;

        // último item, inicia o evento de tooltip
        if (i + 1 == lista.length) {
          $('[data-toggle="tooltip"]').tooltip();
        }
      });
    } else {
      // nenhuma categoria encontrada, adiciona uma linha em branco
    }
  },

  moverStatus: (idpedido, idpedidostatus) => {
    app.method.loading(true);

    PEDIDOS = [];

    var dados = {
      idpedido: idpedido,
      idpedidostatus: idpedidostatus,
    };

    app.method.post(
      "/pedido/moverstatus",
      JSON.stringify(dados),
      (response) => {
        console.log(response);

        app.method.loading(false);

        if (response.status === "error") {
          app.method.mensagem(response.message);
          return;
        }

        app.method.mensagem(response.message, "green");

        pedido.method.obterPedidos(1);
      },
      (error) => {
        app.method.loading(false);
        console.log("error", error);
      }
    );
  },
  changeStatusTela: (idpedidostatus) => {
    pedido.method.obterPedidos(idpedidostatus);

    var botoesStatus = document.querySelectorAll(".btnStatus");

    for (var i = 0; i < botoesStatus.length; i++) {
      botoesStatus[i].classList.remove("active");
    }

    switch (idpedidostatus) {
      case 1:
        document.querySelector("#pedidoPendente").classList.add("active");
        break;
      case 2:
        document.querySelector("#pedidoAceito").classList.add("active");
        break;
      case 3:
        document.querySelector("#pedidoEmPreparo").classList.add("active");
        break;
      case 4:
        document.querySelector("#pedidoEmEntrega").classList.add("active");
        break;
      case 5:
        document.querySelector("#pedidoConcluido").classList.add("active");
        break;
    }
  },

  imprimirPedido: () => {
    console.log("imprimir");

    // Captura o conteúdo do modal
    const conteudoModal = document.getElementById("modalDetalhes").innerHTML;

    // Cria uma nova janela de impressão
    const janelaDeImpressao = window.open("", "", "width=600,height=600");

    // Abre a janela de impressão e insere o conteúdo do modal nela
    janelaDeImpressao.document.write(
      "<html><head><title>Impressão do Pedido</title></head><body>"
    );
    janelaDeImpressao.document.write(conteudoModal);
    janelaDeImpressao.document.write("</body></html>");

    // Imprime a janela de impressão
    janelaDeImpressao.print();
    janelaDeImpressao.close();
  },
};

pedido.template = {
  pedidos: `
    <div class="col-3">
    <div class="card card-pedido">
    <div class="card-pedido-header">
        <div class="dropdown">
            <button class="btn btn-white btn-sm dropdown-toggle active" type="button" id="menuAcoes" data-bs-toggle="dropdown" aria-expanded="false">
                Pendente
            </button>
            <div class="dropdown-menu" aria-labelledby="menuAcoes">
                <a class="dropdown-item" href="#" onclick="pedido.method.moverStatus(\${id},2)">Mover para <b>Aceito</b>
                              <i class="far fa-thumbs-up"></i
                            ></a>
                <a class="dropdown-item" href="#" onclick="pedido.method.moverStatus(\${id},3)">Mover para <b>Em preparo</b>
                              <i class="far fa-clock"></i
                            ></a>
                <a class="dropdown-item" href="#" onclick="pedido.method.moverStatus(\${id},4)">Mover para <b>Em entrega</b>
                              <i class="fas fa-motorcycle"></i
                            ></a>
                <a class="dropdown-item" href="#" onclick="pedido.method.moverStatus(\${id},5)">Mover para <b>Concluído</b>
                              <i class="far fa-check-circle"></i
                            ></a>
                <a class="dropdown-item" href="#" onclick="pedido.method.moverStatus(\${id},6)">Recusar Pedido <i class="far fa-times-circle"></i
                            ></a>
            </div>
        </div>
        <p class="numero-pedido mt-2">#1</p>
    </div>
    <div class="card-content" data-bs-toggle="modal" data-bs-target="#modalDetalhes" data-code="\${id}">
        <div class="card-pedido-body mt-3">
            <p class="info-pedido">
                <i class="fas fa-user"></i> \${nomecliente}
            </p>
            <p class="info-pedido">
                <i class="fas fa-motorcycle"></i> Entrega
            </p>
            <p class="info-pedido">
                <i class="fas fa-coins"></i> Dinheiro
                <span>Troco para R$ 50,00</span>
            </p>
        </div>
        <div class="separate"></div>
  
        <div class="card-pedido-footer">
            <p class="horario-pedido">Recebido há 33 minutos</p>
            <p class="total-pedido"><b>\${total}</b></p>
        </div>
    </div>
  </div>
    </div>
  `,
};
