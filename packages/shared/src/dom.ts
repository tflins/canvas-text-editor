export const isHtmlElement = (e: any): e is Element =>
  e && e.nodeType === Node.ELEMENT_NODE
