import React, {PureComponent} from 'react'

import {create as createJss, getDynamicStyles} from 'jss'
import preset from 'jss-preset-default'

import filterProps from './utils/filter-props'


const jssDefault = createJss(preset())

type StyledElementAttrsT = { tag: string, styles: Object }
type StyledElementT = Function & StyledElementAttrsT
type tagOrStyledElementT = string | StyledElementT
type StyledElementPropsT = {
  classes: Object,
  children: ?any,
  className: ?string,
}


export const createStyled = (jss?: Function = jssDefault) => (baseStyles: Object = {}) => {
  let sheet
  let dynamicSheet

  let counter = 0

  return (tagOrStyledElement: tagOrStyledElementT, ownStyles: Object): StyledElementT => {
    const {tag, styles}: StyledElementAttrsT = typeof tagOrStyledElement === 'string'
      ? {tag: tagOrStyledElement, styles: {}}
      : tagOrStyledElement

    const elementStyles = {...styles, ...ownStyles}
    const dynamicStyles = getDynamicStyles(elementStyles)

    const updateRule = (className, data) => {
      const componentRule = dynamicSheet.rules.map[className]

      if (componentRule.type === 'regular') {
        for (const prop in componentRule.style) {
          const value = componentRule.style[prop]
          if (typeof value === 'function') {
            const computedValue = value(data)
            componentRule.prop(prop, computedValue)
          }
        }
      }
    }

    const StaticTag = `${tag}-${++counter}`

    return class StyledElement extends PureComponent {
      props: StyledElementPropsT

      static tag = tag
      static styles = elementStyles

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

        if (!sheet.getRule(StaticTag)) {
          sheet.addRule(StaticTag, elementStyles)
        }

        if (dynamicStyles && !dynamicSheet.getRule(this.tagScoped)) {
          dynamicSheet.detach()
          dynamicSheet.addRule(this.tagScoped, dynamicStyles)
          updateRule(this.tagScoped, this.props)
          dynamicSheet.attach()
        }
      }

      componentWillReceiveProps(nextProps: StyledElementPropsT) {
        if (dynamicStyles) updateRule(this.tagScoped, nextProps)
      }

      componentWillUnmount() {
        dynamicSheet.deleteRule(this.tagScoped)
      }

      render() {
        if (!sheet) return null

        const {children, className, ...attrs} = this.props

        const props = filterProps(attrs)
        const tagClass = [
          sheet.classes[StaticTag],
          dynamicSheet.classes[this.tagScoped],
          className,
        ]
          .filter(Boolean)
          .join(' ')

        return React.createElement(tag, {...props, className: tagClass}, children)
      }
    }
  }
}

const defaultStyledBased = createStyled()
const defaultStyled = defaultStyledBased()

export {defaultStyled as styled}

export const createStyledCreator = (styled: Function = defaultStyledBased) =>
  (baseStyles: Object) => Object.assign(styled(baseStyles), {styles: baseStyles})

export default createStyledCreator()
