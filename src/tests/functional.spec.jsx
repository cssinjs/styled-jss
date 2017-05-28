import 'react-dom'
import React from 'react'
import {mount} from 'enzyme'

import {
  getCss,
  removeWhitespace
} from './utils'

import CreateApp from './App'

let Styled
let styled

const mockNameGenerators = () => {
  let styledCounter = 0

  jest.mock('../utils/generateTagName')
  jest.mock('jss/lib/utils/generateClassName')

  const generateTagName = require('../utils/generateTagName').default
  const generateClassName = require('jss/lib/utils/generateClassName').default

  // $FlowIgnore
  generateTagName.mockImplementation((tagName: string) => `${tagName}-${++styledCounter}`)
  generateClassName.mockImplementation(rule => `${rule.name}-id`)
}

const assertSheet = (sheet) => {
  expect(sheet.toString()).toMatchSnapshot()
  expect(getCss(sheet)).toBe(removeWhitespace(sheet.toString()))
}

describe('functional tests', () => {
  beforeEach(() => {
    mockNameGenerators()

    Styled = require('../').Styled
    styled = Styled()
  })

  afterEach(() => {
    styled.mountSheet().detach()
  })

  it('should update props and unmount', () => {
    const App = CreateApp(styled)
    const wrapper = mount(<App />)
    const sheet = styled.mountSheet()

    assertSheet(sheet)
    wrapper.setProps({margin: 20})
    assertSheet(sheet)
    wrapper.unmount()
  })

  it('should update nested props', () => {
    styled = Styled({
      button: {
        fontSize: 12,
      },
    })

    const Div = styled('div')({
      padding: 15,
      '&:hover': {
        '& $button': {
          color: ({primary}) => (primary ? 'red' : 'green'),
        },
      },
    })

    const Button = styled('button')({
      composes: '$button',
    })

    const App = (props: {primary?: boolean}) => (
      <div>
        <Div primary={props.primary}>
          <Button>Button</Button>
        </Div>
        <Div primary={!props.primary}>
          <Button>Button</Button>
        </Div>
      </div>
    )

    const wrapper = mount(<App />)
    const sheet = styled.mountSheet()

    assertSheet(sheet)
    wrapper.setProps({primary: true})
    assertSheet(sheet)
    wrapper.unmount()
  })
})
