import {createElement} from 'react'

import composeClasses from './utils/composeClasses'
import type {StyledType} from './types'

const injectStyled = (styled: StyledType) => (InnerComponent: ReactClass<any>) => {
  const {staticSheet, dynamicSheet} = styled.mountSheets()

  const classNames = Object.keys({...staticSheet.classes, ...dynamicSheet.classes})

  const classes = [...classNames]
    .reduce((acc, name) => ({
      ...acc,
      [name]: composeClasses(staticSheet.classes[name], dynamicSheet.classes[name]),
    }), {})

  return (props: Object) => createElement(InnerComponent, {classes, ...props})
}

export default injectStyled
