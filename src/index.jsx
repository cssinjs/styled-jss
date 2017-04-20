import React, {PureComponent} from 'react'

import {create as createJSS, getDynamicStyles} from 'jss'
import preset from 'jss-preset-default'

import filterProps from './utils/filter-props'


const JSS = createJSS(preset())

type StyledElementAttrsT = { Tag: string, styles: Object }
type StyledElementT = Function & StyledElementAttrsT
type TagOrStyledElementT = string | StyledElementT
type StyledElementPropsT = {
  classes: Object,
  children: ?any,
  className: ?string,
}


export const createStyled = (jss?: Function = JSS) => (baseStyles: Object = {}) => {
  let sheet

  let currentId = 0

  return (TagOrStyledElement: TagOrStyledElementT, ownStyles: Object): StyledElementT => {
    const {Tag, styles}: StyledElementAttrsT = typeof TagOrStyledElement === 'string'
      ? {Tag: TagOrStyledElement, styles: {}}
      : TagOrStyledElement

    const elementStyles = {...styles, ...ownStyles}
    const dynamicStyles = getDynamicStyles(elementStyles)

    const staticTag = `${Tag}-${++currentId}`

    return class StyledElement extends PureComponent {
      props: StyledElementPropsT

      static Tag = Tag
      static styles = elementStyles

      tagScoped = ''
      dynamicSheet = null

      constructor(props) {
        super(props)

        this.tagScoped = `${Tag}-${++currentId}`
      }

      componentWillMount() {
        if (!sheet) {
          sheet = jss.createStyleSheet(baseStyles, {
            link: true,
            meta: 'StaticBaseSheet',
          }).attach()
        }

        if (!sheet.getRule(staticTag)) {
          sheet.addRule(staticTag, elementStyles)
        }

        if (dynamicStyles && !this.dynamicSheet) {
          this.dynamicSheet = jss.createStyleSheet({[this.tagScoped]: dynamicStyles}, {
            link: true,
            meta: `DynamicComponentSheet-${this.tagScoped}`,
          }).update(this.props).attach()
        }
      }

      componentWillReceiveProps(nextProps: StyledElementPropsT) {
        if (this.dynamicSheet) this.dynamicSheet.update(nextProps)
      }

      componentWillUnmount() {
        if (this.dynamicSheet) {
          jss.removeStyleSheet(this.dynamicSheet)
          this.dynamicSheet = null
        }
      }

      render() {
        if (!sheet) return null

        const {children, className, ...attrs} = this.props

        const props = filterProps(attrs)
        const tagClass = [
          sheet.classes[staticTag],
          this.dynamicSheet && this.dynamicSheet.classes[this.tagScoped],
          className,
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <Tag className={tagClass} {...props}>
            {children}
          </Tag>
        )
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
