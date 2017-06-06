// @flow

import git from './git'
import cp from 'child_process'
import EventEmitter from 'events'

jest.mock('child_process')

describe('git', function () {
  afterEach(jest.resetAllMocks)

  test('runs exec', async () => {
    cp.execFile.mockImplementationOnce((cmd, args, cb) => {
      expect([cmd, args]).toEqual(['git', ['remote']])
      cb(null, 'foo')
    })
    let data = await git.exec(['remote'])
    expect(data).toEqual('foo')
  })

  test('runs spawn', async () => {
    expect.assertions(1)
    cp.spawn.mockImplementationOnce((cmd, args, opts) => {
      expect([cmd, args, opts]).toEqual(['git', ['remote'], {stdio: [0, 1, 2]}])
      let emitter = new EventEmitter()
      process.nextTick(() => emitter.emit('close'))
      return emitter
    })
    await git.spawn(['remote'])
  })

  test('gets heroku git remote config', async () => {
    // mock.expects('execFile').withArgs('git', ['config', 'heroku.remote']).yieldsAsync(null, 'staging')
    cp.execFile.mockImplementationOnce((cmd, args, cb) => {
      expect([cmd, args]).toEqual(['git', ['config', 'heroku.remote']])
      cb(null, 'staging')
    })
    let remote = await git.remoteFromGitConfig()
    expect(remote).toEqual('staging')
  })

  test('returns an http git url', function () {
    expect(git.url('foo', false)).toEqual('https://git.heroku.com/foo.git')
  })

  test('returns an ssh git url', function () {
    expect(git.url('foo', true)).toEqual('git@heroku.com:foo.git')
  })
})
