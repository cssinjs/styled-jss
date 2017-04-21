# Styled JSS

## Usage

### With Styled Creator

Styled Creator allows to share classes between styled primitives

```jsx
import Styled from 'styled-jss'
import injectSheet from 'react-jss'

// Base styles, like a regular jss object.
const styled = Styled({
  root: {
    margin: 10
  },
  baseButton: {
    padding: 10
  }
})

const NormalButton = styled('button', {
  composes: '$baseButton',
  border: '1px solid grey'
  color: 'black'
})

// Composition over styled() same like styled-components
const PrimaryButton = styled(NormalButton, {
  color: 'red'
})

// One can use classes AND styled primitives.
const MyComponent = ({classes}) => (
  <div className={classes.root}>
    <PrimaryButton>
  </div>
)

const MyStyledComponent = injectSheet(styled.styles)(MyComponent)
```

### With default styled function

```jsx
import { styled } from 'styled-jss'

const Button = styled('button', {
  fontSize: 12,
  color: (props) => props.theme.textColor
})

const PrimaryButton = styled(Button, {
  color: 'red'
})
```

### With custom JSS setup:

#### For Styled Creator:
```jsx
import {create as createJss} from 'jss'
import {create as createInjectSheet} from 'react-jss'
import vendorPrefixer from 'jss-vendor-prefixer'

import { setStyledCreator, prepareStyled } from 'styled-jss'

const jss = createJss()
jss.use(vendorPrefixer())

const injectSheet = createInjectSheet(jss)

export const styled = prepareStyled(injectSheet)

const Styled = setStyledCreator(styled)
export default Styled
```
