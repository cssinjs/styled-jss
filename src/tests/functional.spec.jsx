import 'react-dom'
import React from 'react'
import Observable from 'zen-observable'
import Enzyme, {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {
  getCss,
  removeWhitespace
} from './utils'

import CreateApp from './App'

Enzyme.configure({adapter: new Adapter()})

let Styled
let styled

const mockNameGenerators = () => {
  let styledCounter = 0

  jest.mock('../utils/generateTagName')
  jest.mock('jss/lib/utils/createGenerateClassName')

  const generateTagName = require('../utils/generateTagName').default
  const createGenerateClassName = require('jss/lib/utils/createGenerateClassName').default

  // $FlowIgnore there is now mockImplementation in declaration
  generateTagName.mockImplementation((tagName: string) => `${tagName}-${++styledCounter}`)
  createGenerateClassName.mockImplementation(() => rule => `${rule.key}-id`)
}

const assertSheet = (sheet) => {
  expect(sheet.toString()).toMatchSnapshot()
  expect(getCss(sheet)).toBe(removeWhitespace(sheet.toString()))
}

const assertComponent = (Comp) => {
  const wrapper = mount(<Comp />)
  expect(wrapper).toMatchSnapshot()
  wrapper.unmount()
}

describe('functional tests', () => {
  beforeEach(() => {
    mockNameGenerators()

    Styled = require('../').Styled
    styled = Styled()
  })

  afterEach(() => {
    styled.sheet.detach()
  })

  it('should update props and unmount', () => {
    const App = CreateApp(styled)
    const wrapper = mount(<App />)
    const {sheet} = styled

    assertSheet(sheet)
    wrapper.setProps({margin: 20})
    assertSheet(sheet)
    wrapper.unmount()
  })

  /**
   * TODO: we should return this test when an issue with nesting order will be resolved
   * @see https://github.com/cssinjs/jss/pull/655
   */

  it.skip('should update nested props', () => {
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
    const {sheet} = styled

    assertSheet(sheet)
    wrapper.setProps({primary: true})
    assertSheet(sheet)
    wrapper.unmount()
  })

  it('should use props on remount', () => {
    const Button = styled('button')({
      color: props => (props.primary ? 'red' : 'black')
    })

    const wrapper = mount(<Button />)
    const {sheet} = styled

    assertSheet(sheet)
    wrapper
      .unmount()
      .mount()
      .setProps({primary: true})
    assertSheet(sheet)
    wrapper.unmount()
  })

  it('should update dynamic props for conditional rules', () => {
    const Button = styled('button')({
      padding: props => (props.spaced ? 10 : 0),

      '@media screen': {
        '& .button': {
          margin: props => (props.spaced ? 10 : 0)
        }
      }
    })

    const wrapper = mount(<Button spaced />)
    const {sheet} = styled

    assertSheet(sheet)
    wrapper.setProps({spaced: false})
    assertSheet(sheet)

    wrapper.unmount()
  })

  it('should use Styled Component classname in string', () => {
    const AuthorName = styled('div')({color: 'red'})
    const Avatar = styled('img')({width: props => props.width})

    const Message = styled('div')({
      [`&:not(:first-child) ${AuthorName}`]: {
        display: 'none'
      },
      [`&:not(:last-child) ${Avatar}`]: {
        visibility: 'hidden'
      },
      [`& ${AuthorName}`]: {
        color: 'green'
      }
    })

    assertComponent(() => (
      <Message>
        <AuthorName>name</AuthorName>
        <Avatar width={30} />
      </Message>
    ))

    assertSheet(styled.sheet)
  })

  describe('Compose React Components', () => {
    it('should use .name', () => {
      const Test = props => <h1 {...props}>test</h1>
      const StyledTest = styled(Test)({
        padding: 10,
      })
      assertComponent(StyledTest)
      assertSheet(styled.sheet)
    })

    it('should use .displayName', () => {
      const Test = props => <h1 {...props}>test</h1>
      Test.displayName = 'TestDisplayName'
      const StyledTest = styled(Test)({
        padding: 10,
      })
      assertComponent(StyledTest)
      assertSheet(styled.sheet)
    })

    it('should escape name in dev mode', () => {
      const Comp = ({className}: {className: string}) => (
        <div className={className}>Container</div>
      )

      Comp.displayName = '(Comp.name)'

      const Container = styled(Comp)({
        color: 'red',
      })

      const wrapper = mount(<Container />)
      const {sheet} = styled

      assertSheet(sheet)

      wrapper.unmount()
    })

    it('should use .name', () => {
      const StyledTest = styled(props => <h1 {...props}>test</h1>)({
        padding: 10,
      })
      assertComponent(StyledTest)
      assertSheet(styled.sheet)
    })

    it('should pass props', () => {
      const StyledTest = styled(props => JSON.stringify(props))({
        padding: 10,
      })
      assertComponent(() => <StyledTest testProp={1} testProp2="2" className="testClassName" />)
      assertSheet(styled.sheet)
    })
  })

  describe('Observables', () => {
    it('should use observable value', () => {
      let observer

      const Container = styled('div')({
        padding: 40,
        height: new Observable((o) => {
          observer = o
        }),
        textAlign: 'center'
      })

      const wrapper = mount(<Container />)
      const {sheet} = styled

      if (observer) {
        observer.next('10px')
        assertSheet(sheet)
      }
      else {
        throw new Error('there is no observable value')
      }


      wrapper.unmount()
    })
  })
})
