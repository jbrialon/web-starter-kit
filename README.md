# web-starter-kit

Personnal build workflow using gulp and browserify


### Usage


``` bash
$ cd browserify
$ npm install
$ npm install jquery --save // to require using browserify
```

### What's Included

- `gulp serve`:
  - sprites using [sprity](https://www.npmjs.com/package/sprity)
  - styles using [gulp-ruby-sass](https://github.com/sindresorhus/gulp-ruby-sass) and [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)  
  - copy to copy the assets in the dist folder
  - [browserify](http://browserify.org/) to bundle the javascript and require dependencies like nodeJS (see App.js)
  - Lint-on-save with [jshint](http://jshint.com/)
  - [browserSync](https://www.browsersync.io/). for hot reloading and multi device testing
  - Source maps (for js and css)

- `gulp build`: Production ready build.
  - JavaScript minified with [gulp-uglify](https://www.npmjs.com/package/gulp-uglify).
  - CSS Minify
  - CSS Cachebuster to force the reload of assets
