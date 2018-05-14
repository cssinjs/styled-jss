/* @flow */

import {createElement} from 'react'
import type {ComponentType} from 'react'

import composeClasses from './utils/composeClasses'
import type {StyledType} from './types'

const injectStyled = (styled: StyledType) => (InnerComponent: ComponentType<any>) => {
  const sheet = styled.mountSheet()

  const classes = Object.keys(sheet.classes).reduce((acc, name) => ({
    ...acc,
    [name]: composeClasses([sheet.classes[name]]),
  }), {})

  return (props: Object) => createElement(InnerComponent, {classes, ...props})
}

export default injectStyled
