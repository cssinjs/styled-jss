/* @flow */

import isObservable from 'is-observable'

import {type ComponentStyleType} from '../types'

const isObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const separateStyles = (styles: Object): {
  dynamicStyle?: ComponentStyleType,
  staticStyle?: ComponentStyleType
} => {
  const result = {}
  const keys = Object.keys(styles)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = styles[key]
    const itemStyles = Object.create(null)

    if (typeof value === 'function' || isObservable(value)) itemStyles.dynamicStyle = value
    else if (isObject(value)) Object.assign(itemStyles, separateStyles(value))
    else itemStyles.staticStyle = value

    for (const styleType in itemStyles) {
      result[styleType] = result[styleType] || {}
      result[styleType][key] = itemStyles[styleType]
    }
  }

  return result
}

/**
 * Extracts static and dynamic styles objects separately
 */
const getSeparatedStyles = (...initialStyles: ComponentStyleType[]): {
  dynamicStyle?: ComponentStyleType | (props: Object) => ?ComponentStyleType,
  staticStyle?: ComponentStyleType,
} => {
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

  const result = separateStyles(styles)

  if (fns.length) {
    const {dynamicStyle = {}} = result

    result.dynamicStyle = (props) => {
      const fnObjects = []
      const dynamicResult = {}

      for (let i = 0; i < fns.length; i++) {
        fnObjects.push(fns[i](props))
      }

      const keys = Object.keys(dynamicStyle)
      for (let i = 0; i < keys.length; i++) {
        dynamicResult[keys[i]] = dynamicStyle[keys[i]](props)
      }

      return Object.assign(dynamicResult, ...fnObjects)
    }
  }

  return result
}

export default getSeparatedStyles
