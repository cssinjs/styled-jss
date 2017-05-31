import {Component, createElement} from 'react'

import filterProps from './utils/filterProps'
import composeClasses from './utils/composeClasses'
import generateTagName from './utils/generateTagName'
import getSeparatedStyles from './utils/getSeparatedStyles'

import type {
  JssSheet,
  ComponentStyleType,
  StyledElementPropsType
} from './types'

type StyledArgs = {
  tagName: string,
  elementStyle: ComponentStyleType,
  mountSheet: Function
}

const styled = ({tagName, elementStyle, mountSheet}: StyledArgs) => {
  const {dynamicStyle, staticStyle} = getSeparatedStyles(elementStyle)
  const staticTagName = staticStyle && generateTagName(tagName)

  const availableDynamicTagNames = []
  const classMap = {}

  return class StyledElement extends Component {
    static tagName: string = tagName
    static style: ComponentStyleType = elementStyle

    props: StyledElementPropsType

    dynamicTagName = ''

    sheet: JssSheet

    constructor(props: StyledElementPropsType) {
      super(props)
      if (!this.dynamicTagName && dynamicStyle) {
        this.dynamicTagName = availableDynamicTagNames.pop() || generateTagName(tagName)
      }
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

    updateSheet(props: StyledElementPropsType) {
      let rule
      let ruleIndex = 0

      // nested styles become to flatten rules, so we need to update each nested rule
      for (ruleIndex; ruleIndex < classMap[this.dynamicTagName].length; ruleIndex++) {
        rule = classMap[this.dynamicTagName][ruleIndex]

        if (rule.name) this.sheet.update(rule.name, props)
        if (rule.rules) rule.rules.update(props)
      }
    }

    render() {
      const {children, className, ...attrs} = this.props

      const props = filterProps(attrs)
      const tagClass = composeClasses([
        staticTagName && this.sheet.classes[staticTagName],
        this.dynamicTagName && this.sheet.classes[this.dynamicTagName],
        className
      ])

      return createElement(tagName, {...props, className: tagClass}, children)
    }
  }
}

export default styled
