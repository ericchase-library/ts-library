export function CloneElement(
  source,
  deep = false,
  error = (element) => {
    `Failed to clone element. ${element}`;
  },
) {
  const clone = source.cloneNode(deep);
  if (clone instanceof source.constructor) {
    return clone;
  }
  throw error(source);
}
