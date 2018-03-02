import {create as createJss} from 'jss'
import preset from 'jss-preset-default'

import createStyled from './createStyled'

const jss: Function = createJss(preset())

export {ThemeProvider} from 'theming'

export const Styled = createStyled(jss)
export default Styled()

export {default as injectStyled} from './injectStyled'
