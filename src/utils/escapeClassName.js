const re = /([.()])/g

export default (className: string) => className.replace(re, '\\$&')
