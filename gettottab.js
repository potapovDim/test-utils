

function setGetter(that, name, getterHandler, clickOnHandler, sendKeysHandler) {
  Object.defineProperty(that, name, {
    get: function(params) {
      return {
        getData: (...args) => getterHandler(args),
        clickOn: (args) => clickOnHandler(args),
        sendKeys: (...args) => sendKeysHandler(args)
      }
    }
  })
}

class A {
  constructor() {
    setGetter(this, 'test', (args) => console.log(args))
  }
}


const a = new A()
a.test.getData('some data')
