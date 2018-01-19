import isObservable from 'is-observable'

const isObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

type separatedStyles = {dynamicStyle?: Object, staticStyle?: Object}

/**
 * Extracts static and dynamic styles objects separately
 */
const getSeparatedStyles = (styles: Object): separatedStyles => {
  const result = {}
  const keys = Object.keys(styles)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = styles[key]
    const itemStyles = Object.create(null)

    if (typeof value === 'function' || isObservable(value)) itemStyles.dynamicStyle = value
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
