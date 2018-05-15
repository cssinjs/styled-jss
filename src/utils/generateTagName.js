const counters = {}

export default (tagName: string) => {
  counters[tagName] = counters[tagName] || 0
  counters[tagName]++

  return `${tagName}-${counters[tagName]}`
}
