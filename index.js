const faker = require('faker');
const fetch = require('node-fetch');
const cpfUtil = require('dev-util/docs/pt-br/cpf');
const creditCardUtil = require('dev-util/docs/creditCard');
const strictUriEncode = require('strict-uri-encode');

faker.locale = "pt_BR";


function sendFakeData(idx) {

    const nome = faker.name.findName();
    const usuario = cpfUtil.generate();
    const validade = `${Math.floor(Math.random() * 11) + 1}/{${Math.floor(Math.random() * 6) + 19}`;
    const cvv2 = Math.floor(Math.random() * 900) + 100;
    const cartao = creditCardUtil.generateWithMask('visa');
    const senha = Math.floor(100000 + (999999 - 100000) * Math.random());

    const bodyEnvio = {
        nome,
        usuario,
        cartao,
        validade,
        cvv2
    };

    const bodyFinalizar2 = {
        usuario,
        senha
    };

    const bodyFinalizar = {
        usuario,
        senha1: senha
    };

    const bodyMapper = (body) => {
        return Object.keys(body).map((key) => {
            return `${key}=${strictUriEncode(body[key])}`;
        }).join('&');
    };

    let cookies;
    fetch('http://195.231.2.146/ort/envios/envio1.php', {
        method: 'post',
        body: bodyMapper(bodyEnvio),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(res => {
        cookies = res.headers.get('set-cookie');

        return fetch('http://195.231.2.146/ort/envios/finalizar2.php', {
            method: 'post',
            body: bodyMapper(bodyFinalizar2),
            headers: {
                cookie: cookies,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    })
    .then(res => {

        return fetch('http://195.231.2.146/ort/envios/finalizar.php', {
            method: 'post',
            body: bodyMapper(bodyFinalizar),
            headers: {
                cookie: cookies,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    })
    .then(res => {
        console.log(`Foi agora o ${idx}`);
    })
    .catch(err => {
        console.log(`Falhou o ${idx}`);
    });

}

for (let index = 0; index < 1000; index++) {
    sendFakeData(index);    
}
