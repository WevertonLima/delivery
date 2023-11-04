--INIT#listaCardapio#

SELECT
	*
FROM 
	produto
ORDER BY
	ordem

--END#listaCardapio#

--INIT#obterPorId#

SELECT
	idproduto
    , nome
    , descricao
    , valor
    , imagem
FROM 
	produto
WHERE
    idproduto = @idproduto

--END#obterPorId#