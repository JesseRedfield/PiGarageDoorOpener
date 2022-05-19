export enum pinState {
  LOW = 0,
  HIGH = 1,
}

export enum providerType {
  gpio = 'gpio',
  i2c = 'i2c',
}

export type IProviderDictionary = {
  [index in providerType]: provider;
};

export interface provider {
  open(): void;

  close(): void;

  enable_write_pin(pin: number, onState: pinState): void;

  enable_read_pin(pin: number, onState: pinState): void

  disable_pin(pin: number): void;

  set(pin: number, value: pinState): void;

  get(pin: number): pinState;
}
