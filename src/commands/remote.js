// @flow

import {Command, flags} from 'cli-engine-heroku'

export default class GitRemote extends Command {
  static topic = 'git'
  static command = 'remote'
  static description = 'adds a git remote to an app repo'
  static help = `extra arguments will be passed to git remote add

Examples:

  # set git remote heroku to https://git.heroku.com/example.git
  $ heroku git:remote -a example

  # set git remote heroku-staging to https://git.heroku.com/example-staging.git
  $ heroku git:remote --remote heroku-staging -a example`
  static variableArgs = true

  static flags = {
    app: flags.string({char: 'a', description: 'the Heroku app to use'}),
    remote: flags.string({char: 'r', description: 'the git remote to create'}),
    'ssh-git': flags.boolean({description: 'use SSH git protocol'})
  }

  async run () {
    const git = require('../git').default
    let appName = this.flags.app || this.argv.shift()
    if (!appName) throw new Error('Specify an app with --app')
    let app = await this.heroku.get(`/apps/${appName}`)
    let remote = this.flags.remote || (await git.remoteFromGitConfig()) || 'heroku'
    let remotes = await git.exec(['remote'])
    let url = git.url(app.name, this.flags['ssh-git'])
    if (includes(remotes.split('\n'), remote)) {
      await git.exec(['remote', 'set-url', remote, url].concat(this.argv))
    } else {
      await git.exec(['remote', 'add', remote, url].concat(this.argv))
    }
    let newRemote = await git.remoteUrl(remote)
    this.out.log(`set git remote ${this.out.color.cyan(remote)} to ${this.out.color.cyan(newRemote)}`)
  }
}

function includes (array, item) {
  return array.indexOf(item) !== -1
}
