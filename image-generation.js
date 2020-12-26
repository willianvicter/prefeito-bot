const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

let generate = {};

generate.mencaoElogiosa = async function(user_data) {

    let user = user_data.screen_name;
    let user_img = user_data.profile_image_url_https;

    user_img = user_img.replace("normal", "200x200");

    // gera o canvas e o context
    const width = 1024;
    const height = 512;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // adiciona a imagem como background
    let image_bg = await loadImage('images/mencao-molde.png');
    context.drawImage(image_bg, 0, 0);

    //  adiciona a imagem do usuário
    let image_user = await loadImage(user_img);
    context.drawImage(image_user, 80, 60);

    // adiciona o texto título
    context.font = 'normal 33pt Lato';
    context.textAlign = 'right';
    context.fillStyle = '#000';
    context.fillText("MENÇÃO ELOGIOSA", width - 80, 100);

    // adiciona o texto corpo
    context.font = 'normal 23pt Lato';
    context.textAlign = 'right';
    context.fillStyle = '#000';

    let text = {
        "l1p1": "A prefeitura de Itapina atribui menção",
        "l2p1": "elogiosa a ",
        "l2p2": " pela relevância",
        "l3p1": "de seus comentários no Twitter"
    };
    let start = 170;
    let margin = 40;

    context.fillText(text.l1p1, width - 80, start);
    context.fillText(text.l2p1, width - 80 - context.measureText(user).width - 5 - context.measureText(text.l2p2).width, start + margin);
    context.font = 'bold 23pt Lato';
    context.fillText(user, width - 80 - context.measureText(text.l2p2).width, start + margin);
    context.font = 'normal 23pt Lato';
    context.fillText(text.l2p2, width - 80, start + margin);
    context.fillText(text.l3p1, width - 80, start + margin * 2);

    // adiciona a data e cidade
    context.font = 'normal 23pt Lato';
    context.textAlign = 'right';
    context.fillStyle = '#000';

    let date = new Date();
    let monthName = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembr",
        "dezembro"
    ];

    context.fillText("Itapina, " + monthName[date.getMonth()] + " de " + date.getFullYear(), width - 80, 305);

    // cria o buffer e grava a imagem
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./output-img/output.png', buffer);

};

exports.generate = generate;