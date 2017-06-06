'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _api_client = require('cli-engine-heroku/lib/api_client');

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Git {
  static async exec(args) {
    let stdout = await (0, _util.promisify)(_child_process2.default.execFile)('git', args);
    return stdout.trim();
  }

  static spawn(args) {
    return new Promise(function (resolve, reject) {
      let s = _child_process2.default.spawn('git', args, { stdio: [0, 1, 2] });
      s.on('error', reject);
      s.on('close', resolve);
    });
  }

  static remoteFromGitConfig() {
    return this.exec(['config', 'heroku.remote']).catch(() => {});
  }

  static sshGitUrl(app) {
    return `git@${_api_client.vars.gitHost}:${app}.git`;
  }

  static httpGitUrl(app) {
    return `https://${_api_client.vars.httpGitHost}/${app}.git`;
  }

  static async remoteUrl(name) {
    let remotes = await this.exec(['remote', '-v']);
    return remotes.split('\n').map(r => r.split('\t')).find(r => r[0] === name)[1].split(' ')[0];
  }

  static url(app, ssh) {
    return ssh ? this.sshGitUrl(app) : this.httpGitUrl(app);
  }
}
exports.default = Git;