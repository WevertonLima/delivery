const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql.js');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    // obtem a rota (lat, long) e calcula a taxa do delivery por km (se for taxa por distancia)
    const calcularTaxaDelivery = async (req) => {

        try {

            const endereco = req.body.endereco;
            const urlEncode = encodeURI(endereco);

            var _error = false;

            const url = `https://api.geoapify.com/v1/geocode/search?text=${urlEncode}&apiKey=1c4f6098b8144c3aa91d9055eeb4917b`;
            const response = await fetch(url);
            const responseJson = await response.json();
            
            console.log(responseJson);

            if (_error) {
                return {
                    status: 'error',
                    message: 'Falha ao obter localização. Por favor, selecione outro endereço ou altere o atual.'
                }
            }

            const distancia = await calcularDistancia(responseJson.features[0].properties.lat, responseJson.features[0].properties.lon)

            if (distancia.status == 'error') {
                return {
                    status: 'error',
                    message: 'Falha ao obter localização. Por favor, selecione outro endereço ou altere o atual.'
                }
            }

            return {
                status: 'success',
                data: distancia.data,
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
    const calcularDistancia = async (lat, lon) => {

        try {

            const latLoja = -20.940207;
            const lonLoja = -48.460933;

            var _error = false;

            const url = `https://api.geoapify.com/v1/routing?waypoints=${latLoja},${lonLoja}|${lat},${lon}&mode=drive&apiKey=1c4f6098b8144c3aa91d9055eeb4917b`;
            const response = await fetch(url);
            const responseJson = await response.json();
            
            console.log(responseJson);

            if (_error) {
                return {
                    status: 'error',
                }
            }

            return {
                status: 'success',
                data: responseJson,
            }

        } catch (ex) {
            console.log(ex);
            return {
                status: 'error',
                message: 'Falha ao obter localização. Por favor, selecione outro endereço ou altere o atual.'
            }
        }

    }

    return Object.create({
        calcularTaxaDelivery
    })

}

module.exports = Object.assign({ controllers })