var TelegramBot = require('node-telegram-bot-api');
var request = require('request');
var http = require('http');
var express = require("express");
var bodyParser = require("body-parser");
var rg = require("./Controllers/registrationcontroller")
var bc = require("./Controllers/balancecontroller.js")

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const TOKEN = process.env.TELEGRAM_TOKEN || '397953885:AAEk3Tm1dOLfmfUSE0H9429QZUnIzVIg7vA';
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello, world! [helloworld sample;');
}).listen(3009);


telegram = new TelegramBot(TOKEN, { polling: true });

telegram.on("text",function (message,req,res) {


    var messagetext = message.text;
    var receiver = message.chat.id; //the user receiving the response from the bot
    var timestamp = message.date; //timestamp
    var msgid = message.message_id;//message id
    var sender = message.from.id; //id of the telegram bot

    messagetext = messagetext.toLowerCase();


    if(messagetext=== 'menu'){
        console.log(messagetext);
        var menu =["Registration","Balance","Summary"];



        var options = {
            reply_markup: JSON.stringify({
                inline_keyboard: menu.map((x, xi) => ([{
                    text: x,
                    callback_data: String(x),
                }])),
        }),
    };
        telegram.sendMessage(sender, "Here are some of the menus", options);

    }

});

telegram.on('callback_query', function (msg) {
   // console.log(msg); // msg.data refers to the callback_data
    var msg_val = msg.data.toLowerCase();
    var senderid = msg.from.id;

    switch (msg_val) {

        case 'registration':
            //first check if the id is already registered
           rg.isUserRegistered(senderid).then(function (v) {

               var obj = JSON.parse(v);

               if(obj.isallowed==='yes')
               {
                   telegram.sendMessage(senderid, "Your telegram ID is already registered. Kindly try other functionalities");
                   telegram.answerCallbackQuery(msg.id);

               }

               else{
                   telegram.sendMessage(senderid, "Your telegram ID is not registered,Kindly contact your bank");
                   telegram.answerCallbackQuery(msg.id);

               }

           });

            break;

        case 'balance':
           bc.getbalance(senderid).then(function (v) {

                var obj = JSON.parse(v);

                if(obj.balance!='-1')
                {
                    var balance = obj.balance;
                    var date = obj.date;
                    telegram.sendMessage(senderid, "Your balance is"+balance + "::"+ "date"+date );
                    telegram.answerCallbackQuery(msg.id);

                }

                else{
                    telegram.sendMessage(senderid, "Your telegram ID is not registered,Kindly contact your bank");
                    telegram.answerCallbackQuery(msg.id);

                }

            });
            break;

        case 'summary':

            break;


    }

});








