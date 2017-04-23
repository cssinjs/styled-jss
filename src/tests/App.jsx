import React from 'react'
import type {Styled, styledType} from '../types'

export default (styled: styledType) => {
  const App = styled('div', {
    margin: 50,
  })

  const Header = styled('header', {
    padding: 10,
  })

  const Section = styled('section', {
    color: 'red',
  })

  const AnotherSection = styled(Section, {
    color: 'yellow',
  })

  const Title = styled('h1', {
    color: 'red',
  })

  const Button: Styled<{margin: number}> = styled('button', {
    margin: ({margin = 0}) => margin,
  })

  return () => (
    <App>
      <Header>
        <Title>Title</Title>
      </Header>

      <Section data-name="content">
        <Button>primitive test</Button>
        <Button style={{margin: 10}}>dynamic primitive test</Button>
      </Section>

      <AnotherSection>Another section</AnotherSection>
    </App>
  )
}
