export const removeWhitespace = (str: string) => str.replace(/\s/g, '')

export const getCss = (sheet: Object) => sheet.renderer.getRules()
  .map(rule => removeWhitespace(rule.cssText))
  .join('')
