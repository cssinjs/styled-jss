import React from 'react'


export default (styled: Function) => {
  const App = styled.div({
    margin: 50,
  })

  const Header = styled.header({
    padding: 10,
  })

  const Section = styled.section({
    color: 'red',
  })

  const AnotherSection = styled(Section, {
    color: 'yellow',
  })

  const Title = styled.h1({
    color: 'red',
  })

  const Button = styled.button({
    margin: ({margin = 0}) => margin,
  })


  return () => (
    <App>
      <Header>
        <Title>Title</Title>
      </Header>

      <Section data-name="content">
        <Button>primitive test</Button>
        <Button margin={10}>dynamic primitive test</Button>
      </Section>

      <AnotherSection>Another section</AnotherSection>
    </App>
  )
}
