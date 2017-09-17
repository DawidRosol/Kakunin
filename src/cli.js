#!/usr/bin/env node
import initializer from './helpers/initializer';

const commandArgs = require('minimist')(process.argv.slice(2));
const path = require('path');
const child_process = require('child_process');
const envfile = require('node-env-file');

const isInitCommand = () => {
  return process.argv.length > 2 && process.argv[2] === 'init';
}

const getConfigPath = () => {
  const configFile = 'kakunin.conf.js';

  return (commandArgs.config)
    ? process.cwd() + '/' + commandArgs.config
    : process.cwd() + '/' + configFile;
}

const getScenariosTags = () => {
  const tags = [];

  if (commandArgs.tags !== undefined) {
    tags.push('--cucumberOpts.tags');
    tags.push(commandArgs.tags);
  }

  return tags;
}

envfile(process.cwd() + '/.env', { raise: false, overwrite: false });

if (isInitCommand()) {
  (async () => {
    await initializer.initConfig(commandArgs.advanced);
    await initializer.generateProjectStructure();
  })();
} else {
  const optionsToFilter = ['config', 'projectPath', 'disableChecks', 'tags'];

  const commandLineArgs = [];

  for(const prop in commandArgs) {
    if (prop !== '_' && !optionsToFilter.includes(prop)) {
      commandLineArgs.push(`--${prop}=${commandArgs[prop]}`);
    }
  }

  const argv = [
    './node_modules/kakunin/dist/protractor.conf.js',
    `--config=${getConfigPath()}`,
    `--projectPath=${process.cwd()}`,
    '--disableChecks',
    ...getScenariosTags(),
    ...commandLineArgs
  ];

  child_process.spawn(path.join('node_modules', '.bin', 'protractor'), argv, {
    stdio: 'inherit',
    cwd: process.cwd()
  }).once('close', () => {
    console.log('Protractor has finished');
  });
}
