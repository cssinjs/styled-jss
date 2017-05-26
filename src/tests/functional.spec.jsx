import 'react-dom'
import React from 'react'
import {stripIndent} from 'common-tags'
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
  let jssCounter = 0

  jest.mock('../utils/generateTagName')
  jest.mock('jss/lib/utils/generateClassName')

  const generateTagName = require('../utils/generateTagName').default
  const generateClassName = require('jss/lib/utils/generateClassName').default

  // $FlowIgnore
  generateTagName.mockImplementation((tagName: string) => `${tagName}-${++styledCounter}`)
  generateClassName.mockImplementation(rule => `${rule.name}-${++jssCounter}`)
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

    expect(sheet.toString()).toBe(stripIndent`
      .div-1-1 {
        margin: 50px;
      }
      .header-2-2 {
        padding: 10px;
      }
      .h1-5-3 {
        color: red;
      }
      .section-3-4 {
        color: red;
      }
      .button-6-5 {
        margin: 0;
      }
      .button-7-6 {
        margin: 10px;
      }
      .section-4-7 {
        color: yellow;
      }
    `)

    wrapper.setProps({margin: 20})

    expect(sheet.toString()).toBe(stripIndent`
      .div-1-1 {
        margin: 50px;
      }
      .header-2-2 {
        padding: 10px;
      }
      .h1-5-3 {
        color: red;
      }
      .section-3-4 {
        color: red;
      }
      .button-6-5 {
        margin: 0;
      }
      .button-7-6 {
        margin: 20px;
      }
      .section-4-7 {
        color: yellow;
      }
    `)

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

    expect(sheet.toString()).toBe(stripIndent`
      .button-1 {
        font-size: 12px;
      }
      .div-1-2 {
        padding: 15px;
      }
      .div-3-3:hover .button-1 {
        color: green;
      }
      .div-4-7:hover .button-1 {
        color: red;
      }
    `)

    expect(getCss(sheet)).toBe(removeWhitespace(sheet.toString()))

    wrapper.setProps({primary: true})

    expect(sheet.toString()).toBe(stripIndent`
      .button-1 {
        font-size: 12px;
      }
      .div-1-2 {
        padding: 15px;
      }
      .div-3-3:hover .button-1 {
        color: red;
      }
      .div-4-7:hover .button-1 {
        color: green;
      }
    `)

    expect(getCss(sheet)).toBe(removeWhitespace(sheet.toString()))

    wrapper.unmount()
  })
})
