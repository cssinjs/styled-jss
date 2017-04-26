export default (classes: Array<?string | boolean>) => {
  const filtered = []
  for (let len = classes.length, index = 0; index < len; index++) {
    if (classes[index]) filtered.push(classes[index])
  }

  return filtered.join(' ')
}
