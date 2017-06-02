'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const topic = exports.topic = { name: 'git', description: 'manage local git repository for app' };

const commands = exports.commands = [require('./commands/remote'), require('./commands/clone')];