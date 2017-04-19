import React from 'react'
import injectSheetDefault from 'react-jss'
import { pure } from 'recompose'


type StyledElementType = Function & { Tag: string, styles: Object }


export const prepareStyled = (injectSheet: Function = injectSheetDefault) =>
  (
    Element: string | StyledElementType,
    styles: Object,
    baseStyles: ?Object = {},
  ): StyledElementType => {
    const {
      Tag,
      styles: inheritStyles = {},
    }: {
      Tag: string,
      styles?: Object
    } = typeof Element === 'string' ? { Tag: Element } : Element

    const elementStyles = { ...inheritStyles, ...styles }

    const StyledElement = pure(
      injectSheet({ [Tag]: elementStyles, ...baseStyles })(({ classes, children }) =>
        <Tag className={classes[Tag]}>
          {children}
        </Tag>,
      ),
    )

    return Object.assign(StyledElement, { Tag, styles: elementStyles })
  }

export const styled = prepareStyled()

export const setStyledCreator = (styledFunction: Function = styled) =>
  (baseStyles: Object) => Object.assign(
    (Element: string | StyledElementType, styles: Object) =>
      styledFunction(Element, styles, baseStyles),
    { styles: baseStyles },
  )

export default setStyledCreator()
