export function convertRequestBodyToForm(body: Record<string, string>): string {
  const form = new URLSearchParams();
  for (const key in body) {
    form.set(key, body[key]);
  }
  return form.toString();
}
