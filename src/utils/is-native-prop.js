import DOMProperty from 'react-dom/lib/DOMProperty'
import EventPluginRegistry from 'react-dom/lib/EventPluginRegistry'


const reactProps = {
  children: true,
  dangerouslySetInnerHTML: true,
  key: true,
  ref: true,

  autoFocus: true,
  defaultValue: true,
  defaultChecked: true,
  innerHTML: true,
  suppressContentEditableWarning: true,
  onFocusIn: true,
  onFocusOut: true,
}


export default (prop: string) => {
  if (
    Object.prototype.hasOwnProperty.call(DOMProperty, prop) ||
    DOMProperty.isCustomAttribute(prop)
  ) {
    return true
  }
  if (Object.prototype.hasOwnProperty.call(reactProps, prop) && reactProps[prop]) {
    return true
  }
  if (Object.prototype.hasOwnProperty.call(EventPluginRegistry.registrationNameModules, prop)) {
    return true
  }

  return false
}
