export type JssStyles = Object
export type JssStyle = Object
export type JssSheet = Object

export type contextType = Object

export type BaseStylesType = JssStyles
export type ComponentStyleType = JssStyle | (props: Object, context: contextType) => ?JssStyle
export type StyledType = Function & {
  mountSheet: Function,
  styles: JssStyles
}
export type StyledElementAttrsType = {tagName: string, style: ComponentStyleType[]}
export type StyledElementType = Function & StyledElementAttrsType
export type TagNameOrStyledElementType = string | StyledElementType
export type StyledElementPropsType = {
  classes: Object,
  children: ?any,
  className: ?string,
}
