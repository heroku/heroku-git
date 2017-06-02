// @flow

import {Command, flags} from 'cli-engine-heroku'

export default class GitClone extends Command {
  static topic = 'git'
  static command = 'clone'
  static description = 'clones a heroku app to your local machine at DIRECTORY (defaults to app name)'
  static help = `Examples:

  $ heroku git:clone -a example
  Cloning into 'example'...
  remote: Counting objects: 42, done.
  ...`

  static args = [
    {name: 'directory', optional: true, description: 'where to clone the app'}
  ]

  static flags = {
    app: flags.string({char: 'a', description: 'the Heroku app to use'}),
    remote: flags.string({char: 'r', description: 'the git remote to create, default "heroku"'}),
    'ssh-git': flags.boolean({description: 'use SSH git protocol'})
  }

  async run () {
    let git = require('../git').default
    let appName = this.flags.app
    if (!appName) throw new Error('Specify an app with --app')
    let app = await this.heroku.get(`/apps/${appName}`)
    let directory = this.args.directory || app.name
    let remote = this.flags.remote || 'heroku'
    await git.spawn(['clone', '-o', remote, git.url(app.name, this.flags['ssh-git']), directory])
  }
}
