document.addEventListener("DOMContentLoaded", function (event) {
    relatorio.event.init();
});

var relatorio = {};

var GRAFICO = undefined;

var PEDIDOS = [
    {

    }
]

relatorio.event = {

    init: () => {

        app.method.validaToken();
        app.method.carregarDadosEmpresa();

        // incia a primeira tab
        relatorio.method.openTab('faturamento');

        // Bloqueia os inputs de FILTROS por DATA
        relatorio.method.bloquearDatasFiltros();

    }

}

relatorio.method = {

    // método para carregar as tabs
    openTab: (tab) => {

        Array.from(document.querySelectorAll(".tab-content")).forEach(e => e.classList.remove('active'));
        Array.from(document.querySelectorAll(".tab-item")).forEach(e => e.classList.add('hidden'));

        document.querySelector("#tab-" + tab).classList.add('active');
        document.querySelector("#" + tab).classList.remove('hidden');

        switch (tab) {
            case 'faturamento':
                relatorio.method.carregarDataAtualFiltroFaturamento();
                relatorio.method.filtrarFaturamento();
                break;

            case 'historico':
                relatorio.method.obterHistorico();
                break;

            default:
                break;
        }

    },

    // bloquea o limite das datas pro filtro
    bloquearDatasFiltros: () => {

        // a data inicial poderá ser seleciona até 1 ANO atrás
        var umAnoAtras = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

        let diaIni = umAnoAtras.getDate();
        let mesIni = umAnoAtras.getMonth() + 1;
        let anoIni = umAnoAtras.getFullYear();

        if (diaIni < 10) diaIni = '0' + diaIni;
        if (mesIni < 10) mesIni = '0' + mesIni;

        // seta o input com a data minima de 1 ano atras
        $("#txtDataInicioFaturamento").attr('min', `${anoIni}-${mesIni}-${diaIni}`);
        $("#txtDataFimFaturamento").attr('min', `${anoIni}-${mesIni}-${diaIni}`);

        // a data de seleção final pode ser somente até o último dia do mes atual
        var lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        let diaFim = lastDay.getDate();
        let mesFim = lastDay.getMonth() + 1;
        let anoFim = lastDay.getFullYear();

        if (diaFim < 10) diaFim = '0' + diaFim;
        if (mesFim < 10) mesFim = '0' + mesFim;

        // seta o input com a data máxima do último dia do mes atual
        $("#txtDataInicioFaturamento").attr('max', `${anoFim}-${mesFim}-${diaFim}`);
        $("#txtDataFimFaturamento").attr('max', `${anoFim}-${mesFim}-${diaFim}`);

    },

    // carrega a data atual para o filtro do relatório
    carregarDataAtualFiltroFaturamento: () => {

        // Carrega o MÊS atual no filtro
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        let diaIni = firstDay.getDate();
        let mesIni = firstDay.getMonth() + 1;
        let anoIni = firstDay.getFullYear();

        let diaFim = lastDay.getDate();
        let mesFim = lastDay.getMonth() + 1;
        let anoFim = lastDay.getFullYear();

        if (diaIni < 10) diaIni = '0' + diaIni;
        if (mesIni < 10) mesIni = '0' + mesIni;

        if (diaFim < 10) diaFim = '0' + diaFim;
        if (mesFim < 10) mesFim = '0' + mesFim;        

        $("#txtDataInicioFaturamento").val(`${anoIni}-${mesIni}-${diaIni}`);
        $("#txtDataFimFaturamento").val(`${anoFim}-${mesFim}-${diaFim}`);
        $("#ddlCategoriaFaturamento").val(0);

    },

    // filtra os faturamentos de acordo com o filtro
    filtrarFaturamento: () => {

        let datainicio = $("#txtDataInicioFaturamento").val();
        let datafim = $("#txtDataFimFaturamento").val();
        let categoria = $("#ddlCategoriaFaturamento").val();

        if (datainicio == '') {
            app.method.mensagem("Informe uma data de início válida, por favor.");
            return;
        }

        if (datafim == '') {
            app.method.mensagem("Informe uma data fim válida, por favor.");
            return;
        }

        let dados = {
            datainicio: datainicio,
            datafim: datafim,
            categoria: categoria
        }

        app.method.loading(true);

        app.method.post('/faturamento/filtrar', JSON.stringify(dados),
            (response) => {
                console.log(response)

                app.method.loading(false);

                if (response.status === 'error') {
                    app.method.mensagem(response.message);
                    return;
                }

                relatorio.method.carregarGrafico(response.data);
                relatorio.method.atualizarTotais(response.data);

            },
            (error) => {
                app.method.loading(false);
                console.log('error', error)
            }
        )

    },

    // carrega o gráfico
    carregarGrafico: (lista) => {

        $("#lblNenhumFaturamento").addClass('hidden');

        if (GRAFICO != undefined) {
            GRAFICO.destroy();
            GRAFICO = undefined;
        }

        if (lista.length > 0) {

            // percorre a lista para montar o objeto do gráfico
            var LINHAS = [];
            var VALORES = [];

            // primeiro, verifica quantos dias tem de diferença entre as datas
            let datainicio = $("#txtDataInicioFaturamento").val();
            let datafim = $("#txtDataFimFaturamento").val()

            let data1 = new Date(`${datainicio} 00:00:00`);
            let data2 = new Date(`${datafim} 23:59:59`);

            // calcula a diferenca em tempo
            let diff_time = data2.getTime() - data1.getTime();

            // calcula a diferenca em dias
            let diff_days = Math.round(diff_time / (1000 * 3600 * 24));

            //console.log('diff_days', diff_days)

            for (let index = 0; index < diff_days; index++) {
                
                let data_teste = new Date(data1);
                data_teste.setDate(data_teste.getDate() + index);

                let dia = data_teste.getDate();
                let mes = data_teste.getMonth() + 1;
                let ano = data_teste.getFullYear();

                if (dia < 10) dia = '0' + dia;
                if (mes < 10) mes = '0' + mes;

                let data_final = `${dia}/${mes}/${ano}`;

                //console.log('data_final', data_final);

                // valida se tem registros pra essa data
                let existe = lista.filter((e) => { 
                    let filtro = e.filtro.split('T')[0];
                    let dataFormatada = `${filtro.split('-')[2]}/${filtro.split('-')[1]}/${filtro.split('-')[0]}`;
                    return dataFormatada == data_final; 
                })

                if (existe.length > 0) {
                    LINHAS.push(data_final);
                    VALORES.push(existe[0].total);
                }
                else {
                    // seta um valor zerado
                    LINHAS.push(data_final);
                    VALORES.push(0);
                }

            }

            console.log('LINHAS', LINHAS);
            console.log('VALORES', VALORES);

            const ctx = document.getElementById('graficoFaturamento').getContext("2d");

            GRAFICO = new Chart(ctx, {
                type: "line",
                data: {
                    labels: LINHAS,
                    datasets: [
                        {
                            label: "Faturamento",
                            data: VALORES,
                            borderWidth: 6,
                            fill: true,
                            backgroundColor: '#fffdf7',
                            borderColor: '#ffbf00',
                            pointBackgroundColor: '#ffbf00',
                            pointRadius: 5,
                            pointHoverRadius: 5,
                            pointHitDetectionRadius: 35,
                            pointBorderWidth: 2.5,
                        },
                    ],
                },
                options: {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        // Disable the on-canvas tooltip
                        enabled: false,

                        custom: function (tooltipModel) {
                            // Tooltip Element
                            var tooltipEl = document.getElementById('chartjs-tooltip');

                            // Create element on first render
                            if (!tooltipEl) {
                                tooltipEl = document.createElement('div');
                                tooltipEl.id = 'chartjs-tooltip';
                                tooltipEl.innerHTML = '<table></table>';
                                document.body.appendChild(tooltipEl);
                            }

                            // Hide if no tooltip
                            if (tooltipModel.opacity === 0) {
                                tooltipEl.style.opacity = 0;
                                return;
                            }

                            // Set caret Position
                            tooltipEl.classList.remove('above', 'below', 'no-transform');
                            if (tooltipModel.yAlign) {
                                tooltipEl.classList.add(tooltipModel.yAlign);
                            } else {
                                tooltipEl.classList.add('no-transform');
                            }

                            function getBody(bodyItem) {
                                return bodyItem.lines;
                            }

                            // Set Text
                            if (tooltipModel.body) {
                                var titleLines = tooltipModel.title || [];
                                var bodyLines = tooltipModel.body.map(getBody);

                                var innerHtml = '<thead>';

                                titleLines.forEach(function (title) {
                                    innerHtml += '<tr><th>' + title + '</th></tr>';
                                });
                                innerHtml += '</thead><tbody>';

                                bodyLines.forEach(function (body, i) {

                                    console.log('body', body)

                                    let valor = body[0].split(':')[1].trim();
                                    let texto = body[0].split(':')[0].trim();

                                    let formatado = texto + ': <b>R$ ' + (parseFloat(valor).toFixed(2)).toString().replace('.', ',') + '</b>';

                                    innerHtml += '<tr><td>' + formatado + '</td></tr>';
                                    innerHtml += '<tr><td>Nº Pedidos: ' + '<b>' + 5 + '</b>' + '</td></tr>';
                                });
                                innerHtml += '</tbody>';

                                var tableRoot = tooltipEl.querySelector('table');
                                tableRoot.innerHTML = innerHtml;
                            }

                            // `this` will be the overall tooltip
                            var position = this._chart.canvas.getBoundingClientRect();

                            // Display, position, and set styles for font
                            tooltipEl.style.opacity = 1;
                            tooltipEl.style.position = 'absolute';
                            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - (130) + 'px';
                            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                            tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                            tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                            tooltipEl.style.pointerEvents = 'none';
                        }
                    },
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: false,
                                    fontColor: '#999999',
                                    fontSize: 10,
                                    callback: (value, index, values) => {
                                        if (parseInt(value) >= 1000) {
                                            return 'R$ ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        } else {
                                            return 'R$ ' + value;
                                        }
                                    }
                                },
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                }
                            },
                        ],
                        xAxes: [
                            {
                                ticks: {
                                    fontColor: '#999999',
                                    fontSize: 10
                                },
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                }
                            }
                        ]
                    },
                },
            });

        }
        else {

            // nenhum registro encontrado
            $("#lblNenhumFaturamento").removeClass('hidden');

        }

    },

    // atualiza os cards de totais
    atualizarTotais: (lista) => {

        if (lista.length > 0) {

            let totalFaturado = 0;
            let totalPedidos = 0;

            $.each(lista, (i, e) => {
                totalFaturado += e.total;
                totalPedidos += e.pedidos;
            })

            let ticketMedio = parseFloat(totalFaturado / totalPedidos).toFixed(2);

            $("#lblTotalFaturamento").text(`R$ ${(totalFaturado.toFixed(2)).toString().replace('.', ',')}`);
            $("#lblTotalPedidos").text(totalPedidos);
            $("#lblTicketMedio").text(`R$ ${(ticketMedio).toString().replace('.', ',')}`);

        }
        else {

            // nenhum registro encontrado
            $("#lblTotalFaturamento").text('-');
            $("#lblTotalPedidos").text('-');
            $("#lblTicketMedio").text('-');

        }

    },






    // ---------- HISTÓRICO DE PEDIDOS --------------

    // carrega o histórico de pedidos
    obterHistorico: () => {


    },

    listarPedidos: (list) => {

        $("#data-table").DataTable({
            destroy: true,
            aaSorting: [[0, 'asc']],
            dom: 'Bfrtipl',
            buttons: ['pageLength'],
            language: {
                "sEmptyTable": "Nenhum registro encontrado",
                "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
                "sInfoFiltered": "(Filtrados de _MAX_ registros)",
                "sInfoPostFix": "",
                "sInfoThousands": ".",
                "sLengthMenu": "_MENU_ resultados por página",
                "sLoadingRecords": "Carregando...",
                "sProcessing": "Processando...",
                "sZeroRecords": "Nenhum registro encontrado",
                "sSearch": "Pesquisar",
                "oPaginate": {
                    "sNext": "Próximo",
                    "sPrevious": "Anterior",
                    "sFirst": "Primeiro",
                    "sLast": "Último"
                },
                "oAria": {
                    "sSortAscending": ": Ordenar colunas de forma ascendente",
                    "sSortDescending": ": Ordenar colunas de forma descendente"
                },
                buttons: {
                    pageLength: {
                        _: "Mostrar %d linhas",
                        '-1': "Mostrar Todos"
                    }
                }
            },
            columnDefs: [
                { targets: 'no-sort', orderable: false }
            ]

        });

    },

}