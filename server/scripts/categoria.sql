--INIT#listarTodas#

SELECT 
    idcategoria
	, nome
    , icone
	, ativo
FROM 
	categoria 
WHERE
	apagado = 0
ORDER BY
	-ordem DESC, idcategoria ASC

--END#listarTodas#

--INIT#listarTodasAtivas#

SELECT 
    idcategoria
	, nome
    , icone
	, ativo
FROM 
	categoria 
WHERE
	apagado = 0
AND
    ativo = 1
ORDER BY
	-ordem DESC, idcategoria ASC

--END#listarTodasAtivas#



--INIT#atualizarCategoria#

UPDATE
	categoria
SET
	nome = @nome,
	icone = @icone
WHERE
	idcategoria = @idcategoria

--END#atualizarCategoria#

--INIT#adicionarCategoria#

INSERT INTO categoria
(nome, icone)
VALUES
(@nome, @icone)

--END#adicionarCategoria#

--INIT#atualizarOrdemCategoria#

UPDATE
	categoria
SET
	ordem = @ordem
WHERE
	idcategoria = @idcategoria

--END#atualizarOrdemCategoria#

--INIT#obterPorId#

SELECT 
    nome
	, icone
	, ordem
FROM 
	categoria 
WHERE
	idcategoria = @idcategoria
	AND apagado = 0

--END#obterPorId#

--INIT#removerPorId#

UPDATE
	categoria
SET
	apagado = 1
WHERE
	idcategoria = @idcategoria

--END#removerPorId#

--INIT#ativarCategoria#
UPDATE
	categoria
SET
	ativo = @ativo
WHERE
	idcategoria = @idcategoria

--END#ativarCategoria#


--INIT#ativarProdutoPorCategoria#
UPDATE
	produto
SET
	ativo = @ativo
WHERE
	idcategoria = @idcategoria

--END#ativarProdutoPorCategoria#