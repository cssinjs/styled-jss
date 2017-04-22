import {PureComponent, createElement} from 'react'
import {create as createJss, getDynamicStyles} from 'jss'
import preset from 'jss-preset-default'

import composeClasses from './utils/compose-classes'
import type {
  styledType,
  StyledElementAttrsType,
  StyledElementType,
  tagOrStyledElementTypeype,
  StyledElementPropsType
} from './types'

const jssDefault = createJss(preset())

const createStyled = (jss?: Function = jssDefault) => (baseStyles: Object = {}): styledType => {
  const sheets = {}
  let counter = 0

  const mountSheets = () => {
    if (!sheets.staticSheet) {
      sheets.staticSheet = jss.createStyleSheet(baseStyles, {
        link: true,
        meta: 'StaticBaseSheet',
      }).attach()

      sheets.dynamicSheet = jss.createStyleSheet({}, {
        link: true,
        meta: 'DynamicComponentSheet',
      }).attach()
    }
  }

  const styled = (
    tagOrStyledElement: tagOrStyledElementTypeype,
    ownStyles: Object
  ): StyledElementType => {
    const {tag, styles}: StyledElementAttrsType = typeof tagOrStyledElement === 'string'
      ? {tag: tagOrStyledElement, styles: {}}
      : tagOrStyledElement

    const elementStyles = {...styles, ...ownStyles}
    const dynamicStyles = getDynamicStyles(elementStyles)
    const staticTag = `${tag}-${++counter}`

    return class StyledElement extends PureComponent {
      static tag = tag

      static styles = elementStyles

      props: StyledElementPropsType

      tagScoped = ''

      constructor(props) {
        super(props)
        this.tagScoped = `${tag}-${++counter}`
      }

      componentWillMount() {
        mountSheets()

        if (!sheets.staticSheet.getRule(staticTag)) {
          sheets.staticSheet.addRule(staticTag, elementStyles)
        }

        if (dynamicStyles && !sheets.dynamicSheet.getRule(this.tagScoped)) {
          sheets.dynamicSheet
            .detach()
            .addRule(this.tagScoped, dynamicStyles)
          sheets.dynamicSheet
            .update(this.tagScoped, this.props.style)
            .attach()
            .link()
        }
      }

      componentWillReceiveProps(nextProps: StyledElementPropsType) {
        if (dynamicStyles) {
          sheets.dynamicSheet.update(this.tagScoped, nextProps.style)
        }
      }

      componentWillUnmount() {
        sheets.dynamicSheet.deleteRule(this.tagScoped)
      }

      render() {
        if (!sheets.staticSheet) return null

        const {children, className, style, ...attrs} = this.props

        const tagClass = composeClasses(
          sheets.staticSheet.classes[staticTag],
          sheets.dynamicSheet.classes[this.tagScoped],
          className
        )

        return createElement(tag, {...attrs, className: tagClass}, children)
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
