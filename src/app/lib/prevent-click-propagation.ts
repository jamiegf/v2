export const stopPropagation = (e: Event): Event => {
  e.stopPropagation();
  return e;
};
