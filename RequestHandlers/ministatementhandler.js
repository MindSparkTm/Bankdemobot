var bodyParser = require('body-parser');
var request = require('request');
var http = require('http');


module.exports = {


    getsummary: function (senderid, callback) {


        return new Promise(function (resolve, reject) {


            request({
                url: 'https://e39832df.ngrok.io/transactionsummary?senderid=' + senderid,
                method: "GET"

            }, function (error, resp, body) {

                console.log(body);

                resolve(body);


            });
        });


    }
}
