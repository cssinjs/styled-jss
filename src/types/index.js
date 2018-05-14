/* @flow */
import type {Node} from 'react'

import {type JssStyle} from 'typed-styles/css/JssStyle'

export type JssStyles = {...$Exact<JssStyle>}
export type JssSheet = Object

export type BaseStylesType = JssStyles
export type ComponentStyleType = JssStyle
export type StyledType = Function & {
  mountSheet: Function,
  styles: JssStyles
}
export type StyledElementAttrsType = {tagName: string, style: ComponentStyleType[]}
export type StyledElementType = Function & StyledElementAttrsType
export type TagNameOrStyledElementType = string | StyledElementType
export type StyledElementPropsType = {
  children?: Node,
  className?: ?string,
}


const test: JssStyle = {}
