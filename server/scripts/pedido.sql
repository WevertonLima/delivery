--INIT#salvarPedido#

INSERT INTO
    pedido
(idpedidostatus, idtipoentrega, idtaxaentrega, idformapagamento, troco, total, cep, endereco, numero, bairro, complemento, cidade, estado, nomecliente, telefonecliente)
    VALUES
(@idpedidostatus, @idtipoentrega, @idtaxaentrega, @idformapagamento, @troco, @total, @cep, @endereco, @numero, @bairro, @complemento, @cidade, @estado, @nomecliente, @telefonecliente)

--END#salvarPedido#


--INIT#salvarPedidoItem#

INSERT INTO
    pedidoitem
(idpedido, idproduto, quantidade, observacao)
    VALUES
(@idpedido, @idproduto, @quantidade, @observacao)

--END#salvarPedidoItem#


--INIT#salvarPedidoItemOpcional#

INSERT INTO
    pedidoitemopcional
(idpedidoitem, idopcionalitem)
    VALUES
(@idpedidoitem, @idopcionalitem)

--END#salvarPedidoItemOpcional#


--INIT#obterPedidoPorId#

SELECT
    p.idpedidostatus
    ,p.idpedidoincre
    , ps.descricao AS pedidostatus
    , p.idtipoentrega
    , p.idtaxaentrega
    , p.idformapagamento
    , fa.nome AS formapagamento
    , p.troco
    , p.total
    , p.cep
    , p.endereco
    , p.numero
    , p.bairro
    , p.complemento
    , p.cidade
    , p.estado
    , p.nomecliente
    , p.telefonecliente
    , p.datacadastro
    , te.valor AS taxaentrega
    , te.tempominimo AS entregatempominimo
    , te.tempomaximo AS entregatempomaximo
FROM
    pedido AS p
    JOIN pedidostatus AS ps ON ps.idpedidostatus = p.idpedidostatus
    JOIN formapagamento AS fa ON fa.idformapagamento = p.idformapagamento
    LEFT JOIN taxaentrega AS te ON te.idtaxaentrega = p.idtaxaentrega
WHERE
    idpedido = @idpedido

--END#obterPedidoPorId#