import styled from './styled'

import type {
  BaseStylesType,
  ComponentStyleType,
  StyledType,
  StyledElementAttrsType,
  StyledElementType,
  TagNameOrStyledElementType
} from './types'

const getStyledArgs = (
  tagNameOrStyledElement: TagNameOrStyledElementType
): StyledElementAttrsType => {
  if (typeof tagNameOrStyledElement === 'string') {
    return {tagName: tagNameOrStyledElement, style: {}}
  }

  const {tagName, style} = tagNameOrStyledElement
  return {tagName, style}
}

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

  return Object.assign((
    tagNameOrStyledElement: TagNameOrStyledElementType
  ) => (
    ownStyle: ComponentStyleType
  ): StyledElementType => {
    const {tagName, style} = getStyledArgs(tagNameOrStyledElement)
    const elementStyle = {...style, ...ownStyle}

    return styled({tagName, baseStyles, elementStyle, mountSheet})
  }, {mountSheet, sheet, styles: baseStyles})
}

export default createStyled
