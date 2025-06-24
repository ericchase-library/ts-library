export function Core_JSON_ParseRawString(str: string): string {
  return JSON.parse(`"${str}"`);
}
