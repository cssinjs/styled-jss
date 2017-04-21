import isReactProp from 'is-react-prop'

export default (props: Object) => (
  Object
    .keys(props)
    .reduce((acc, name) => (isReactProp(name)
      ? {...acc, [name]: props[name]}
      : acc
    ), {})
)
