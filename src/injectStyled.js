import {createElement} from 'react'

import composeClasses from './utils/compose-classes'
import type {styledType} from './types'

const injectStyled = (styled: styledType) => (InnerComponent: ReactClass<any>) => {
  styled.mountSheets()

  const {sheets} = styled
  const {staticSheet, dynamicSheet} = sheets

  const classNames = new Set([
    ...Object.keys(staticSheet.classes),
    ...Object.keys(dynamicSheet.classes)
  ])

  const classes = [...classNames]
    .reduce((acc, name) => ({
      ...acc,
      [name]: composeClasses(staticSheet.classes[name], dynamicSheet.classes[name]),
    }), {})

  return (...props: any) => createElement(InnerComponent, {sheets, classes, ...props})
}

export default injectStyled
