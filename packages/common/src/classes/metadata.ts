import { IMetadata } from '../interfaces/metadata';

class Metadata implements IMetadata {
  public key: string | number | symbol;
  public value: any;

  constructor(key: string | number | symbol, value: any) {
    this.key = key;
    this.value = value;
  }
}

export default Metadata;
