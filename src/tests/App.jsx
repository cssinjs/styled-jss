import React from 'react'
import type {StyledType} from '../types'

export default (styled: StyledType) => {
  const App = styled('div')({
    margin: 50,
  })

  const Header = styled('header')({
    padding: 10,
  })

  // curried
  const section = styled('section')

  const Section = section({
    color: 'red',
  })

  // composition
  const AnotherSection = styled(Section)({
    color: 'yellow',
  })

  const Title = styled('h1')({
    color: 'red',
  })

  // function value
  const Button = styled('button')({
    margin: ({margin = 0}) => margin,
  })

  return ({margin = 10}: {margin?: number}) => (
    <App>
      <Header>
        <Title>Title</Title>
      </Header>

      <Section data-name="content">
        <Button>primitive test</Button>
        <Button margin={margin}>dynamic primitive test</Button>
      </Section>

      <AnotherSection>Another section</AnotherSection>
    </App>
  )
}
