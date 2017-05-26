const isObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

type separatedStyles = {dynamicStyle?: Object, staticStyle?: Object}

/**
 * Extracts static and dynamic styles objects separately
 */
const getSeparatedStyles = (styles: Object): separatedStyles => {
  const result = {}

  for (const key in styles) {
    const value = styles[key]
    const itemStyles = {}

    if (typeof value === 'function') itemStyles.dynamicStyle = value
    else if (isObject(value)) Object.assign(itemStyles, getSeparatedStyles(value))
    else itemStyles.staticStyle = value

    for (const styleType in itemStyles) {
      result[styleType] = result[styleType] || {}
      result[styleType][key] = itemStyles[styleType]
    }
  }

  return result
}

export default getSeparatedStyles
