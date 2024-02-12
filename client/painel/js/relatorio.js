document.addEventListener("DOMContentLoaded", function (event) {
    relatorio.event.init();
});

var relatorio = {};

var GRAFICO;
var LINHAS = ["Jan 1", "Jan 3", "Jan 5", "Jan 7", "Jan 9", "Jan 11", "Jan 13", "Jan 15"];
var VALORES = [950, 1220, 1340, 1450, 1320, 1220, 1390, 1560];

var PEDIDOS = [
    {

    }
]

relatorio.event = {

    init: () => {

        relatorio.method.iniciarGrafico();
        relatorio.method.listarPedidos();

    }

}

relatorio.method = {

    iniciarGrafico: () => {

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

                                let formatado = texto + ': <b>R$ ' + valor + '</b>';

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
                        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
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
                                        return 'R$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    } else {
                                        return 'R$' + value;
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