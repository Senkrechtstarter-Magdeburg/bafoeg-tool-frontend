import {questions} from "../questions/questions";

const TRANSLATION_BASE = "/assets/i18n";

export function isObject(item) {
  return (item && typeof item === "object" && !Array.isArray(item));
}

export function mergeDeep<T, S1>(target: T, source1: S1): T & S1;
export function mergeDeep<T, S1, S2>(target: T, source1: S1, source2: S2): T & S1 & S2;
export function mergeDeep<T, S1, S2, S3>(target: T, source1: S1, source2: S2, source3: S3): T & S1 & S2 & S3;
export function mergeDeep(target: object, ...sources: object[]): object;
export function mergeDeep(target: object, ...sources: object[]): object {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, {[key]: {}});
          }
          mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, {[key]: source[key]});
        }
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export function getMissingTranslations(existing: object): object {
  const translationKeys = questions.flatMap(q => [
    q.title,
    ...q.questionContainers.flatMap(c => [
      c.description,
      c.nextText,
      c.previousText,
      ...c.questionEntries.flatMap(e => [
        e.question.hint,
        e.question.placeholder,
        e.question.text
      ])
    ])
  ]);

  function objByPath(parts: string[], value: string = ""): object {
    return parts.length > 0 ? {
      [parts[0]]: parts.length === 1 ? value : objByPath(parts.slice(1), value)
    } : {};
  }

  const translationObject = translationKeys.filter(x => !!x).reduce((prev, cur) => mergeDeep(prev, objByPath(cur.split("."))), {});

  return mergeDeep(translationObject, existing);
}


export async function getMissingTranslationsByLang(language: string = navigator.language): Promise<object> {
  const result = await fetch(`${TRANSLATION_BASE}/${language.split("-")[0]}.json`);
  const existing = await result.json();

  return getMissingTranslations(existing);
}
