import styled from './styled'
import sheetsObserver from './utils/sheetsObserver'

import type {
  BaseStylesType,
  ComponentStyleType,
  StyledType,
  StyledElementAttrsType,
  StyledElementType,
  TagNameOrStyledElementType
} from './types'

sheetsObserver.listen()

const createStyled = (jss: Function) => (
  baseStyles: BaseStylesType = {}
): StyledType => {
  let staticSheet
  let dynamicSheet
  let dynamicSheetId

  const addRule = (name: string, style: ComponentStyleType, data: Object) => {
    if (data) {
      dynamicSheet.detach().addRule(name, style)
      dynamicSheet.update(name, data)
      sheetsObserver.update(dynamicSheetId)
    }
    else {
      staticSheet.addRule(name, style)
    }
  }

  const mountSheets = () => {
    if (!staticSheet) {
      staticSheet = jss.createStyleSheet(baseStyles, {
        meta: 'StaticBaseSheet',
      }).attach()

      dynamicSheet = jss.createStyleSheet({}, {
        link: true,
        meta: 'DynamicComponentSheet',
      }).attach()
      dynamicSheetId = sheetsObserver.add(dynamicSheet)
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

    return styled({tagName, baseStyles, elementStyle, mountSheets, addRule})
  }, {mountSheets, styles: baseStyles})
}

export default createStyled
