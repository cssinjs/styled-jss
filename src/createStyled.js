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
  let staticSheet
  let dynamicSheet

  const mountSheets = () => {
    if (!staticSheet) {
      staticSheet = jss.createStyleSheet(baseStyles, {
        meta: 'StaticBaseSheet',
      }).attach()

      dynamicSheet = jss.createStyleSheet({}, {
        link: true,
        meta: 'DynamicComponentSheet',
      }).attach()
    }

    return {staticSheet, dynamicSheet}
  }

  return Object.assign((
    tagNameOrStyledElement: TagNameOrStyledElementType
  ) => (
    ownStyle: ComponentStyleType
  ): StyledElementType => {
    const {tagName, style} = getStyledArgs(tagNameOrStyledElement)
    const elementStyle = {...style, ...ownStyle}

    return styled({tagName, baseStyles, elementStyle, mountSheets})
  }, {mountSheets, styles: baseStyles})
}

export default createStyled
