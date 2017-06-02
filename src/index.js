// @flow

export const topic = {name: 'git', description: 'manage local git repository for app'}

export const commands = [
  require('./commands/remote'),
  require('./commands/clone')
]
