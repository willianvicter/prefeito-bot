// Nome de usuário do perfil
let usuario = 'pref_itapina'

// Importação da biblioteca.
let Twit = require('twit');
require('dotenv').config();

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
var stream = bot.stream('statuses/filter', { track: '@'+usuario });
stream.on('tweet', tweetEvent);

//Criação do tweet
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

// Função que verifica o horário do dia para saudar as pessoas.
function getSaudacao(){

	var hoje = new Date;
	horas = hoje.getHours();

	if (horas >= 0 && horas < 12){
		return "Bom dia! ";
	}
	else if (horas >= 12 && horas < 18){
		return "Boa tarde! ";
	}
	else{
		return "Boa noite! ";
	}

}

// Função responsável por gerar mensagem aleatória.
function randommsg(){
	//Obtem a saudação
	saudaçao = getSaudacao();
	
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

function tweetEvent(eventMsg) {

    // para quem vou responder?
    var reply_to = eventMsg.in_reply_to_screen_name;
    // Para quem mandar o tweet?
    var name = eventMsg.user.screen_name;
    // Qual é o texto
    var txt = eventMsg.text;
    // Se quisermos a thread da conversa
    var id = eventMsg.id_str;

    console.log('tweet recebido de outra conta: ', name);

    // se for uma resposta pra mim...
    if (reply_to === usuario) {

		// remover a mention
		replace = '/@' + usuario + '/g';
        txt = txt.replace(replace,'');
  
        // Começa uma resposta de volta ao remetente
		var replyText = '@' + name + ' ';
		// Adicina a saudação com o user
		replyText += reply_to + ', ' + getSaudacao();
  
        // Faz o tweet
        bot.post('statuses/update', { status: replyText, in_reply_to_status_id: id}, tweeted);
  
        // Confirma se tudo está funcionando!
        function tweeted(err, reply) {
          if (err) {
            console.log(err.message);
          } else {
            console.log('Tweeted: ' + reply.text);
          }
        }
      }

}


//Tempo do publicação do Twitter
//setInterval(twittar, 60*60*6000); //Setado para 6h
//twittar();