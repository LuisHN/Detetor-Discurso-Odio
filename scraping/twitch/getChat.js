
const tmi = require('tmi.js');

fs = require('fs');

var time = Date.now || function() {
    return +new Date;
  };
const time_ =  time();

const client = new tmi.Client({
	channels: [ 'rtparenacsgo', 'gaules',  'cesarvsc', 'diogoesteves91', 'micael__almeida_', 'esl_csgo', 'blxckoutz' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// "Alca: Hello, World!"
	console.log(`${tags['display-name']}: ${message}`);
    fs.appendFile(`outputs/${channel}_${time_}.txt`, message +"\r\n", function (err) {
        if (err) throw err; 
      });
});

