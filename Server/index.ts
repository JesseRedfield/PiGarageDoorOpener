import express from "express";
import * as path from "path";
import { Configuration } from "./config";
import { pinState, providerType, IProviderDictionary } from "./provider";
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

  var providers = {} as IProviderDictionary;

  providers[providerType.i2c] = new i2cProvider();
  providers[providerType.i2c].open();
  providers[providerType.gpio] = new gpioProvider();
  providers[providerType.gpio].open();

  config.garageDoors.forEach((door) => {
    providers[door.outputProvider]?.enable_write_pin(
      door.outputPin,
      door.outputTriggerState
    );
    providers[door.outputProvider]?.enable_read_pin(
      door.inputPin,
      door.inputOpenDoorState
    );
  });

  config.lights.forEach((light) => {
    providers[light.provider]?.enable_write_pin(light.pin, light.triggerState);
  });

  /// STARTUP EXPRESS
  var app = express();
  app.use(cors());
  app.use(express.static(HTML_PATH));

  /// DOORS
  app.get("/api/doors/:key", async (req, res) => {
    try {
      if (req.params?.key != config.apiKey) {
        res.status(403);
        res.send("Access Denied");
        return;
      }

      const doors = config.garageDoors.map((door) => {
        return {
          name: door.doorName,
          description: door.doorDescription,
          isOpen:
            providers[door.inputProvider]?.get(door.inputPin) ===
            door.inputOpenDoorState,
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
        providers[door.outputProvider]?.set(
          door.outputPin,
          door.outputTriggerState
        );
        rpio.msleep(1000);
        providers[door.outputProvider]?.set(
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

  app.get("/api/lights/:key", async (req, res) => {
    try {
      if (req.params?.key != config.apiKey) {
        res.status(403);
        res.send("Access Denied");
        return;
      }

      const lights = config.lights.map((light) => {
        return {
          name: light.lightName,
          description: light.lightDescription,
          isOn:
            providers[light.provider]?.get(light.pin) === light.triggerState,
        };
      });

      res.status(200);
      res.contentType("json");
      res.send(JSON.stringify(lights));
    } catch (ex) {
      res.status(500);
      res.contentType("json");
      res.send(JSON.stringify(ex));
    }
  });

  app.get("/api/switch/:key/:lightName", async (req, res) => {
    try {
      if (req.params?.key != config.apiKey) {
        res.status(403);
        res.send("Access Denied");
        return;
      }
      const light = config.lights.find(
        (light) =>
          light.lightName.toLowerCase() === req.params?.lightName.toLowerCase()
      );

      if (light) {
        const newVal =
          providers[light.provider]?.get(light.pin) == pinState.LOW
            ? pinState.HIGH
            : pinState.LOW;

        providers[light.provider]?.set(light.pin, newVal);

        res.status(200);
        res.contentType("json");
        res.send(JSON.stringify(`Light: ${req.params?.lightName} Triggered`));
      } else {
        res.status(400);
        res.contentType("json");
        res.send(JSON.stringify(`Light: ${req.params?.lightName} Not Found`));
      }
    } catch (ex) {
      res.status(500);
      res.contentType("json");
      res.send(JSON.stringify(ex));
    }
  });

  app.get("/api/status/:key", async (req, res) => {
    try {
      if (req.params?.key != config.apiKey) {
        res.status(403);
        res.send("Access Denied");
        return;
      }

      const doors = config.garageDoors.map((door) => {
        return {
          type: "door",
          name: door.doorName,
          description: door.doorDescription,
          isOpen:
            providers[door.inputProvider]?.get(door.inputPin) ===
            door.inputOpenDoorState,
        };
      });

      const lights = config.lights.map((light) => {
        return {
          type: "light",
          name: light.lightName,
          description: light.lightDescription,
          isOn:
            providers[light.provider]?.get(light.pin) === light.triggerState,
        };
      });
      res.status(200);
      res.contentType("json");
      res.send(JSON.stringify([...doors, ...lights]));
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

  var intervalID = setInterval(() => {
    config.lights.forEach((light) => {
      const currentTime = new Date().getHours() * 60 + new Date().getMinutes();
      const onDate = new Date("1970-01-01T" + light.scheduleOn);
      const offDate = new Date("1970-01-01T" + light.scheduleOff);

      if (onDate.getHours() && offDate.getHours()) {
        const onTime = onDate.getHours() * 60 + onDate.getMinutes();
        const offTime = offDate.getHours() * 60 + offDate.getMinutes();

        if (onTime < currentTime && offTime > currentTime) {
          if (!light.timerOn) {
            providers[light.provider]?.set(light.pin, light.triggerState);
            light.timerOn = true;
          }
        } else {
          if (light.timerOn) {
            providers[light.provider]?.set(
              light.pin,
              light.triggerState == pinState.HIGH ? pinState.LOW : pinState.HIGH
            );
            light.timerOn = false;
          }
        }
      }
    });
  }, 60 * 1000);

  process.on("SIGTERM", () => {
    console.log("Exiting");
    providers[providerType.i2c].close();
    providers[providerType.gpio].close();
  });
}

main();
