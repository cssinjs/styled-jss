import {PureComponent, createElement} from 'react'
import {create as createJss, getDynamicStyles} from 'jss'
import preset from 'jss-preset-default'

import filterProps from './utils/filter-props'
import composeClasses from './utils/compose-classes'
import type {
  BaseStylesType,
  ComponentStyleType,
  StyledType,
  StyledElementAttrsType,
  StyledElementType,
  TagNameOrStyledElementType,
  StyledElementPropsType
} from './types'

const jssDefault = createJss(preset())


const createStyled = (
  jss?: Function = jssDefault
) => (
  baseStyles: BaseStylesType = {}
): StyledType => {
  const sheets = {}
  let counter = 0

  const getScopedTagName = (tagName: string) => `${tagName}-${++counter}`

  const mountSheets = () => {
    if (!sheets.staticSheet) {
      sheets.staticSheet = jss.createStyleSheet(baseStyles, {
        meta: 'StaticBaseSheet',
      }).attach()

      sheets.dynamicSheet = jss.createStyleSheet({}, {
        link: true,
        meta: 'DynamicComponentSheet',
      }).attach()
    }
  }

  const styled = (
    tagNameOrStyledElement: TagNameOrStyledElementType,
    ownStyle: ComponentStyleType
  ): StyledElementType => {
    const {tagName, style}: StyledElementAttrsType = typeof tagNameOrStyledElement === 'string'
      ? {tagName: tagNameOrStyledElement, style: {}}
      : tagNameOrStyledElement

    const elementStyle = {...style, ...ownStyle}
    const dynamicStyle = getDynamicStyles(elementStyle)
    const staticTagName = getScopedTagName(tagName)

    return class StyledElement extends PureComponent {
      static tagName: string = tagName
      static style: ComponentStyleType = elementStyle

      props: StyledElementPropsType

      dynamicTagName = ''

      constructor(props) {
        super(props)
        this.dynamicTagName = getScopedTagName(tagName)
      }

      componentWillMount() {
        mountSheets()

        if (!sheets.staticSheet.getRule(staticTagName)) {
          sheets.staticSheet.addRule(staticTagName, elementStyle)
        }

        if (dynamicStyle && !sheets.dynamicSheet.getRule(this.dynamicTagName)) {
          sheets.dynamicSheet
            .detach()
            .addRule(this.dynamicTagName, dynamicStyle)
          sheets.dynamicSheet
            .update(this.dynamicTagName, this.props)
            .attach()
            .link()
        }
      }

      componentWillReceiveProps(nextProps: StyledElementPropsType) {
        if (dynamicStyle) {
          sheets.dynamicSheet.update(this.dynamicTagName, nextProps)
        }
      }

      componentWillUnmount() {
        sheets.dynamicSheet.deleteRule(this.dynamicTagName)
      }

      render() {
        if (!sheets.staticSheet) return null

        const {children, className, ...attrs} = this.props

        const props = filterProps(attrs)
        const tagClass = composeClasses(
          sheets.staticSheet.classes[staticTagName],
          sheets.dynamicSheet.classes[this.dynamicTagName],
          className
        )

        return createElement(tagName, {...props, className: tagClass}, children)
      }
    }
  }

  return Object.assign(styled, {
    sheets,
    mountSheets,
    styles: baseStyles
  })
}

const defaultStyledCreator = createStyled()
const defaultStyled = defaultStyledCreator()

export {
  createStyled,
  defaultStyledCreator as Styled,
}

export default defaultStyled

export {default as injectStyled} from './injectStyled'
