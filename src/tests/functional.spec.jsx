import 'react-dom'
import React from 'react'
import {stripIndent} from 'common-tags'
import {mount} from 'enzyme'

import styled from '../'

import CreateApp from './App'

describe('functional tests', () => {
  it('should update props and unmount', () => {
    const App = CreateApp(styled)
    const wrapper = mount(<App />)
    const sheet = styled.mountSheet()

    expect(sheet.toString()).toBe(stripIndent`
      .div-1-0-0 {
        margin: 50px;
      }
      .header-2-0-1 {
        padding: 10px;
      }
      .h1-5-0-2 {
        color: red;
      }
      .section-3-0-3 {
        color: red;
      }
      .button-6-0-4 {
        margin: 0;
      }
      .button-7-0-5 {
        margin: 0;
      }
      .button-8-0-6 {
        margin: 10px;
      }
      .section-4-0-7 {
        color: yellow;
      }
    `)

    wrapper.setProps({margin: 20})

    expect(sheet.toString()).toBe(stripIndent`
      .div-1-0-0 {
        margin: 50px;
      }
      .header-2-0-1 {
        padding: 10px;
      }
      .h1-5-0-2 {
        color: red;
      }
      .section-3-0-3 {
        color: red;
      }
      .button-6-0-4 {
        margin: 0;
      }
      .button-7-0-5 {
        margin: 0;
      }
      .button-8-0-6 {
        margin: 20px;
      }
      .section-4-0-7 {
        color: yellow;
      }
    `)

    wrapper.unmount()
  })
})
