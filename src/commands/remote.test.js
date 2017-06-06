// @flow

import GitRemote from './remote'
import nock from 'nock'
import git from '../git'

jest.mock('../git')

const api = nock('https://api.heroku.com')

beforeEach(() => nock.cleanAll())
afterEach(() => {
  jest.resetAllMocks()
  api.done()
})

describe('git:remote', () => {
  test('errors if no app', async () => {
    expect.assertions(1)
    try {
      await GitRemote.mock()
    } catch (err) {
      expect(err.message).toEqual('Specify an app with --app')
    }
  })

  test('replaces an http-git remote', async () => {
    expect.assertions(5)
    git.exec.mockImplementationOnce(async args => {
      expect(args).toEqual(['remote'])
      return 'heroku'
    })
    git.url.mockImplementationOnce(app => {
      expect(app).toEqual('myapp')
      return `https://git.heroku.com/${app}.git`
    })
    git.exec.mockImplementationOnce(async args => {
      expect(args).toEqual(['remote', 'set-url', 'heroku', 'https://git.heroku.com/myapp.git'])
    })
    git.remoteUrl.mockImplementationOnce(async args => {
      expect(args).toEqual('heroku')
      return `https://git.heroku.com/myapp.git`
    })
    api
      .get('/apps/myapp')
      .reply(200, {name: 'myapp'})

    let cmd = await GitRemote.mock('--app=myapp')
    expect(cmd.out.stdout.output).toEqual('set git remote heroku to https://git.heroku.com/myapp.git\n')
  })

  test('adds an http-git remote', async () => {
    expect.assertions(5)
    git.exec.mockImplementationOnce(async args => {
      expect(args).toEqual(['remote'])
      return ''
    })
    git.url.mockImplementationOnce(app => {
      expect(app).toEqual('myapp')
      return `https://git.heroku.com/${app}.git`
    })
    git.exec.mockImplementationOnce(async args => {
      expect(args).toEqual(['remote', 'add', 'heroku', 'https://git.heroku.com/myapp.git'])
      return ''
    })
    git.remoteUrl.mockImplementationOnce(async args => {
      expect(args).toEqual('heroku')
      return `https://git.heroku.com/myapp.git`
    })
    api
      .get('/apps/myapp')
      .reply(200, {name: 'myapp'})

    let cmd = await GitRemote.mock('--app=myapp')
    expect(cmd.out.stdout.output).toEqual('set git remote heroku to https://git.heroku.com/myapp.git\n')
  })
})
