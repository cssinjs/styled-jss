# Styled Components on top of JSS

## Install

This has peer dependencies of `react` and `react-dom`, which will have to be installed as well.

```sh
npm install --save styled-jss
```

## Usage

### With default styled function

```js
import styled from 'styled-jss'

const Button = styled('button', {
  fontSize: 12,
  color: (props) => props.theme.textColor
})

// Composition.
const PrimaryButton = styled(Button, {
  color: 'red'
})
```

### With default styled function with DOM support

Note that **styled DOM** has backward capability with original **styled**

```js
import { styled } from 'styled-jss/dom'

const Button = styled.button({
  fontSize: 12,
  color: (props) => props.theme.textColor
})

// Composition.
const PrimaryButton = styled(Button, {
  color: 'red'
})
```

### With base Style Sheet

Using base Style Sheet we can share classes between styled primitives.

```js
import {Styled} from 'styled-jss'
// You can also similarly use Styled to provide styled with DOM:
// import {Styled} from 'styled-jss/dom'
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
  border: [1, 'solid', 'grey'],
  color: 'black'
})

// Composition - same way.
const PrimaryButton = styled(NormalButton, {
  color: 'red'
})

// One can use classes AND styled primitives.
const MyComponent = ({classes}) => (
  <div className={classes.root}>
    <PrimaryButton>primary button</PrimaryButton>
  </div>
)

const MyStyledComponent = injectSheet(styled.styles)(MyComponent)
```

### With custom JSS setup:

```js
import { create as createJss } from 'jss'
import vendorPrefixer from 'jss-vendor-prefixer'

import { createStyled } from 'styled-jss'
// for stlyed-jss/dom it's the same

const jss = createJss()
jss.use(vendorPrefixer())

// Create custom Styled, that allows to set BaseStyles
const Styled = createStyled(jss)

// Create custom styled function without BaseStyles accordingly
export const styled = createStyled()

export default Styled
```

## License

MIT
