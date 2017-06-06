// @flow

import cp from 'child_process'
import {vars} from 'cli-engine-heroku/lib/api_client'
import {promisify} from 'util'

export default class Git {
  static async exec (args: string[]) {
    let stdout = await promisify(cp.execFile)('git', args)
    return stdout.trim()
  }

  static spawn (args: string[]) {
    return new Promise(function (resolve, reject) {
      let s = cp.spawn('git', args, {stdio: [0, 1, 2]})
      s.on('error', reject)
      s.on('close', resolve)
    })
  }

  static remoteFromGitConfig () {
    return this.exec(['config', 'heroku.remote']).catch(() => {})
  }

  static sshGitUrl (app) {
    return `git@${vars.gitHost}:${app}.git`
  }

  static httpGitUrl (app) {
    return `https://${vars.httpGitHost}/${app}.git`
  }

  static async remoteUrl (name) {
    let remotes = await this.exec(['remote', '-v'])
    return remotes.split('\n')
    .map((r) => r.split('\t'))
    .find((r) => r[0] === name)[1]
    .split(' ')[0]
  }

  static url (app, ssh) {
    return ssh ? this.sshGitUrl(app) : this.httpGitUrl(app)
  }
}
