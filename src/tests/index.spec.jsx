import renderer from 'react-test-renderer'
import React from 'react'

import styled, {Styled} from '../'
import styledDOM, {Styled as StyledDOM} from '../dom'

import CreateAppStyled from './AppStyled'
import CreateAppStyledDOM from './AppStyledDOM'


describe('Default styled functions tests', () => {
  it('renders correctly App with default styled', () => {
    const App = CreateAppStyled(styled)
    const tree = renderer.create(<App />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly App with default Styled', () => {
    const customStyled = Styled({
      baseButton: {
        color: 'red',
      },
    })

    const App = CreateAppStyled(customStyled)
    const tree = renderer.create(<App />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})

describe('DOM styled functions tests', () => {
  it('renders correctly App with default styled', () => {
    const App = CreateAppStyledDOM(styledDOM)
    const tree = renderer.create(<App />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly App with default Styled', () => {
    const customStyled = StyledDOM({
      baseButton: {
        color: 'red',
      },
    })

    const App = CreateAppStyledDOM(customStyled)
    const tree = renderer.create(<App />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
