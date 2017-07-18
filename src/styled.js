import {Component, createElement} from 'react'
import PropTypes from 'prop-types'
import {themeListener, channel} from 'theming'

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

type StateType = {
  theme?: Object
}

const styled = ({tagName, elementStyle, mountSheet}: StyledArgs) => {
  const {dynamicStyle, staticStyle} = getSeparatedStyles(elementStyle)
  const staticTagName = staticStyle && generateTagName(tagName)

  const availableDynamicTagNames = []
  const classMap = {}

  return class StyledElement extends Component {
    static tagName: string = tagName
    static style: ComponentStyleType = elementStyle
    static contextTypes = {
      [channel]: PropTypes.object
    }

    props: StyledElementPropsType
    sheet: JssSheet
    state: StateType
    unsubscribe: ?Function

    dynamicTagName = ''
    setTheme = (theme: Object) => this.setState({theme})

    constructor(props: StyledElementPropsType, context: any) {
      super(props, context)
      if (!this.dynamicTagName && dynamicStyle) {
        this.dynamicTagName = availableDynamicTagNames.pop() || generateTagName(tagName)
      }

      this.state = context[channel] ? {theme: themeListener.initial(context)} : {}
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
      this.updateSheet(this.props, this.state)
    }

    componentWillUpdate(nextProps: StyledElementPropsType, nextState: StateType) {
      if (dynamicStyle) this.updateSheet(nextProps, nextState)
    }

    componentDidMount() {
      if (this.state.theme) {
        this.unsubscribe = themeListener.subscribe(this.context, this.setTheme)
      }
    }

    componentWillUnmount() {
      availableDynamicTagNames.push(this.dynamicTagName)

      if (typeof this.unsubscribe === 'function') this.unsubscribe()
    }

    updateSheet(props: StyledElementPropsType, state: StateType) {
      let rule
      let ruleIndex = 0

      const styles = Object.assign({}, props, state)

      // nested styles become to flatten rules, so we need to update each nested rule
      for (ruleIndex; ruleIndex < classMap[this.dynamicTagName].length; ruleIndex++) {
        rule = classMap[this.dynamicTagName][ruleIndex]

        if (rule.name) this.sheet.update(rule.name, styles)
        if (rule.rules) rule.rules.update(styles)
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
