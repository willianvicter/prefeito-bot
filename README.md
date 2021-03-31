# Prefeito Bot

Apenas um prefeito tuiteiro - é o que todo mundo pensava.
Na verdade, Prefeito Bot é uma aplicação NodeJS de código aberto.

Está ficialmente em @pref_itapina no twitter, sempre pronto para compartilhar
um devaneio ou responder algumas marcações.

## Instalação

Primeiro baixe o código na sua máquina equipada com o git e npm:

`git clone https://github.com/willianvicter/prefeito-bot.git`

Entre no diretório do projeto e faça o download das dependências do Node:

`npm install`

Crie um arquivo chamado `.env` e cole o conteúdo de `.env-example`, completando
com as chaves da api do twitter que você possui.

Execute com:

`node index.js`

## Sobre a integração com o Dialogflow

Para funcionar corretamente, deverá existir um projeto configurado no [Dialogflow](dialogflow.cloud.google.com) e as chaves de acesso estarem no arquivo `.env`.

Por padrão, ao baixar as chaves, o arquivo será único. Para poder atualizar e inserir os campos necessários, deve-se extrair do documento as informações necessárias de acordo com o `.env-example`.

## Respostas com Imagem

O Bot está configurado de maneira que, se não houver resposta pré configurada no Dialogflow, haverá a chance de tuitar uma imagem com um "certificado" com a foto do usuário. A configuração da imagem está localizada em `src/img_canvas.js`.

## Sugerir frases

Atualmente, ainda não temos um formulário para envio de sugestões, mas você pode
criar uma issue :) 
