import asap from 'asap'

import styled from './styled'

import type {
  BaseStylesType,
  ComponentStyleType,
  StyledType,
  StyledElementAttrsType,
  StyledElementType,
  TagNameOrStyledElementType
} from './types'

const dynamicSheets = []
let sheetsToUpdate = {}

asap(() => {
  const sheetNames = Object.keys(sheetsToUpdate)
  if (sheetNames.length) {
    sheetsToUpdate = {}
    sheetNames.forEach(sheetName =>
      dynamicSheets[Number(sheetName)].attach().link())
  }
})

const createStyled = (jss: Function) => (
  baseStyles: BaseStylesType = {}
): StyledType => {
  let staticSheet
  let dynamicSheet
  let dynamicSheetName

  const addRule = (name: string, style: ComponentStyleType, data: Object) => {
    if (data) {
      dynamicSheet.detach().addRule(name, style)
      dynamicSheet.update(name, data)
      sheetsToUpdate[dynamicSheetName] = true
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
      dynamicSheets.push(dynamicSheet)
      dynamicSheetName = dynamicSheets.length - 1
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
