import isReactProp from 'is-react-prop'

export default (props: Object) => {
  const filtered = {}
  const propNames = Object.keys(props)
  let name

  for (let i = 0; i < propNames.length; i++) {
    name = propNames[i]
    if (isReactProp(name)) {
      filtered[name] = props[name]
    }
  }

  return filtered
}
