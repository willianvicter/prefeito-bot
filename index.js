// Importação da biblioteca.
let Twit = require('twit');
require('dotenv').config();
var schedule = require('node-schedule');
const fs = require('fs');

// Importa códigos específicos
const frases = require("./frases.json");
const dialogflow = require("./src/dialogflow.js");
const logfile = require("./src/utils/log.js");
const image = require("./src/img_canvas.js");

// Criação de objetos especiais
let dialog = new dialogflow.DialogFlow();
let dialoglog = new logfile.LogFile("dialogflow_log");

// Criação do objeto com as keys.
var bot = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

// Configura a Stream e chama a função tweetEvent() quando mencionado
var stream = bot.stream('statuses/filter', { track: '@' + process.env.USUARIO });
stream.on('tweet', tweetEvent);

//Criação do tweet
function twittar() {
    // formatação da mensagem(que é pegar a saudação mas a randommsg da função).

    let msg = getSaudacao() + randommsg();
    /*for (var i = 0; i < 100; i++) {
    	console.log(getSaudacao().toLowerCase() + frases.respostas[Math.floor(Math.random() * (frases.respostas.length - 1))]);
    };*/
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

// Função conversa com log do DialogFlow
async function conversa(query) {
    let answer = await dialog.sendDialog(query);
    dialoglog.pushLog(answer);
    return answer;
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
    for (var i = 0; i < 100; i++) {
        console.log(randommsg());
    };
}

function postMencaoElogiosa(eventMsg) {

    // Para quem mandar o tweet?
    let user = eventMsg.user.screen_name;

    // Id da conversa
    let id = eventMsg.id_str;

    // obtem os dados do suário informado e passa como parâmetro para o post da Menção
    bot.get('users/show', { screen_name: user }, (err, data) => { postMencao(data, id) });

    async function postMencao(data, id_answ) {

        // Consegue o nome do usuário
        let name = data.screen_name;

        // espera para a imagem ser gerada
        await image.generate.mencaoElogiosa(data);

        // após a imagem gerada, lê do arquivo
        let b64content = fs.readFileSync('images/output/mencao_elogiosa.png', { encoding: 'base64' });

        // faz o upload e posta com a legenda
        bot.post('media/upload', { media_data: b64content }, (err, data, response) => {
            let status = "@" + name + " Você merece, " + name + "! #itapina";
            let mediaIdStr = data.media_id_string;
            let meta_params = { media_id: mediaIdStr };

            bot.post('media/metadata/create', meta_params, (err, data, response) => {
                if (!err) {
                    let params = {
                        status: status,
                        in_reply_to_status_id: id_answ,
                        media_ids: [mediaIdStr],
                        lat: -19.534181234087324,
                        long: -40.81335561845036
                    }

                    bot.post('statuses/update', params, (err, data) => {
                        console.log("Tweeted: Tweet com mídia postado em resposta a " + name);
                    });
                }
            });

        });

    }

}

function postRespostaTexto(eventMsg, answer) {

    // Para quem mandar o tweet?
    var name = eventMsg.user.screen_name;

    // A thread da conversa
    var id = eventMsg.id_str;

    console.log('tweet recebido de outra conta: ', name);

    // Adicina a menção
    var replyText = '@' + name + ' ';

    // Adicina a saudação com o user e o texto
    replyText += name + ", " + answer;

    // Faz o tweet
    let params = {
        status: replyText,
        in_reply_to_status_id: id,
        lat: -19.53290953884859,
        long: -40.817264900673656
    }

    bot.post('statuses/update', params, tweeted);

    // Confirma se tudo está funcionando!
    function tweeted(err, reply) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Tweeted: ' + reply.text);
        }
    }

}

function postRespostaSimples(eventMsg) {

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
    let params = {
        status: replyText,
        in_reply_to_status_id: id,
        lat: -19.53290953884859,
        long: -40.817264900673656
    }

    bot.post('statuses/update', params, tweeted);

    // Confirma se tudo está funcionando!
    function tweeted(err, reply) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Tweeted: ' + reply.text);
        }
    }

}

// Lida com o evento de marcação
async function tweetEvent(eventMsg) {

    let query = eventMsg.text;

    // Se livrar da @ menção
    query = query.replace(/@krausebot/g, '');

    let dialog = await conversa(query);

    // Se cair em algo que o dialogflow não sabe, uma frase genérica
    if (dialog.intent != "Default Fallback Intent") {

        postRespostaTexto(eventMsg, dialog.answer);

    } else {

        let situacao = [
            "simples",
            "mencaoElogiosa"
        ];
        let chances = [
            95,
            5
        ];

        let sorteio = [];

        for (let i = 0; i < chances.length; i++) {
            for (let j = 0; j < chances[i]; j++) {
                sorteio.push(situacao[i]);
            }
        }

        let sorteado = sorteio[Math.floor(Math.random() * sorteio.length)];

        if (sorteado == "simples") postRespostaSimples(eventMsg);
        else if (sorteado == "mencaoElogiosa") postMencaoElogiosa(eventMsg);

    }
}

// Aqui começa tudo
let rule = new schedule.RecurrenceRule();

rule.hour = [3, 6, 9, 12, 15, 18, 21, 24];
rule.minute = 0;

let event = schedule.scheduleJob(rule, function() {
    twittar();
})