import domElements from 'react-dom-elements'
import {createStyled as createStyledBase} from '../'
import type {
  StyledElementType,
} from '../types'

const createStyled = (jss?: Function) => {
  const Styled = createStyledBase(jss)

  return (baseStyles?: Object) => {
    const styled = Styled(baseStyles)

    return Object.assign(styled, domElements.reduce((acc, tag: string) => ({
      ...acc,
      [tag]: (styles: Object): StyledElementType => styled(tag, styles)
    }), {}))
  }
}

const defaultStyledCreator = createStyled()
const defaultStyled = defaultStyledCreator()

export {
  createStyled,
  defaultStyledCreator as Styled,
}

export default defaultStyled
