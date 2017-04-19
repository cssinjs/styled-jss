import renderer from 'react-test-renderer'
import React from 'react'

import Styled, { styled } from '../'

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
