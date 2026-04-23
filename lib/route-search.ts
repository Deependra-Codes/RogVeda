export type RouteSearchParamValue = string | string[] | undefined;

export type RouteSearchParams = Record<string, RouteSearchParamValue>;

export function firstRouteSearchValue(value: RouteSearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}
