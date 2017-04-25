import sheetsObserver, {observe, dynamicSheets} from '../utils/sheetsObserver'

const Mocks = {
  // $FlowFixMe: get/set are not supported yet by flow
  get sheetMock() {
    const mock = {
      attach: jest.fn(),
      link: jest.fn(),
    }
    mock.attach.mockReturnValue(mock)
    mock.link.mockReturnValue(mock)
    return mock
  }
}

it('should add sheet and return sheetId', () => {
  const {sheetMock} = Mocks
  const sheetId = sheetsObserver.add(sheetMock)

  expect(dynamicSheets).toEqual([sheetMock])
  expect(sheetId).toEqual(0)
})

it('should reattach updated sheet by observe call', () => {
  const {sheetMock} = Mocks
  const sheetId = sheetsObserver.add(sheetMock)
  sheetsObserver.update(sheetId)

  observe()

  expect(sheetMock.attach).toHaveBeenCalled()
  expect(sheetMock.link).toHaveBeenCalled()
})

it('should reattach updated sheet by listner', (done) => {
  const {sheetMock} = Mocks
  sheetsObserver.listen()

  const sheetId = sheetsObserver.add(sheetMock)
  sheetsObserver.update(sheetId)

  setTimeout(() => {
    expect(sheetMock.attach).toHaveBeenCalledTimes(1)
    expect(sheetMock.link).toHaveBeenCalledTimes(1)
    done()
  }, 100)
})
