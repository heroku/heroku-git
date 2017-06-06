'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cliEngineHeroku = require('cli-engine-heroku');

class GitRemote extends _cliEngineHeroku.Command {

  async run() {
    const git = require('../git').default;
    let appName = this.flags.app || this.argv.shift();
    if (!appName) throw new Error('Specify an app with --app');
    let app = await this.heroku.get(`/apps/${appName}`);
    let remote = this.flags.remote || (await git.remoteFromGitConfig()) || 'heroku';
    let remotes = await git.exec(['remote']);
    let url = git.url(app.name, this.flags['ssh-git']);
    if (includes(remotes.split('\n'), remote)) {
      await git.exec(['remote', 'set-url', remote, url].concat(this.argv));
    } else {
      await git.exec(['remote', 'add', remote, url].concat(this.argv));
    }
    let newRemote = await git.remoteUrl(remote);
    // TODO: make sure this works
    // this.out.log(`set git remote ${this.out.color.cyan(remote)} to ${this.out.color.cyan(newRemote)}`)
  }
}

exports.default = GitRemote;
GitRemote.topic = 'git';
GitRemote.command = 'remote';
GitRemote.description = 'adds a git remote to an app repo';
GitRemote.help = `extra arguments will be passed to git remote add

Examples:

  # set git remote heroku to https://git.heroku.com/example.git
  $ heroku git:remote -a example

  # set git remote heroku-staging to https://git.heroku.com/example-staging.git
  $ heroku git:remote --remote heroku-staging -a example`;
GitRemote.variableArgs = true;
GitRemote.flags = {
  app: _cliEngineHeroku.flags.string({ char: 'a', description: 'the Heroku app to use' }),
  remote: _cliEngineHeroku.flags.string({ char: 'r', description: 'the git remote to create' }),
  'ssh-git': _cliEngineHeroku.flags.boolean({ description: 'use SSH git protocol' })
};
function includes(array, item) {
  return array.indexOf(item) !== -1;
}