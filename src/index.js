import {create as createJss} from 'jss'
import preset from 'jss-preset-default'

import styled from './styled'
import type {
  BaseStylesType,
  ComponentStyleType,
  StyledType,
  StyledElementAttrsType,
  StyledElementType,
  TagNameOrStyledElementType
} from './types'

const jssDefault = createJss(preset())

const createStyled = (
  jss?: Function = jssDefault
) => (
  baseStyles: BaseStylesType = {}
): StyledType => {
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
    tagNameOrStyledElement: TagNameOrStyledElementType,
    ownStyle: ComponentStyleType
  ): StyledElementType => {
    const {tagName, style}: StyledElementAttrsType = typeof tagNameOrStyledElement === 'string'
      ? {tagName: tagNameOrStyledElement, style: {}}
      : tagNameOrStyledElement

    const elementStyle = {...style, ...ownStyle}

    return styled({tagName, baseStyles, elementStyle, mountSheets})
  }, {mountSheets, styles: baseStyles})
}

const defaultStyledCreator = createStyled()
const defaultStyled = defaultStyledCreator()

export {
  createStyled,
  defaultStyledCreator as Styled,
}

export default defaultStyled

export {default as injectStyled} from './injectStyled'
