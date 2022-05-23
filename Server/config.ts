import * as fs from "fs";
import { pinState, providerType } from "./provider";

export type Light = {
  lightName: string;
  lightDescription: string;
  pin: number;
  provider: providerType;
  triggerState: pinState;
  scheduleOn: string;
  scheduleOff: string;
  timerOn: boolean;
};

export type GarageDoor = {
  doorName: string;
  doorDescription: string;
  inputPin: number;
  inputProvider: providerType;
  inputOpenDoorState: pinState;
  outputPin: number;
  outputProvider: providerType;
  outputTriggerState: pinState;
};

export class Configuration {
  garageDoors: GarageDoor[] = [];
  lights: Light[] = [];
  port: number = 80;
  apiKey: string = "";

  save(path: string): void {
    fs.writeFileSync(path, JSON.stringify(this), "utf-8");
  }

  load(path: string): void {
    const data = fs.readFileSync(path, "utf-8");
    const configuration = JSON.parse(data) as Configuration;
    configuration.lights.forEach((light) => (light.timerOn = false));

    this.garageDoors = configuration.garageDoors;
    this.lights = configuration.lights;
    this.port = configuration.port;
    this.apiKey = configuration.apiKey;
  }
}
