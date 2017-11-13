import escapeClassName from './escapeClassName'

let tagNameCounter = 0

export default (tagName: string) => `${escapeClassName(tagName)}-${++tagNameCounter}`
