import express from 'express';
import * as path from 'path';
const rpio = require('rpio');


async function main() {
    const PORT = 9000;
    const HTML_PATH = path.resolve(__dirname, "Client");
    const PIN = 26;
    var rpio_options = {
      gpiomem: true,          /* Use /dev/gpiomem */
      mapping: 'gpio',        /* Use the gpio numbering scheme */
      mock: undefined,        /* Emulate specific hardware in mock mode */
      close_on_exit: true,    /* On node process exit automatically close rpio */
    };

    rpio.init(rpio_options);

    var app = express();

    app.use(express.static(HTML_PATH));
  
    /* Flash LED */
    app.get("/api/flash", async (_, res) => {
      try {
        var count = 5;
        var blinkInterval = setInterval(() => {
            if (rpio.read(PIN) === 0) { //check the pin state, if the state is 0 (or off)
                rpio.write(PIN, rpio.HIGH);
                count--;
            } else {
                rpio.write(PIN, rpio.LOW); //set pin state to 0 (turn LED off)
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