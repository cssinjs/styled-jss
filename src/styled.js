import {Component, createElement} from 'react'
import {object} from 'prop-types'
import {themeListener, channel} from 'theming'

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
  ownStyle: ComponentStyleType[],
  mountSheet: Function,
  jss: Function
}

type StateType = {
  theme?: Object
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
    style = [],
    tagName,
    reactComponent,
  }: {
    style?: ComponentStyleType[],
    tagName: string,
    reactComponent?: typeof element
  } = getParamsByElement(element)

  const elementStyle = style.concat(ownStyle)

  const {dynamicStyle, staticStyle, functionStyle} = getSeparatedStyles(...elementStyle)
  const staticTagName = staticStyle && generateTagName(tagName)

  const availableTagNames = []
  const classMap = {}

  let staticClassName

  class StyledElement extends Component<StyledElementPropsType, StateType> {
    static tagName: string = tagName
    static style: ComponentStyleType[] = elementStyle
    static contextTypes = {
      [channel]: object
    }

    constructor(props: StyledElementPropsType, context: any) {
      super(props, context)

      if (!this.dynamicTagName && dynamicStyle) {
        this.dynamicTagName = availableTagNames.pop() || generateTagName(tagName)
      }

      if (!this.functionTagName && functionStyle) {
        this.functionTagName = availableTagNames.pop() || generateTagName(tagName)
      }

      this.dynamicNames = [this.dynamicTagName, this.functionTagName].join(';')

      this.state = {}

      if (context[channel]) {
        this.state.theme = themeListener.initial(context)
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

      if (dynamicStyle && !this.sheet.getRule(this.dynamicTagName)) {
        this.sheet.addRule(this.dynamicTagName, dynamicStyle)
      }

      if (functionStyle && !this.sheet.getRule(this.functionTagName)) {
        this.sheet.addRule(this.functionTagName, functionStyle)
      }

      classMap[this.dynamicNames] = classMap[this.dynamicNames] || rulesIndex.slice(rulesTotal)

      this.updateSheet(this.props, this.state)
    }

    componentDidMount() {
      if (this.state.theme) {
        this.subscriptionId = themeListener.subscribe(this.context, this.setTheme)
      }
    }

    componentWillUpdate(nextProps: StyledElementPropsType, nextState: StateType) {
      if (dynamicStyle || functionStyle) this.updateSheet(nextProps, nextState)
    }

    componentWillUnmount() {
      availableTagNames.push(this.dynamicTagName)
      availableTagNames.push(this.functionTagName)

      let rule
      let ruleIndex = 0

      for (ruleIndex; ruleIndex < classMap[this.dynamicNames].length; ruleIndex++) {
        rule = classMap[this.dynamicNames][ruleIndex]

        this.sheet.deleteRule(rule.key)
      }

      if (this.subscriptionId) {
        themeListener.unsubscribe(this.context, this.subscriptionId)
      }
    }

    setTheme = (theme: Object) => this.setState({theme})

    dynamicTagName = ''
    functionTagName = ''
    dynamicNames = ''
    sheet: JssSheet
    staticClassName = ''
    subscriptionId: ?number

    updateSheet(props: StyledElementPropsType, state: StateType) {
      let rule
      let ruleIndex = 0

      const styleProps = state.theme
        ? Object.assign({}, state, props)
        : props

      // nested styles become to flatten rules, so we need to update each nested rule
      for (ruleIndex; ruleIndex < classMap[this.dynamicNames].length; ruleIndex++) {
        rule = classMap[this.dynamicNames][ruleIndex]

        this.sheet.update(rule.key, styleProps)
      }
    }

    render() {
      const {children, className, ...attrs} = this.props

      const props = reactComponent ? attrs : filterProps(tagName, attrs)
      const tagClass = composeClasses([
        this.staticClassName,
        staticTagName && this.sheet.classes[staticTagName],
        this.dynamicTagName && this.sheet.classes[this.dynamicTagName],
        this.functionTagName && this.sheet.classes[this.functionTagName],
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
