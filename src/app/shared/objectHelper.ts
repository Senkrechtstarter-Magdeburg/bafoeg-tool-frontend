export class ObjectEntryArray<V> {


  private fields: [string, V][];

  constructor(...fields: [string, V][]) {
    this.fields = fields;
  }

  public collect(): { [key: string]: V } {
    return this.fields.reduce((prev, [key, value]) => ({...prev, [key]: value}), {});
  }

  public filter<S extends [string, V]>(callbackfn: (value: [string, V], index: number, array: [string, V][]) => boolean,
                                       thisArg?: any): ObjectEntryArray<V> {
    return new ObjectEntryArray<V>(...this.fields.filter(callbackfn, thisArg));
  }

  public map<U>(callbackfn: (value: [string, V], index: number, array: [string, V][]) => U,
                thisArg?: any): ObjectEntryArray<U> {
    return new ObjectEntryArray<U>(
      ...this.fields.map(([k, v], i, self) => [k, callbackfn([k, v], i, self)] as [string, U], thisArg)
    );
  }

  [Symbol.iterator]() {
    return this.fields[Symbol.iterator]();
  };
}

export function getEntries<V>(dict: Dict<V>): ObjectEntryArray<V> {
  return new ObjectEntryArray(...Object.entries(dict));
}
