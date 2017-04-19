import isNativeProp from './is-native-prop'


export default (props: Object) => Object
  .entries(props)
  .reduce((acc, [name, value]) => (isNativeProp(name)
    ? {...acc, [name]: value}
    : acc
  ), {})
