import checkAttr from 'is-react-prop/checkAttr'

export default (tag: string) => (props: Object) => {
  const filtered = {}
  const propNames = Object.keys(props)
  let name

  for (let i = 0; i < propNames.length; i++) {
    name = propNames[i]
    if (checkAttr(tag, name)) {
      filtered[name] = props[name]
    }
  }

  return filtered
}
