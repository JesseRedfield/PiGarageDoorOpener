export type GarageDoor = {
  type: string;
  name: string;
  description: string;
  isOpen: boolean;
};

export type Light = {
  type: string;
  name: string;
  description: string;
  isOn: boolean;
};

export type Item = GarageDoor | Light;
