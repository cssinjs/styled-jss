import 'react-dom'
import renderer from 'react-test-renderer'
import React from 'react'

import styled, {Styled, injectStyled} from '../'

import CreateApp from './App'


it('renders correctly App with default styled', () => {
  const App = CreateApp(styled)
  const tree = renderer.create(<App />).toJSON()

  expect(tree).toMatchSnapshot()
})

it('renders correctly App with default Styled', () => {
  const customStyled = Styled({
    baseButton: {
      color: 'red',
    },
  })

  const App = CreateApp(customStyled)
  const tree = renderer.create(<App />).toJSON()

  expect(tree).toMatchSnapshot()
})

it('renders correctly App with injectStyled', () => {
  const customStyled = Styled({
    root: {
      fontSize: 16
    },
    baseButton: {
      color: 'red',
    },
  })

  const App = CreateApp(customStyled)
  const StyledApp = injectStyled(customStyled)(({classes}) => (
    <div className={classes.root}><App /></div>
  ))
  const tree = renderer.create(<StyledApp />).toJSON()

  expect(tree).toMatchSnapshot()
})
