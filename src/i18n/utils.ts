import { ui, defaultLang, type Languages } from "./ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

type FlattenedTranslations<
  T extends Record<string, unknown>,
  Key = keyof T
> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never;

type FlattenObjectKeys<T> = T extends infer R | infer U
  ? R extends Record<string, unknown>
    ? U extends Record<string, unknown>
      ? FlattenedTranslations<R> | FlattenedTranslations<U>
      : FlattenedTranslations<R>
    : U extends Record<string, unknown>
    ? FlattenedTranslations<U>
    : never
  : never;

type SplittedTranslations<T extends string> =
  T extends `${infer K}.${infer R}`
    ? [K, ...SplittedTranslations<R>]
    : [];

interface Sentences {
  [key: string]: string | Sentences;
}

export function useTranslations(lang: Languages) {
  return function t(key: FlattenedTranslations<(typeof ui)[keyof typeof ui]>): string {
    const keys = key.split(".") as SplittedTranslations<typeof key>;

    const result = keys.reduce((acc, key) => {
      if (typeof acc === "string") {
        return acc;
      }

      return acc[key];
    }, ui[lang] as Sentences | string);

    if (typeof result === "string") {
      return result;
    }

    throw new Error(`Translation not found for ${key}`);
  };
}
