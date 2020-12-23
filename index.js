// Nome de usuário do perfil
let usuario = 'pref_itapina'

// Importação da biblioteca.
let Twit = require('twit');
require('dotenv').config();
var schedule = require('node-schedule');
const fs = require('fs');

// Importa os arquivos com as frases
const frases = require("./frases.json");

// Importa arquivo com funções
const image = require('./image-generation.js');

// Criação do objeto com as keys.
var bot = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

// Configura a Stream e chama a função tweetEvent() quando mencionado
var stream = bot.stream('statuses/filter', { track: '@' + usuario });
stream.on('tweet', tweetEvent);

//Criação do tweet
function twittar() {
    // formatação da mensagem(que é pegar a saudação mas a randommsg da função).

    let msg = getSaudacao() + randommsg();

    var mensagem = {
        status: msg
    };

    //chamando a função para postar
    bot.post('statuses/update', mensagem, feedback);

    //função que será executada depois do bot postar
    function feedback(error, response, mensagem, horas) {
        console.log("Twitter publicado: " + mensagem);
        console.log("Saudação apresentada: " + getSaudacao());
        console.log(error);
    }
}

// Função que verifica o horário do dia para saudar as pessoas.
function getSaudacao() {

    var hoje = new Date;
    horas = hoje.getHours();

    if (horas >= 7 && horas < 15) {
        return "Bom dia! ";
    } else if (horas >= 15 && horas < 21) {
        return "Boa tarde! ";
    } else {
        return "Boa noite! ";
    }

}

// Função responsável por gerar mensagem aleatória.
function randommsg() {
    //Aqui embaixo acontecerá a mágica do bot gerar as frases aleatórias.
    var i = Math.floor((Math.random() * (frases.prefixo.length - 1)) + 0); //Random do Prefixo
    var k = Math.floor((Math.random() * (frases.sufixo.length - 1)) + 0); //Random do Sufixo
    return frases.prefixo[i] + frases.sufixo[k];
}

function gerarTeste() {
    /*for (var i = 0; i < 100; i++) {
    	console.log(randommsg());
    };*/
    /*for (var i = 0; i < 100; i++) {
    	console.log(getSaudacao().toLowerCase() + frases.respostas[Math.floor(Math.random() * (frases.respostas.length - 1))]);
    };*/
}

function tweetEvent(eventMsg) {

    // Para quem mandar o tweet?
    var name = eventMsg.user.screen_name;

    // A thread da conversa
    var id = eventMsg.id_str;

    console.log('tweet recebido de outra conta: ', name);

    // Adicina a menção
    var replyText = '@' + name + ' ';

    // Adicina a saudação com o user e o texto
    replyText += name + ', ' + frases.respostas[Math.floor(Math.random() * (frases.respostas.length - 1))];

    // Faz o tweet
    bot.post('statuses/update', { status: replyText, in_reply_to_status_id: id }, tweeted);

    // Confirma se tudo está funcionando!
    function tweeted(err, reply) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Tweeted: ' + reply.text);
        }
    }

}


// obtem os dados do suário informado e passa como parâmetro para o post da Menção
bot.get('users/show', { screen_name: 'ratosbot' }, (err, data) => { postMencao(data) });

async function postMencao(data) {

    let name = data.screen_name;

    // espera para a imagem ser gerada
    await image.generate.mencaoElogiosa(data);

    // após a imagem gerada, lê do arquivo
    let b64content = fs.readFileSync('output-img/output.png', { encoding: 'base64' });

    // faz o upload e posta com a legenda
    bot.post('media/upload', { media_data: b64content }, (err, data, response) => {
        let status = "Você merece, " + name + "! #itapina";
        let mediaIdStr = data.media_id_string;
        let meta_params = { media_id: mediaIdStr };

        bot.post('media/metadata/create', meta_params, (err, data, response) => {
            if (!err) {
                let params = { status: status, media_ids: [mediaIdStr] }

                bot.post('statuses/update', params, (err, data) => {
                    console.log("Tweet com mídia postado: @" + name);
                });
            }
        });

    });

}

// let rule = new schedule.RecurrenceRule();

// rule.hour = [3, 6, 9, 12, 15, 18, 21, 24];
// rule.minute = 0;

// let event = schedule.scheduleJob(rule, function() {
//     twittar();
// })