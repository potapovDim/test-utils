const toPromisItems = (sleep, value) => new Promise((resolve) => {
  setTimeout(() => resolve(value), sleep)
})



class Queue {
  constructor() {
    this.dataItem = null
    this.queueItems = []
  }

  get data() {
    return this.dataItem
  }

  set data(item) {
    this.dataItem = item
  }

  wrapInQueue(f) {
    this.queueItems.push(f)
  }

  clearQueue() {
    this.queueItems = []
  }

  runQueu() {
    return this.queueItems.reduce((accResolver, queueItem) => {
      return accResolver.then((value) => {
        this.data = value
        // console.log(value)
        return queueItem()
      })
    }, Promise.resolve(null))
  }
}


function ELEMENTAPI(that /* worker class item*/) {
  const elementAPI = {
    sendKeys: () => {
    }
  }
}



class WorkeItemClient {
  constructor() {
    this.queue = new Queue()
  }

  execute() {
    this.queue.runQueu()
    this.queue.clearQueue()
  }

  data(cb) {
    this.queue.wrapInQueue(() => cb(this.queue.data))

    return this
  }

  functionFirst() {
    this.queue.wrapInQueue(() => toPromisItems(1500, 'test 1'))
    return this
  }
  functionSecont() {
    this.queue.wrapInQueue(() => toPromisItems(800, 'test 2'))
    return this
  }
  functionThird() {
    this.queue.wrapInQueue(() => toPromisItems(800, 'test 3'))
    return this
  }
  functionFourth() {
    this.queue.wrapInQueue(() => toPromisItems(800, 'test 4'))
    return this
  }
  functionFivth() {
    this.queue.wrapInQueue(() => toPromisItems(800, 'test 5'))
    return this
  }
}

const item = new WorkeItemClient()

item.functionFirst().functionFourth().data((value) => {
  console.log(value, ' !!!!!!!!!!!!!!!!!!')
}).functionThird().functionSecont().functionFirst().execute()

