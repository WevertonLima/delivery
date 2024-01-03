--INIT#listaCardapio#

SELECT
	*
FROM 
	produto
WHERE
    apagado = 0
ORDER BY
	-ordem DESC, idproduto ASC

--END#listaCardapio#

--INIT#obterPorId#

SELECT
	idproduto
    , idcategoria
    , nome
    , descricao
    , valor
    , imagem
    , ordem
FROM 
	produto
WHERE
    idproduto = @idproduto
    AND apagado = 0

--END#obterPorId#


--INIT#obterPorCategoriaId#

SELECT
	idproduto
    , nome
    , descricao
    , valor
    , imagem
    , ordem
FROM 
	produto
WHERE
    idcategoria = @idcategoria
    AND apagado = 0
ORDER BY
	-ordem DESC, idproduto ASC

--END#obterPorCategoriaId#

--INIT#adicionarProduto#

INSERT INTO
    produto
(idcategoria, nome, descricao, valor, imagem, ordem)
    VALUES
(@idcategoria, @nome, @descricao, @valor, @imagem, @ordem)

--END#adicionarProduto#

--INIT#obterPorCategoriaIdSemOrdenacao#

SELECT
	idproduto
    , nome
    , descricao
    , valor
    , imagem
    , ordem
FROM 
	produto
WHERE
    idcategoria = @idcategoria
    AND apagado = 0
ORDER BY
	idproduto ASC

--END#obterPorCategoriaIdSemOrdenacao#

--INIT#atualizarOrdemProduto#

UPDATE
	produto
SET
	ordem = @ordem
WHERE
	idproduto = @idproduto

--END#atualizarOrdemProduto#

--INIT#removerPorCategoriaId#

UPDATE
	produto
SET
	apagado = 1
WHERE
	idcategoria = @idcategoria

--END#removerPorCategoriaId#

--INIT#removerPorProdutoId#

UPDATE
	produto
SET
	apagado = 1
WHERE
	idproduto = @idproduto

--END#removerPorProdutoId#


--INIT#atualizarProduto#

UPDATE
	produto
SET
	nome = @nome
    , descricao = @descricao
    , valor = @valor
WHERE
	idproduto = @idproduto

--END#atualizarProduto#


--INIT#adicionarImagemProduto#

UPDATE
	produto
SET
	imagem = @imagem
WHERE
	idproduto = @idproduto

--END#adicionarImagemProduto#

--INIT#removerImagemProduto#

UPDATE
	produto
SET
	imagem = NULL
WHERE
	idproduto = @idproduto

--END#removerImagemProduto#