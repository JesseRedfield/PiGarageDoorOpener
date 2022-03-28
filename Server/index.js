var express = require('express');
var path = require('path');
var Gpio = require('onoff').Gpio;

async function main() {
    const PORT = 9000;
    const HTML_PATH = path.resolve(__dirname, "Client");

    var app = express();
  
    var LED = new Gpio(26, 'out'); 

    app.use(express.static(HTML_PATH));
  
    /* Flash LED */
    app.get("/api/flash", async (_, res) => {
      try {
        var count = 5;
        blinkInterval = setInterval(() => {
            if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
                LED.writeSync(1); //set pin state to 1 (turn LED on)
                count--;
            } else {
                LED.writeSync(0); //set pin state to 0 (turn LED off)
                if(count < 0) clearInterval(blinkInterval);
            }
            
        }, 250); //run the blinkLED function every 250ms

        res.status(200);
        res.contentType("json");
        res.send(JSON.stringify("success"));
      } catch (ex) {
        res.status(500);
        res.contentType("html");
        res.send(JSON.stringify(ex));
      }
    });
  
    console.log(
      `Listening on Port ${PORT} hosting files from path ${HTML_PATH}`
    );
  
    app.listen(PORT, () => {});
  }
  
  main();