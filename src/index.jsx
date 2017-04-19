import React from 'react'
import injectSheetDefault from 'react-jss'


type StyledElementType = Function & { Tag: string, styles: Object }
type PrimitiveProps = {
  classes: Object,
  children?: any,
  className?: string,
}


export const prepareStyled = (injectSheet?: Function = injectSheetDefault) =>
  (
    Element: string | StyledElementType,
    styles: Object,
    baseStyles?: Object = {},
  ): StyledElementType => {
    const {
      Tag,
      styles: inheritStyles = {},
    }: {
      Tag: string,
      styles?: Object
    } = typeof Element === 'string' ? { Tag: Element } : Element

    const elementStyles = { ...inheritStyles, ...styles }

    const Primitive = ({ classes, children, className }: PrimitiveProps) =>
      <Tag className={classes[Tag].concat(className ? ` ${className}` : '')}>
        {children}
      </Tag>

    const StyledPrimitive = injectSheet({
      [Tag]: elementStyles,
      ...baseStyles,
    })(Primitive)

    return Object.assign(StyledPrimitive, { Tag, styles: elementStyles })
  }

export const styled = prepareStyled()

export const setStyledCreator = (styledFunction: Function = styled) =>
  (baseStyles: Object) => Object.assign(
    (Element: string | StyledElementType, styles: Object) =>
      styledFunction(Element, styles, baseStyles),
    { styles: baseStyles },
  )

export default setStyledCreator()
