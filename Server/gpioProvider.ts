import { pinState } from "./config";
const rpio = require("rpio");

export class gpioProvider {
  pins: number[] = [];

  open() {
    rpio.i2cBegin();
    rpio.i2cSetSlaveAddress(0x10);
  }

  close() {
    rpio.i2cEnd();
  }

  enable_pin(pin: number, onState: pinState) {
    rpio.open(
      pin,
      rpio.OUTPUT,
      onState == pinState.HIGH ? pinState.LOW : pinState.HIGH
    );
    this.pins.push(pin);
  }

  disable_pin(pin: number) {
    rpio.close(pin, rpio.PIN_RESET);
    this.pins = this.pins.filter((p) => p != pin);
  }

  set(pin: number, value: pinState) {
    rpio.write(pin, value);
  }
}
