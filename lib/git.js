'use strict'

let child_process = require('child_process')

module.exports = function (context) {
  function exec (args) {
    return new Promise(function (resolve, reject) {
      child_process.execFile('git', args, function (error, stdout) {
        if (error) return reject(error)
        resolve(stdout.trim())
      })
    })
  }

  function spawn (args) {
    return new Promise(function (resolve, reject) {
      let s = child_process.spawn('git', args, {stdio: [0, 1, 2]})
      s.on('error', reject)
      s.on('close', resolve)
    })
  }

  function remoteFromGitConfig () {
    return exec(['config', 'heroku.remote']).catch(function () {})
  }

  function sshGitUrl (app) {
    return `git@${context.gitHost}:${app}.git`
  }

  function httpGitUrl (app) {
    return `https://${context.httpGitHost}/${app}.git`
  }

  function remoteUrl (name) {
    return exec(['remote', '-v'])
    .then(function (remotes) {
      return remotes.split('\n')
      .map((r) => r.split('\t'))
      .find((r) => r[0] === name)[1]
      .split(' ')[0]
    })
  }

  function url (app, ssh) {
    return ssh ? sshGitUrl(app) : httpGitUrl(app)
  }

  return {
    exec,
    spawn,
    remoteFromGitConfig,
    remoteUrl,
    url
  }
}
