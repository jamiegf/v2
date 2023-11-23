export function stripQueryParamsFromUrl(
  url: URL,
  paramsToRemove: string[],
): URL {
  const removeTokenSearchParams = new URLSearchParams();
  url.searchParams.forEach((value, key) => {
    if (paramsToRemove.find((param) => param === key) === undefined)
      removeTokenSearchParams.set(key, value);
  });
  return new URL(
    `${url.origin}${url.pathname}?${removeTokenSearchParams.toString()}`,
  );
}
