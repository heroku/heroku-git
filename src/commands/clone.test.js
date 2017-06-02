// @flow

import GitClone from './clone'
import nock from 'nock'
const git = require('../git').default
jest.mock('../git', () => ({
  default: {
    spawn: jest.fn(),
    url: jest.fn()
  }
}))

let api = nock('https://api.heroku.com')
beforeEach(() => nock.cleanAll())
afterEach(() => {
  api.done()
  jest.resetAllMocks()
})

it('errors if no app given', async () => {
  expect.assertions(1)

  try {
    await GitClone.mock()
  } catch (err) {
    expect(err.message).toEqual('Specify an app with --app')
  }
})

it('clones the repo', async () => {
  api
    .get('/apps/myapp')
    .reply(200, {name: 'myapp'})
  git.url.mockReturnValueOnce('https://git.heroku.com/myapp.git')
  await GitClone.mock('--app', 'myapp')
  expect(git.url).toHaveBeenCalledWith('myapp', undefined)
  expect(git.spawn).toHaveBeenCalledWith(['clone', '-o', 'heroku', 'https://git.heroku.com/myapp.git', 'myapp'])
})

it('clones the repo with ssh-git', async () => {
  api
    .get('/apps/myapp')
    .reply(200, {name: 'myapp'})
  git.url.mockReturnValueOnce('git@heroku.com:myapp.git')
  await GitClone.mock('--app', 'myapp', '--ssh-git')
  expect(git.url).toHaveBeenCalledWith('myapp', true)
  expect(git.spawn).toHaveBeenCalledWith(['clone', '-o', 'heroku', 'git@heroku.com:myapp.git', 'myapp'])
})
