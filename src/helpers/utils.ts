import qs, { ParsedQs } from "qs";

export function qsStringify(obj: any, options?: qs.IStringifyOptions) {
  return qs.stringify(
    obj,
    {
      arrayFormat: "brackets",
      addQueryPrefix: true,
      ...options,
    },
  );
}
  
export function qsParse<T extends ParsedQs>(str: string, options?: qs.IParseOptions) {
  return qs.parse(
    str,
    {
      ignoreQueryPrefix: true,
      ...options,
    },
  ) as Partial<T>;
}
