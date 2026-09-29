import type en from "./dictionaries/en.json";

export type Dictionary = typeof en;

type Leaves<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${P}${K}`
    : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

/** Every dotted key in the dictionary, e.g. "auth.login.title". */
export type MessageKey = Leaves<Dictionary>;

export type MessageVars = Record<string, string | number>;

function lookup(dict: Dictionary, key: string): string | undefined {
  let node: unknown = dict;
  for (const part of key.split(".")) {
    if (!node || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

const fill = (template: string, vars?: MessageVars) =>
  vars
    ? template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match,
      )
    : template;

export interface Translator {
  (key: MessageKey, vars?: MessageVars): string;
  /**
   * For strings only known at runtime — Zod messages (which are keys) and API
   * messages (mapped in errors.api). Unknown text comes back unchanged.
   */
  dynamic: (keyOrText: string, vars?: MessageVars) => string;
}

export function createTranslator(dict: Dictionary): Translator {
  const t = (key: MessageKey, vars?: MessageVars) =>
    fill(lookup(dict, key) ?? key, vars);

  return Object.assign(t, {
    dynamic: (keyOrText: string, vars?: MessageVars) =>
      fill(lookup(dict, keyOrText) ?? keyOrText, vars),
  });
}
