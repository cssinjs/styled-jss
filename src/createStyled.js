/* @flow */

import type {ComponentType} from 'react'

import styled from './styled'

import type {
  BaseStylesType,
  ComponentStyleType,
  StyledElementType,
} from './types'

const createStyled = (jss: Function) => (baseStyles: BaseStylesType = {}) => {
  let sheet

  const mountSheet = () => {
    if (!sheet) {
      sheet = jss.createStyleSheet(baseStyles, {
        link: true,
        meta: 'styled-jss',
      }).attach()
    }

    return sheet
  }

  const styledWrapper = (element: string | ComponentType<any>) =>
    (...ownStyle: ComponentStyleType[]) =>
      styled({element, ownStyle, mountSheet, jss})

  Object.defineProperty(styledWrapper, 'sheet', ({
    get: () => sheet,
  }: Object)) // https://github.com/facebook/flow/issues/285

  return Object.assign(styledWrapper, {jss, mountSheet, styles: baseStyles})
}

export default createStyled
