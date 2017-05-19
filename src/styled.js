import {Component, createElement} from 'react'
import {getDynamicStyles} from 'jss'
import type {
  Rule,
} from 'jss/lib/types'

import filterProps from './utils/filterProps'
import composeClasses from './utils/composeClasses'
import generateTagName from './utils/generateTagName'

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
  const dynamicStyle = getDynamicStyles(elementStyle)
  const staticTagName = generateTagName(tagName)

  const availableDynamicTagNames = []
  const classMap = {}

  return class StyledElement extends Component {
    static tagName: string = tagName
    static style: ComponentStyleType = elementStyle

    props: StyledElementPropsType

    dynamicTagName = ''

    sheet: JssSheet
    cssRules: CSSStyleRule[]
    rulesIndex: Rule[]

    constructor(props: StyledElementPropsType) {
      super(props)
      if (!this.dynamicTagName && dynamicStyle) {
        this.dynamicTagName = availableDynamicTagNames.pop() || generateTagName(tagName)
      }
    }

    componentWillMount() {
      this.sheet = this.sheet || mountSheet()
      this.rulesIndex = this.sheet.rules.index
      this.cssRules = this.cssRules || this.sheet.renderer.getRules() || []

      const rulesTotal = this.rulesIndex.length
      const cssRulesTotal = this.cssRules.length

      if (!this.sheet.getRule(staticTagName)) {
        this.sheet.addRule(staticTagName, elementStyle)
      }

      if (!dynamicStyle) return

      if (!this.sheet.getRule(this.dynamicTagName)) {
        this.sheet.addRule(this.dynamicTagName, dynamicStyle)
      }

      classMap[this.dynamicTagName] = this.rulesIndex.slice(rulesTotal)

      let cssRule
      let rule
      let cssRuleIndex = 0
      let ruleIndex = 0
      // nested styles become to flatten rules, so we need to update each nested rule
      for (ruleIndex; ruleIndex < classMap[this.dynamicTagName].length; ruleIndex++) {
        rule = classMap[this.dynamicTagName][ruleIndex]
        cssRule = this.cssRules[cssRulesTotal + cssRuleIndex]
        if (cssRule && cssRule.selectorText === rule.selectorText) {
          /**
           * we need to set cssRule in rule.renderable
           * @see {@link https://github.com/cssinjs/jss/issues/500}
           * and we don't want to use link(), because there is no need to iterate over all rules
           */
          rule.renderable = cssRule
          cssRuleIndex++
        }
        this.sheet.update(rule.name, this.props)
      }
    }

    componentWillReceiveProps(nextProps: StyledElementPropsType) {
      if (dynamicStyle) {
        let rule
        let ruleIndex = 0
        // the same rules update as in constructor
        for (ruleIndex; ruleIndex < classMap[this.dynamicTagName].length; ruleIndex++) {
          rule = classMap[this.dynamicTagName][ruleIndex]
          this.sheet.update(rule.name, nextProps)
        }
      }
    }

    componentWillUnmount() {
      availableDynamicTagNames.push(this.dynamicTagName)
    }

    render() {
      const {children, className, ...attrs} = this.props

      const props = filterProps(attrs)
      const tagClass = composeClasses([
        this.sheet.classes[staticTagName],
        this.sheet.classes[this.dynamicTagName],
        className
      ])

      return createElement(tagName, {...props, className: tagClass}, children)
    }
  }
}

export default styled
