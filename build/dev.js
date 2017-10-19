require('./check-versions')()

process.env.NODE_ENV = 'development'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.dev.conf')
var watch = require('node-watch');
var { exec } = require('child_process');

var spinner = ora('building for dev...')
spinner.start()

var build = () => {
  return new Promise((resolve, reject) => {
    rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
      if (err) {
        reject(err);
      }
      webpack(webpackConfig, function (err, stats) {
        spinner.stop()
        if (err) {
          reject(err);
        }
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
          }) + '\n\n')

        if (stats.hasErrors()) {
          console.log(chalk.red('  Build failed with errors.\n'))
          process.exit(1)
        }

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
          '  Tip: built files are meant to be served over an HTTP server.\n' +
          '  Opening index.html over file:// won\'t work.\n'
        ))

        resolve();
      })
    });
  });
};

let buildPromise = build().then(() => {
  exec('electron main.js', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`electron out: ${stdout}`);
    console.log(`electron err: ${stderr}`);
  });
}).catch((err) => {
  console.log('err:', err);
});

watch('./src', { recursive: true }, (evt, name) => {
  console.log('%s changed.', name);
  buildPromise = buildPromise.then(() => {
    return build();
  }).catch((err) => {
    console.log('err:', err);
  });
});
