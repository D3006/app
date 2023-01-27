import dictV12 from './dict-v12';
import dictV11 from './dict-v11';
import dictV10 from './dict-v10';
import dictV9 from './dict-v9';
import deprecatedKeycodes from './deprecated-keycodes';

export type KeycodeRecord = {
  byte: number;
  group?: string;
  label?: string;
  aliases?: string[];
};

export type KeycodeDictSource = {
  keycodes: Record<string, KeycodeRecord>;
  ranges: Record<string, number>;
};

export class KeycodeDict {
  keycodes: Record<string, KeycodeRecord>;
  byteToKeycode: Record<number, string>;
  ranges: Record<string, number>;
  byteToRange: Record<number, string>;
  aliases: Record<string, string>;

  constructor(keycodeDictSource: KeycodeDictSource) {
    this.keycodes = {...keycodeDictSource.keycodes};
    this.ranges = {...keycodeDictSource.ranges};
    this.byteToKeycode = Object.entries(this.keycodes).reduce(
      (p, [keycode, obj]) => ({...p, [obj.byte]: keycode}),
      {},
    );
    this.byteToRange = Object.entries(this.ranges).reduce(
      (p, [range, byte]) => ({...p, [byte]: range}),
      {},
    );
    this.aliases = Object.entries(this.keycodes).reduce((p, [keycode, obj]) => {
      const aliasToKeycode = obj.aliases?.reduce(
        (p2, n2) => ({...p2, [n2]: keycode}),
        {},
      );
      return {...p, ...aliasToKeycode};
    }, {});
  }
}

export function getKeycodeDict(version: number) {
  switch (version) {
    case 12: {
      return new KeycodeDict(dictV12);
    }
    case 11: {
      return new KeycodeDict(dictV11);
    }
    case 10: {
      return new KeycodeDict(dictV10);
    }
    case 9:
    default: {
      return new KeycodeDict(dictV9);
    }
  }
}
