const {expect} = require('chai');
const {fetchy_util} = require('./index')('http://localhost:8087');

describe('test', () => {
  it('test post', async () => {
    const {body, status} = await fetchy_util.post('/cards', {})
    expect(status).to.eql(404)
  })
})