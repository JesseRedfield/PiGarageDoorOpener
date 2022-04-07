import express from "express";
import * as path from "path";
import { Configuration, pinState } from "./config";
import { i2cProvider } from "./i2cProvider";
import { gpioProvider } from "./gpioProvider";
const rpio = require("rpio");
const cors = require("cors");

async function main() {
  /// LOAD CONFIGURATION
  const config = new Configuration();
  config.load("config.json");
  const HTML_PATH = path.resolve(__dirname, "Client");

  /// CONFIGURE RPIO
  rpio.init({
    gpiomem: false /* Use /dev/gpiomem */,
    mapping: "gpio" /* Use the gpio numbering scheme */,
    mock: undefined /* Emulate specific hardware in mock mode */,
    close_on_exit: true /* On node process exit automatically close rpio */,
  });

  const provider = new i2cProvider();

  provider.open();
  config.garageDoors.forEach((door) => {
    provider.enable_pin(door.inputPin, door.outputTriggerState);
    rpio.open(
      door.inputPin,
      rpio.INPUT,
      door.inputOpenDoorState == pinState.HIGH ? pinState.LOW : pinState.HIGH
    );
  });

  /// STARTUP EXPRESS
  var app = express();
  app.use(cors());
  app.use(express.static(HTML_PATH));

  app.get("/api/doors/:key", async (req, res) => {
    try {
      if (req.params?.key != config.apiKey) {
        res.status(403);
        res.send("Access Denied");
        return;
      }

      const doors = config.garageDoors.map((door) => {
        return {
          doorName: door.doorName,
          doorDescription: door.doorDescription,
          isOpen: rpio.read(door.inputPin) === door.inputOpenDoorState,
        };
      });

      res.status(200);
      res.contentType("json");
      res.send(JSON.stringify(doors));
    } catch (ex) {
      res.status(500);
      res.contentType("json");
      res.send(JSON.stringify(ex));
    }
  });

  app.get("/api/trigger/:key/:doorName", async (req, res) => {
    try {
      if (req.params?.key != config.apiKey) {
        res.status(403);
        res.send("Access Denied");
        return;
      }
      const door = config.garageDoors.find(
        (door) =>
          door.doorName.toLowerCase() === req.params?.doorName.toLowerCase()
      );

      if (door) {
        provider.set(door.outputPin, door.outputTriggerState);
        rpio.msleep(1000);
        provider.set(
          door.outputPin,
          door.outputTriggerState == pinState.HIGH
            ? pinState.LOW
            : pinState.HIGH
        );

        res.status(200);
        res.contentType("json");
        res.send(JSON.stringify(`Door: ${req.params?.doorName} Triggered`));
      } else {
        res.status(400);
        res.contentType("json");
        res.send(JSON.stringify(`Door: ${req.params?.doorName} Not Found`));
      }
    } catch (ex) {
      res.status(500);
      res.contentType("json");
      res.send(JSON.stringify(ex));
    }
  });

  console.log(
    `Listening on Port ${config.port} hosting files from path ${HTML_PATH}`
  );

  app.listen(config.port, () => {});

  process.on("SIGTERM", () => {
    provider.close();
  });
}

main();
