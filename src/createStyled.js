import styled from './styled'

import type {
  BaseStylesType,
  ComponentStyleType,
  StyledType,
  StyledElementType,
} from './types'

const createStyled = (jss: Function) => (baseStyles: BaseStylesType = {}): StyledType => {
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

  const styledWrapper = element =>
    (...ownStyle: ComponentStyleType[]): StyledElementType =>
      styled({element, ownStyle, mountSheet, jss})

  Object.defineProperty(styledWrapper, 'sheet', ({
    get: () => sheet,
  }: Object)) // https://github.com/facebook/flow/issues/285

  return Object.assign(styledWrapper, {jss, mountSheet, styles: baseStyles})
}

export default createStyled
