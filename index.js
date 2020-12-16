// Nome de usuário do perfil
let usuario = 'pref_itapina'

// Importação da biblioteca.
let Twit = require('twit');
require('dotenv').config();
var schedule = require('node-schedule');

// Importa os arquivos com as frases
const frases = require("./frases.json");

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
	}
	else if (horas >= 15 && horas < 21) {
		return "Boa tarde! ";
	}
	else {
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

let rule = new schedule.RecurrenceRule();

rule.hour = [3, 6, 9, 12, 15, 18, 21, 24];
rule.minute = 0;

let event = schedule.scheduleJob(rule, function(){
	twittar();
});