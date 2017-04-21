import {PureComponent, createElement} from 'react'
import {create as createJss, getDynamicStyles} from 'jss'
import preset from 'jss-preset-default'
import filterProps from './utils/filter-props'
import type {
  StyledElementAttrsType,
  StyledElementType,
  tagOrStyledElementTypeype,
  StyledElementPropsType
} from './types'

const jssDefault = createJss(preset())

const createStyled = (jss?: Function = jssDefault) => (baseStyles?: Object = {}) => {
  let sheet
  let dynamicSheet
  let counter = 0

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
        if (!sheet) {
          sheet = jss.createStyleSheet(baseStyles, {
            link: true,
            meta: 'StaticBaseSheet',
          }).attach()

          dynamicSheet = jss.createStyleSheet({}, {
            link: true,
            meta: 'DynamicComponentSheet',
          }).attach()
        }

        if (!sheet.getRule(staticTag)) {
          sheet.addRule(staticTag, elementStyles)
        }

        if (dynamicStyles && !dynamicSheet.getRule(this.tagScoped)) {
          dynamicSheet.detach()
          dynamicSheet.addRule(this.tagScoped, dynamicStyles)
          dynamicSheet.update(this.tagScoped, this.props)
          dynamicSheet.attach()
        }
      }

      componentWillReceiveProps(nextProps: StyledElementPropsType) {
        if (dynamicStyles) dynamicSheet.update(this.tagScoped, nextProps)
      }

      componentWillUnmount() {
        dynamicSheet.deleteRule(this.tagScoped)
      }

      render() {
        if (!sheet) return null

        const {children, className, ...attrs} = this.props

        const props = filterProps(attrs)
        const tagClass = [
          sheet.classes[staticTag],
          dynamicSheet.classes[this.tagScoped],
          className,
        ]
          .filter(Boolean)
          .join(' ')

        return createElement(tag, {...props, className: tagClass}, children)
      }
    }
  }

  return Object.assign(styled, {styles: baseStyles})
}

const defaultStyledCreator = createStyled()
const defaultStyled = defaultStyledCreator()

export {
  createStyled,
  defaultStyledCreator as Styled,
}

export default defaultStyled
