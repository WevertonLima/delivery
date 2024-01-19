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
