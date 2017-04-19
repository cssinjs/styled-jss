import React from 'react'
import injectSheetDefault from 'react-jss'

import filterProps from './utils/filter-props'


type StyledElementType = Function & { Tag: string, styles: Object }
type TagNameOrStyledElementType = string | StyledElementType
type PrimitivePropsType = {
  classes: Object,
  children: ?any,
  className: ?string,
}


export const createStyled = (injectSheet?: Function = injectSheetDefault) =>
  (
    TagNameOrStyledElement: TagNameOrStyledElementType,
    styles: Object,
    baseStyles?: Object = {},
  ): StyledElementType => {
    const {
      Tag,
      styles: inheritStyles = {},
    }: {
      Tag: string,
      styles?: Object
    } = typeof TagNameOrStyledElement === 'string'
      ? {Tag: TagNameOrStyledElement}
      : TagNameOrStyledElement

    const elementStyles = {...inheritStyles, ...styles}

    const Primitive = ({classes, children, className, ...attrs}: PrimitivePropsType) => {
      const props = filterProps(attrs)

      return (
        <Tag className={className ? `${classes[Tag]} ${className}` : classes[Tag]} {...props}>
          {children}
        </Tag>
      )
    }

    const StyledPrimitive = injectSheet({
      [Tag]: elementStyles,
      ...baseStyles,
    })(Primitive)

    return Object.assign(StyledPrimitive, {Tag, styles: elementStyles})
  }

const defaultStyled = createStyled()

export {defaultStyled as styled}

export const createStyledCreator = (styled: Function = defaultStyled) =>
  (baseStyles: Object) => Object.assign(
    (TagNameOrStyledElement: TagNameOrStyledElementType, styles: Object) =>
      styled(TagNameOrStyledElement, styles, baseStyles),
    {styles: baseStyles},
  )

export default createStyledCreator()
