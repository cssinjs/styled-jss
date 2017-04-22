export type styledType = Function & {
  sheets: {
    // TODO: use types from jss
    staticSheet: Object,
    dynamicSheet: Object,
  },
  mountSheets: Function,
  styles: Object
}
export type StyledElementAttrsType = {tag: string, styles: Object}
export type StyledElementType = Function & StyledElementAttrsType
export type tagOrStyledElementTypeype = string | StyledElementType
export type StyledElementPropsType = {
  classes: Object,
  style: Object,
  children: ?any,
  className: ?string,
}
