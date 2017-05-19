import {createElement} from 'react'

import composeClasses from './utils/composeClasses'
import type {StyledType} from './types'

const injectStyled = (styled: StyledType) => (InnerComponent: ReactClass<any>) => {
  const sheet = styled.mountSheet()

  const classNames = Object.keys(sheet.classes)

  const classes = [...classNames]
    .reduce((acc, name) => ({
      ...acc,
      [name]: composeClasses([sheet.classes[name]]),
    }), {})

  return (props: Object) => createElement(InnerComponent, {classes, ...props})
}

export default injectStyled
