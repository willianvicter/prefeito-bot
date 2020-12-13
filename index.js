// Importação da biblioteca.
let Twit = require('twit');
require('dotenv').config();
const frases = require("./frases.json");
//const respostas = require("./repostas.json");

//Criação do objeto com as keys.
var bot = new Twit({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

//Criação do twitter
function twittar(){
	// formatação da mensagem(que é pegar a saudação mas a randommsg da função).
	var mensagem = {
		status: randommsg()
	};
	
	//chamando a função para postar
	bot.post('statuses/update', mensagem, feedback);
	
	//função que será executada depois do bot postar
	function feedback(error, response, mensagem, horas){
		console.log("Twitter publicado: "+mensagem);
		console.log("Saudação apresentada: "+saudaçao);
		console.log(error);
	}
}

//Função responsável por gerar mensagem aleatória.
function randommsg(){
	//Verifica o horário do dia para saudar as pessoas.
	var hoje = new Date;
	horas = hoje.getHours();
	saudaçao = "";
	if (horas >= 0 && horas < 12){
		saudaçao = "Bom dia! ";
	}
	else if (horas >= 12 && horas < 18){
		saudaçao = "Boa tarde! ";
	}
	else{
		saudaçao = "Boa noite! ";
	}
	
	//Aqui embaixo acontecerá a mágica do bot gerar as frases aleatórias.
	var i = Math.floor((Math.random() * (frases.prefixo.length-1)) + 0); //Random do Prefixo
	var k = Math.floor((Math.random() * (frases.sufixo.length-1)) + 0); //Random do Sufixo
	//var i = frases.prefixo.length;
	//var k = frases.sufixo.length;
	return saudaçao+frases.prefixo[i]+frases.sufixo[k];
}

function gerarTeste(){
	for(var i = 0; i < 100; i++){
		console.log(randommsg());
	};
}
/*
var stream = bot.stream('user');
stream.on('tweet', tweetEvent);

function tweetEvent(tweet) {
    // Who is this in reply to?
    var reply_to = tweet.in_reply_to_screen_name;
    // Who sent the tweet?
    var name = tweet.user.screen_name;
    // What is the text?
    var txt = tweet.text;
    // If we want the conversation thread
    var id = tweet.id_str;

    // Ok, if this was in reply to me
    // Tweets by me show up here too
    if (reply_to === 'pref_itapina') {

      // Get rid of the @ mention
      txt = txt.replace(/@pref_itapina/g,'');

      // Start a reply back to the sender
      var replyText = '@'+name + ' ';
      // Reverse their text
      for (var i = txt.length-1; i >= 0; i--) {
        replyText += txt.charAt(i);
      }

      // Post that tweet
      T.post('statuses/update', { status: replyText, in_reply_to_status_id: id}, tweeted);

      // Make sure it worked!
      function tweeted(err, reply) {
        if (err) {
          console.log(err.message);
        } else {
          console.log('Tweeted: ' + reply.text);
        }
      }
    }
}*/

//Tempo do publicação do Twitter
//setInterval(twittar, 60*60*6000); //Setado para 6h
twittar();