export class ObjectEntryArray<V> extends Array<[string, V]> {
  public collect(): { [key: string]: V } {
    return this.reduce((prev, [key, value]) => ({...prev, [key]: value}), {});
  }

  public filter<S extends [string, V]>(callbackfn: (value: [string, V], index: number, array: [string, V][]) => boolean,
                                       thisArg?: any): ObjectEntryArray<V> {
    return new ObjectEntryArray<V>(...super.filter(callbackfn, thisArg));
  }
}

export function getEntries<V>(dict: Dict<V>): ObjectEntryArray<V> {
  return new ObjectEntryArray(...Object.entries(dict));
}
