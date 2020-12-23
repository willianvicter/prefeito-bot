// Nome de usuário do perfil
let usuario = 'pref_itapina'

// Importação da biblioteca.
let Twit = require('twit');
require('dotenv').config();
var schedule = require('node-schedule');

// Importa os arquivos com as frases
const frases = require("./frases.json");
//const respostas = require("./repostas.json");

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

// Modelos de Frases
let modelo = [
    ["ambientacao", "amb_complemento", "acao", "coisa", "sinal", "conclusao"],
    ["ambientacao", "acao", "coisa", "lugar", "sinal"],
    ["ambientacao", "condicao", "conclusao"],
    ["coisa", ",", "ambientacao", "coisa_apontar", "quer", "acao", "coisa_apontar", "sinal"],
    ["condicao", "conclusao"]
];

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

    if (horas >= 0 && horas < 12) {
        return "Bom dia! ";
    } else if (horas >= 12 && horas < 18) {
        return "Boa tarde! ";
    } else {
        return "Boa noite! ";
    }

}

// Função responsável por gerar mensagem aleatória.
function randommsg() {

    let msg = getSaudacao();
    let verbo, sujeito, adjetivo;

    function gerarPartes() {
        verbo = frases.verbo[Math.floor(Math.random() * frases.verbo.length)];
        sujeito = frases.sujeito[Math.floor(Math.random() * frases.sujeito.length)];
        adjetivo = frases.adjetivo[Math.floor(Math.random() * frases.adjetivo.length)];
    }

    let inicio = frases.molde.inicio[Math.floor(Math.random() * frases.molde.inicio.length)];
    let fim = frases.molde.fim[Math.floor(Math.random() * frases.molde.fim.length)];

    // Substituir placeholders do inicio pelos atuais verbos, sujeitos e adjetivos
    gerarPartes();
    inicio = inicio.replace("$verbo", verbo);
    inicio = inicio.replace("$sujeito", sujeito);
    inicio = inicio.replace("$adjetivo", adjetivo);

    // Substituir placeholders do fim pelos atuais verbos, sujeitos e adjetivos
    gerarPartes();
    fim = fim.replace("$verbo", verbo);
    fim = fim.replace("$sujeito", sujeito);
    fim = fim.replace("$adjetivo", adjetivo);

    msg += inicio + " " + fim;

    return msg;

}

function gerarTeste() {
    for (var i = 0; i < 10; i++) {
        console.log(randommsg());
    };
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
    replyText += name + ', ' + getSaudacao().toLowerCase() + randommsg();

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

// Aqui onde a mágica acontece

// gerarTeste();

// let rule = new schedule.RecurrenceRule();

// rule.hour = [11, 13, 15, 17, 19, 21, 23];
// rule.minute = 0;

// let event = schedule.scheduleJob(rule, function(){
// 	twittar();
// });