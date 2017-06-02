'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cliEngineHeroku = require('cli-engine-heroku');

class GitClone extends _cliEngineHeroku.Command {

  async run() {
    let git = require('../git').default;
    let appName = this.flags.app;
    if (!appName) throw new Error('Specify an app with --app');
    let app = await this.heroku.get(`/apps/${appName}`);
    let directory = this.args.directory || app.name;
    let remote = this.flags.remote || 'heroku';
    await git.spawn(['clone', '-o', remote, git.url(app.name, this.flags['ssh-git']), directory]);
  }
}
exports.default = GitClone;
GitClone.topic = 'git';
GitClone.command = 'clone';
GitClone.description = 'clones a heroku app to your local machine at DIRECTORY (defaults to app name)';
GitClone.help = `Examples:

  $ heroku git:clone -a example
  Cloning into 'example'...
  remote: Counting objects: 42, done.
  ...`;
GitClone.args = [{ name: 'directory', optional: true, description: 'where to clone the app' }];
GitClone.flags = {
  app: _cliEngineHeroku.flags.string({ char: 'a', description: 'the Heroku app to use' }),
  remote: _cliEngineHeroku.flags.string({ char: 'r', description: 'the git remote to create, default "heroku"' }),
  'ssh-git': _cliEngineHeroku.flags.boolean({ description: 'use SSH git protocol' })
};