// @flow

import GitRemote from './remote'
import nock from 'nock'

const api = nock('https://api.heroku.com')

beforeEach(() => nock.cleanAll())
afterEach(() => api.done())

describe('git:remote', () => {
  it('errors if no app', async () => {
    expect.assertions(1)
    try {
      await GitRemote.mock()
    } catch (err) {
      expect(err.message).toEqual('Specify an app with --app')
    }
  })

  it.only('replaces an http-git remote', function () {
    let git = require('../mock/git')
    let mock = sinon.mock(git)
    mock.expects('exec').withExactArgs(['remote']).once().returns(Promise.resolve('heroku'))
    mock.expects('exec').withExactArgs(['remote', 'set-url', 'heroku', 'https://git.heroku.com/myapp.git']).once().returns(Promise.resolve())
    let remote = proxyquire('../../commands/git/remote', {'../../lib/git': () => git})
    let api = nock('https://api.heroku.com')
      .get('/apps/myapp')
      .reply(200, {name: 'myapp'})

    return remote.run({flags: {app: 'myapp'}, args: []})
    .then(() => expect(cli.stdout, 'to equal', 'set git remote heroku to https://git.heroku.com/myapp.git\n'))
    .then(() => {
      mock.verify()
      mock.restore()
      api.done()
    })
  })

  it('adds an http-git remote', function () {
    let git = require('../mock/git')
    let mock = sinon.mock(git)
    mock.expects('exec').withExactArgs(['remote']).once().returns(Promise.resolve(''))
    mock.expects('exec').withExactArgs(['remote', 'add', 'heroku', 'https://git.heroku.com/myapp.git']).once().returns(Promise.resolve())
    let remote = proxyquire('../../commands/git/remote', {'../../lib/git': () => git})
    let api = nock('https://api.heroku.com')
      .get('/apps/myapp')
      .reply(200, {name: 'myapp'})

    return remote.run({flags: {app: 'myapp'}, args: []})
    .then(() => expect(cli.stdout, 'to equal', 'set git remote heroku to https://git.heroku.com/myapp.git\n'))
    .then(() => {
      mock.verify()
      mock.restore()
      api.done()
    })
  })
})
