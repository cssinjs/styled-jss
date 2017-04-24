import asap from 'asap'

import type {
  JssDynamicSheet
} from '../types'

export const dynamicSheets = []
let sheetsToUpdate = {}

export const observe = () => {
  const sheetIds = Object.keys(sheetsToUpdate)
  if (sheetIds.length) {
    sheetsToUpdate = {}
    sheetIds.forEach(sheetId =>
      dynamicSheets[Number(sheetId)].attach().link())
  }
}

export default {
  listen() {
    asap(observe)
  },
  add(sheet: JssDynamicSheet) {
    dynamicSheets.push(sheet)
    return dynamicSheets.length - 1
  },
  update(sheetId: number) {
    sheetsToUpdate[sheetId] = true
  }
}
