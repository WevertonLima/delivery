const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql.js');
const readCommandSql = new ReadCommandSql();

// Chave da APIKEY - https://www.geoapify.com/
const key = '1c4f6098b8144c3aa91d9055eeb4917b';

const controllers = () => {

    // obtem a rota (lat, long) e calcula a taxa do delivery por km (se for taxa por distancia)
    const calcularTaxaDelivery = async (req) => {

        try {

            // primeiro obtem a lat e long do endereço da empresa
            var ComandoSQL = await readCommandSql.retornaStringSql('obterDadosCompletos', 'empresa');
            var empresa = await db.Query(ComandoSQL);

            const enderecoEmpresa = `${empresa[0].endereco}, ${empresa[0].numero}, ${empresa[0].bairro}, ${empresa[0].cidade}-${empresa[0].estado}, ${empresa[0].cep}`;
            const urlEncodeEmpresa = encodeURI(enderecoEmpresa);

            const urlEmpresa = `https://api.geoapify.com/v1/geocode/search?text=${urlEncodeEmpresa}&apiKey=${key}`;
            const responseEmpresa = await fetch(urlEmpresa);
            const responseJsonEmpresa = await responseEmpresa.json();

            console.log('empresa - ', responseJsonEmpresa);


            // Agora obtem a lat e long do endereco do cliente
            const endereco = req.body.endereco;
            const urlEncode = encodeURI(endereco);

            const url = `https://api.geoapify.com/v1/geocode/search?text=${urlEncode}&apiKey=${key}`;
            const response = await fetch(url);
            const responseJson = await response.json();

            console.log('cliente - ', responseJson);


            // Agora, calcula a distancia entre a empresa e o cliente
            const distancia = await calcularDistancia(responseJson.features[0].properties.lat, responseJson.features[0].properties.lon, responseJsonEmpresa.features[0].properties.lat, responseJsonEmpresa.features[0].properties.lon)

            if (distancia.status == 'error') {
                return {
                    status: 'error',
                    message: 'Falha ao obter localização. Por favor, selecione outro endereço ou altere o atual.'
                }
            }

            // calcula a distância em KM (a distancia vem em metros da api geo)
            const distanciaKm = (distancia.data.features[0].properties.distance) / 1000; 

            console.log('distanciaKm - ', distanciaKm)

            // obtem qual taxa se adequa a esta distancia
            var ComandoSQLTaxa = await readCommandSql.retornaStringSql('obterValorTaxaPorKm', 'entrega');
            var taxas = await db.Query(ComandoSQLTaxa, { distancia: distanciaKm });

            if (taxas.length > 0) {
                return {
                    status: 'success',
                    taxa: taxas[0].valor,
                }
            }
            else {
                return {
                    status: 'success',
                    taxa: 0
                }
            }            

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter localização. Por favor, selecione outro endereço ou altere o atual.'
            }
        }

    }

    // obtem a distancia entre a loja e o endereço
    const calcularDistancia = async (lat, lon, latLoja, lonLoja) => {

        try {

            const url = `https://api.geoapify.com/v1/routing?waypoints=${latLoja},${lonLoja}|${lat},${lon}&mode=drive&apiKey=${key}`;
            const response = await fetch(url);
            const responseJson = await response.json();

            return {
                status: 'success',
                data: responseJson,
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter localização. Por favor, selecione outro endereço ou altere o atual.',
                ex: ex
            }
        }

    }

    return Object.create({
        calcularTaxaDelivery
    })

}

module.exports = Object.assign({ controllers })