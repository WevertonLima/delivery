--INIT#obterPorProdutoId#

SELECT
	o.idopcional
	, o.nome as titulo
    , o.tiposimples
    , o.minimo
    , o.maximo
    , oi.idopcionalitem
    , oi.nome as nomeopcional
    , oi.valor as valoropcional
FROM
	produtoopcional AS po
    JOIN opcional AS o ON o.idopcional = po.idopcional
		AND o.apagado = 0
	RIGHT JOIN opcionalitem AS oi ON oi.idopcional = po.idopcional
		AND oi.apagado = 0
WHERE
	po.idproduto = @idproduto

--END#obterPorProdutoId#