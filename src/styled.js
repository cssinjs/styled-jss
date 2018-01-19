import {Component, createElement} from 'react'
import {object} from 'prop-types'
import {themeListener, channel} from 'theming'

import filterProps from './utils/filterProps'
import composeClasses from './utils/composeClasses'
import generateTagName from './utils/generateTagName'
import getSeparatedStyles from './utils/getSeparatedStyles'

import StyledJssError from './errors'

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

  const {dynamicStyle, staticStyle} = getSeparatedStyles(...elementStyle)
  const staticTagName = staticStyle && generateTagName(tagName)

  const isFunctionStyle = typeof dynamicStyle === 'function'

  const availableDynamicTagNames = []
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
        this.dynamicTagName = availableDynamicTagNames.pop() || generateTagName(tagName)
      }

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

      if (!dynamicStyle) return

      if (!this.sheet.getRule(this.dynamicTagName)) {
        this.sheet.addRule(this.dynamicTagName, dynamicStyle)
      }

      classMap[this.dynamicTagName] = classMap[this.dynamicTagName] || rulesIndex.slice(rulesTotal)

      this.updateSheet(this.props, this.state)
    }

    componentDidMount() {
      if (this.state.theme) {
        this.unsubscribe = themeListener.subscribe(this.context, this.setTheme)
      }
    }

    componentWillUpdate(nextProps: StyledElementPropsType, nextState: StateType) {
      if (dynamicStyle) this.updateSheet(nextProps, nextState)
    }

    componentWillUnmount() {
      availableDynamicTagNames.push(this.dynamicTagName)

      if (typeof this.unsubscribe === 'function') this.unsubscribe()
    }

    setTheme = (theme: Object) => this.setState({theme})

    dynamicTagName = ''
    sheet: JssSheet
    staticClassName = ''
    unsubscribe: ?Function

    updateSheet(props: StyledElementPropsType, {theme}: StateType) {
      let rule
      let ruleIndex = 0

      // nested styles become to flatten rules, so we need to update each nested rule
      for (ruleIndex; ruleIndex < classMap[this.dynamicTagName].length; ruleIndex++) {
        rule = classMap[this.dynamicTagName][ruleIndex]

        if (isFunctionStyle) {
          const context = {theme}

          if (process.env.NODE_ENV !== 'production' && !context.theme) {
            Object.defineProperty(context, 'theme', ({
              get: () => {
                throw new StyledJssError('You should wrap your Application by ThemeProvider to use theme')
              }
            }: Object))
          }

          this.sheet.update(rule.key, {props, context})
        }
        else {
          this.sheet.update(rule.key, props)
        }
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
