import {Component, createElement} from 'react'
import {getDynamicStyles} from 'jss'

import filterProps from './utils/filterProps'
import composeClasses from './utils/composeClasses'
import generateTagName from './utils/generateTagName'

import type {
  JssStaticSheet,
  JssDynamicSheet,
  ComponentStyleType,
  StyledElementPropsType
} from './types'

type StyledArgs = {
  tagName: string,
  elementStyle: ComponentStyleType,
  mountSheets: Function
}

const styled = ({tagName, elementStyle, mountSheets}: StyledArgs) => {
  const dynamicStyle = getDynamicStyles(elementStyle)
  const staticTagName = generateTagName(tagName)

  const availableDynamicTagNames = []

  return class StyledElement extends Component {
    static tagName: string = tagName
    static style: ComponentStyleType = elementStyle

    props: StyledElementPropsType

    dynamicTagName = ''
    staticSheet: JssStaticSheet
    dynamicSheet: JssDynamicSheet

    constructor(props: StyledElementPropsType) {
      super(props)
      if (!this.dynamicTagName && dynamicStyle) {
        this.dynamicTagName = availableDynamicTagNames.pop() || generateTagName(tagName)
      }
    }

    componentWillMount() {
      Object.assign(this, mountSheets())

      if (!this.staticSheet.getRule(staticTagName)) {
        this.staticSheet.addRule(staticTagName, elementStyle)
      }

      if (!dynamicStyle) return

      if (!this.dynamicSheet.getRule(this.dynamicTagName)) {
        this.dynamicSheet.addRule(this.dynamicTagName, dynamicStyle)
      }

      this.dynamicSheet.update(this.dynamicTagName, this.props)
    }

    componentWillReceiveProps(nextProps: StyledElementPropsType) {
      if (dynamicStyle) {
        this.dynamicSheet.update(this.dynamicTagName, nextProps)
      }
    }

    componentWillUnmount() {
      availableDynamicTagNames.push(this.dynamicTagName)
    }

    render() {
      if (!this.staticSheet) return null

      const {children, className, ...attrs} = this.props

      const props = filterProps(attrs)
      const tagClass = composeClasses([
        this.staticSheet.classes[staticTagName],
        this.dynamicSheet.classes[this.dynamicTagName],
        className
      ])

      return createElement(tagName, {...props, className: tagClass}, children)
    }
  }
}

export default styled
