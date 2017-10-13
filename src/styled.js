import {Component, createElement} from 'react'

import filterProps from './utils/filterProps'
import composeClasses from './utils/composeClasses'
import generateTagName from './utils/generateTagName'
import getSeparatedStyles from './utils/getSeparatedStyles'

import type {
  JssSheet,
  TagNameOrStyledElementType,
  ComponentStyleType,
  StyledElementPropsType
} from './types'

type Comp = Function & Component<*>

type StyledArgs = {
  element: TagNameOrStyledElementType | Comp,
  ownStyle: ComponentStyleType,
  mountSheet: Function,
  jss: Function
}

const getElementName = (element: Comp): string =>
  element.displayName || element.name || 'StyledElement'

const getParamsByElement = (element) => {
  if (typeof element === 'string') return {tagName: element}
  if (element.tagName) return element

  return {
    tagName: getElementName(element),
    reactComponent: element
  }
}

const styled = ({element, ownStyle, mountSheet, jss}: StyledArgs) => {
  const {
    style,
    tagName,
    reactComponent,
  }: {
    style?: ComponentStyleType,
    tagName: string,
    reactComponent?: typeof element
  } = getParamsByElement(element)

  const elementStyle = {...style, ...ownStyle}

  const {dynamicStyle, staticStyle} = getSeparatedStyles(elementStyle)
  const staticTagName = staticStyle && generateTagName(tagName)

  const availableDynamicTagNames = []
  const classMap = {}

  let staticClassName

  class StyledElement extends Component<StyledElementPropsType> {
    static tagName: string = tagName
    static style: ComponentStyleType = elementStyle

    constructor(props: StyledElementPropsType) {
      super(props)
      if (!this.dynamicTagName && dynamicStyle) {
        this.dynamicTagName = availableDynamicTagNames.pop() || generateTagName(tagName)
      }

      this.staticClassName = staticClassName
    }

    componentWillMount() {
      this.sheet = this.sheet || mountSheet()
      const rulesIndex = this.sheet.rules.index
      const rulesTotal = rulesIndex.length

      if (staticStyle && !this.sheet.getRule(staticTagName)) {
        this.sheet.addRule(staticTagName, staticStyle)
      }

      if (!dynamicStyle) return

      if (!this.sheet.getRule(this.dynamicTagName)) {
        this.sheet.addRule(this.dynamicTagName, dynamicStyle)
      }

      classMap[this.dynamicTagName] = classMap[this.dynamicTagName] || rulesIndex.slice(rulesTotal)
      this.updateSheet(this.props)
    }

    componentWillReceiveProps(nextProps: StyledElementPropsType) {
      if (dynamicStyle) this.updateSheet(nextProps)
    }

    componentWillUnmount() {
      availableDynamicTagNames.push(this.dynamicTagName)
    }

    dynamicTagName = ''
    sheet: JssSheet
    staticClassName = ''

    updateSheet(props: StyledElementPropsType) {
      let rule
      let ruleIndex = 0

      // nested styles become to flatten rules, so we need to update each nested rule
      for (ruleIndex; ruleIndex < classMap[this.dynamicTagName].length; ruleIndex++) {
        rule = classMap[this.dynamicTagName][ruleIndex]

        this.sheet.update(rule.key, props)
      }
    }

    render() {
      const {children, className, ...attrs} = this.props

      const props = reactComponent ? attrs : filterProps(tagName, attrs)
      const tagClass = composeClasses([
        this.staticClassName,
        staticTagName && this.sheet.classes[staticTagName],
        this.dynamicTagName && this.sheet.classes[this.dynamicTagName],
        className
      ])

      return createElement(reactComponent || tagName, {...props, className: tagClass}, children)
    }
  }

  // $FlowIgnore
  StyledElement.valueOf = () => {
    if (!staticClassName) {
      staticClassName = `${jss.generateClassName({
        key: generateTagName('static')
      })}`
    }

    return `.${staticClassName}`
  }

  // $FlowIgnore
  StyledElement.toString = StyledElement.valueOf

  return StyledElement
}

export default styled
