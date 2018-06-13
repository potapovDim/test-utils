import fetch from 'node-fetch'
import { asserters } from 'wd'

const ms = 1000;

export const timeouts = {
  ms,
  s: ms * 1,
  m: ms * 2,
  l: ms * 5,
  xl: ms * 10,
  xxl: ms * 18,
  extralong: ms * 25
}

const getSessionAndHref = (driver) => {
  const sessionId = driver.sessionID; const href = driver.configUrl.href
  return { sessionId, href }
}
/*
* return element promise
* @param {object} selector -> object, props {strategy: string, selector: string}
* @param {wddriver} wdjs driver instance
* @param {number} time -> will poll until this time ends
* @param {number} poll -> delay time
* return {wdelement} -> return promise
*/
export function getElementBy({ strategy, selector }, driver: any, time = timeouts.l, poll = 50) {
  if (strategy === 'id') {
    return driver.waitForElementById(selector, asserters.isDisplayed, time, poll)
  } else if (strategy === 'accessibility') {
    return driver.waitForElementByAccessibilityId(selector, asserters.isDisplayed, time, poll)
  } else if (strategy === 'xpath') {
    return driver.waitForElementByXPath(selector, asserters.isDisplayed, time, poll)
  }
}
/*
* return elements promise
* @param {object} selector -> object, props {strategy: string, selector: string}
* @param {wddriver} wdjs driver instance
* @param {number} time -> will poll until this time ends
* @param {number} poll -> delay time
* return {wdelement} -> return promise
*/
export function getElementsBy({ strategy, selector }, driver: any, time = timeouts.l, poll = 50) {
  if (strategy === 'id') {
    return driver.waitForElementsById(selector, asserters.isPresent, time, poll)
  } else if (strategy === 'accessibility') {
    return driver.waitForElementsByAccessibilityId(selector, asserters.isDisplayed, time, poll)
  } else if (strategy === 'xpath') {
    return driver.waitForElementsByXPath(selector, asserters.isDisplayed, time, poll)
  }
}
/*
* helper/ will wait until element disappears
* @param {wddriver} driver driver instance -> required for sessionID and current server href
* @param {wdelement} element  -> required for elementId
* @param {number} time -> will poll until this time ends
*/

export async function isElementVisible(element) {
  try {
    await element.getTagName()
    return true
  } catch (error) {
    return false
  }
}


export async function waitForElementDisapear(driver, element, time) {
  const { sessionId, href } = getSessionAndHref(driver)
  const now = +Date.now()
  try {
    const { ELEMENT } = (await element).toJSON()
    while ((+Date.now() - now) < time) {
      const body = await fetch(`${href}/session/${sessionId}/element/${ELEMENT}/size`, { method: 'GET' }).then(resp => resp.json())
      if (body.status !== 0) {
        return
      }
      await (async () => new Promise(resolve => setTimeout(() => { resolve(true) }, 500)))()
    }
    throw Error(`${time} was not enough`)
  } catch (error) {
    console.log('Element already disappeared')
    // throw error
  }
}

/*
* helper/ will request accept alert
* @param {wddriver} driver driver instance -> required for sessionID and current server href
* @param {number} time -> will poll until this time ends
*/
export async function allertWatcher(driver, time = 10000) {
  const { sessionId, href } = getSessionAndHref(driver)
  const now = +Date.now()
  const acceptAllert = async () => {
    const body = await fetch(`${href}/session/${sessionId}/accept_alert`, { method: 'POST' }).then(resp => resp.json())
    return body
  }
  while ((+Date.now() - now) < time) {
    await (async () => new Promise(resolve => setTimeout(() => { resolve(true) }, 125)))
    await acceptAllert()
  }
}

/*
* @param {wddriver} driver driver instance -> required
*/
export async function closeKeyboard(driver) {
  const ENV = process.env.PLATFORM
  if (ENV === 'ios') {
    const done = driver.elementByAccessibilityId('Done')
    const isDoneDisplayed = await done.isDisplayed()
    if (isDoneDisplayed) {
      await done.click()
    }
  } else {
    try {
      await driver.hideKeyboard()
    } catch (error) {
      if (!error.toString().includes('Soft keyboard not present')) {
        throw error
      }
    }
  }
}
/*
* helper/ will request accept alert
* @param {wddriver} driver driver instance -> required for sessionID and current server href
* @param {number} time -> will poll until this time ends
*/
export function swipeTo(driver: any, element: any, positios: { xTo: number, yTo: number }, persent: boolean = false) {
  const assertStatus = (body) => { if (body.status !== 0) throw new Error('Swipe broken') }

  const { sessionId, href } = getSessionAndHref(driver)
  const toRound = (value) => Math.round(value)

  const swipe = async (down, moveup) => {
    const bodyDown = await fetch(`${href}/session/${sessionId}/touch/down`, {
      method: 'POST', body: JSON.stringify(down)
    }).then(resp => resp.json()); assertStatus(bodyDown)
    const bodyMove = await fetch(`${href}/session/${sessionId}/touch/move`, {
      method: 'POST', body: JSON.stringify(moveup)
    }).then(resp => resp.json()); assertStatus(bodyMove)
    const bodyUp = await fetch(`${href}/session/${sessionId}/touch/up`, {
      method: 'POST', body: JSON.stringify(moveup)
    }).then(resp => resp.json()); assertStatus(bodyUp)
  }

  const getElementRects = async () => {
    if (persent) {
      const { height, width } = await driver.getWindowSize()
      positios = { xTo: width / 100 * positios.xTo, yTo: height / 100 * positios.yTo }
    }
    if (!element.simpleObject) {
      const { x, y } = await element.getLocation()
      const { width, height } = await element.getSize()
      return { x, y, width, height, positios }
    } else {
      return { ...element }
    }
  }

  return {
    fromCenter: async () => {
      const { x, y, width, height, positios } = await getElementRects()
      const center = { x: toRound(x + width / 2), y: toRound(y + height / 2) }
      const down = { params: center }
      const moveAndUp = { params: { x: center.x + positios.xTo, y: center.y + positios.yTo } }
      await swipe(down, moveAndUp)
    },
    fromBottom: async () => {
      const { x, y, width, height, positios } = await getElementRects()
      const bottom = { x: toRound(x + width / 2), y: toRound(y + height - 2) }
      const down = { params: bottom }
      const moveAndUp = { params: { x: bottom.x + positios.xTo, y: bottom.y + positios.yTo } }
      await swipe(down, moveAndUp)
    },
    fromTop: async () => {
      const { x, y, width, height, positios } = await getElementRects()
      const top = { x: toRound(x + width / 2), y: toRound(y - 2) }
      const down = { params: top }
      const moveAndUp = { params: { x: top.x + positios.xTo, y: top.y + positios.yTo } }
      await swipe(down, moveAndUp)
    }
  }
}
