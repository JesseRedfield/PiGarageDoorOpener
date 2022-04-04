import * as fs from "fs";

export enum pinState {
    LOW = 0,
    HIGH = 1
};

export type GarageDoor = {
    doorName: string,
    doorDescription: string,
    inputPin: number,
    inputOpenDoorState: pinState,
    outputPin: number,
    outputTriggerState: pinState,
};

export class Configuration {
    garageDoors: GarageDoor[] = [];
    port: number = 80;
    apiKey: string = "";

    save(path: string): void {
        fs.writeFileSync(path, JSON.stringify(this), "utf-8");
    };

    load(path: string): void {
        const data = fs.readFileSync(path, "utf-8");
        const configuration = JSON.parse(data) as Configuration;

        this.garageDoors = configuration.garageDoors;
        this.port = configuration.port;
        this.apiKey = configuration.apiKey;
    }
}

