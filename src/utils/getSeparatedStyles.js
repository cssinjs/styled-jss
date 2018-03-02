import isObservable from 'is-observable'

import {type ComponentStyleType} from '../types'

const isObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

type separatedStyles = {dynamicStyle?: ComponentStyleType, staticStyle?: Object}

/**
 * Extracts static and dynamic styles objects separately
 */
const getSeparatedStyles = (...initialStyles: ComponentStyleType[]): separatedStyles => {
  const result = {}

  const styles = {}
  const fns = []

  for (let i = 0; i < initialStyles.length; i++) {
    const style = initialStyles[i]

    if (typeof style === 'function') {
      fns.push(style)
    }
    else {
      Object.assign(styles, style)
    }
  }

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

  if (fns.length) {
    const {dynamicStyle} = result

    result.dynamicStyle = (props) => {
      const fnObjects = []

      for (let i = 0; i < fns.length; i++) {
        fnObjects.push(fns[i](props))
      }

      return Object.assign({}, dynamicStyle, ...fnObjects)
    }
  }

  return result
}

export default getSeparatedStyles
