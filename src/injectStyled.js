import {createElement} from 'react'

import composeClasses from './utils/compose-classes'
import type {StyledType} from './types'

const injectStyled = (styled: StyledType) => (InnerComponent: ReactClass<any>) => {
  styled.mountSheets()

  const {sheets} = styled
  const {staticSheet, dynamicSheet} = sheets

  const classNames = Object.keys({...staticSheet.classes, ...dynamicSheet.classes})

  const classes = [...classNames]
    .reduce((acc, name) => ({
      ...acc,
      [name]: composeClasses(staticSheet.classes[name], dynamicSheet.classes[name]),
    }), {})

  return (props: Object) => createElement(InnerComponent, {classes, ...props})
}

export default injectStyled
