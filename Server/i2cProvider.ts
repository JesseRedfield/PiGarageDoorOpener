import { pinState } from "./config";
const rpio = require("rpio");

// i2c provider for EP-0099 https://wiki.52pi.com/index.php?title=EP-0099
// SLAVE ADDRESS JUMPER CONFIG
// 0x10 - 1:0 2:0
// 0x11 - 1:0 2:1
// 0x12 - 1:1 2:0
// 0x13 - 1:1 2:1
//----------------------------
// I2C ADDRESS AND VALUE SPACE FUCTIONS
// address: 0x01  Relay 1 0x00 - OFF 0x255 - ON
// address: 0x02  Relay 2 0x00 - OFF 0x255 - ON
// address: 0x03  Relay 3 0x00 - OFF 0x255 - ON
// address: 0x04  Relay 4 0x00 - OFF 0x255 - ON

export class i2cProvider {
  open() {
    rpio.i2cBegin();
    rpio.i2cSetSlaveAddress(0x10);
  }

  close() {
    rpio.i2cEnd();
  }

  enable_pin(pin: number, onState: pinState) {
    //i2c provider does not require pin enable/disable
  }

  disable_pin(pin: number) {
    //i2c provider does not require pin enable/disable
  }

  set(pin: number, value: pinState) {
    const address = this.getPinAddress(pin);
    if (address == 0x255) return;

    rpio.i2cWrite(Buffer.from([address, this.getPinValue(value)]));
  }

  private getPinAddress(pin: number): number {
    switch (pin) {
      case 1:
        return 0x01;
      case 2:
        return 0x02;
      case 3:
        return 0x03;
      case 4:
        return 0x04;
      default:
        return 0x255;
    }
  }

  private getPinValue(value: pinState) {
    if (value == pinState.HIGH) return 0xff;
    else return 0x00;
  }
}
