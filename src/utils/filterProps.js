import isNativeProp from 'is-react-prop'

export default (props: Object) => (
  Object
    .entries(props)
    .reduce((acc, [name, value]) => (isNativeProp(name)
      ? {...acc, [name]: value}
      : acc
    ), {})
)
