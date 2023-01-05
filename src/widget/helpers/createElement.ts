export const createElement = (
  tag: string,
  className: string,
  textContent: string = ''
): HTMLElement => {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = textContent;

  return element;
};
