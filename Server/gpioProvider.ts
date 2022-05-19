import { provider, pinState} from "./provider";

const rpio = require("rpio");

export class gpioProvider implements provider {
  pins: number[] = [];

  open() {

  }

  close() {
    this.pins.forEach(pin => {
      this.disable_pin(pin);
    });
  }

  enable_write_pin(pin: number, onState: pinState) {
    rpio.open(
      pin,
      rpio.OUTPUT,
      onState == pinState.HIGH ? pinState.LOW : pinState.HIGH
    );
    this.pins.push(pin);
  }

  enable_read_pin(pin: number, onState: pinState) {
    rpio.open(
      pin,
      rpio.INPUT,
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

  get(pin: number) : pinState {
    if (rpio.read(pin))
      return pinState.HIGH;
    else
      return pinState.LOW;
  }
}
