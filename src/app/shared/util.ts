export function range(length: number): number[];
// tslint:disable-next-line:unified-signatures Nicer intellisense
export function range(start: number, end: number, step?: number): number[];
export function range(startOrLength: number, end?: number, step?: number): number[] {
  const start = end === undefined ? 0 : startOrLength;
  end = end ?? startOrLength;
  step = step ?? 1;

  const result: number[] = [];

  for (let i = start; i < end; i += step) {
    result.push(i);
  }

  return result;

}
