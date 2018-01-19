let tagNameCounter = 0

export default (tagName: string) => `${tagName}-${++tagNameCounter}`
