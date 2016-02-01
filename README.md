# web-starter-kit

Using Gulp + browserify


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
  - [browserify](http://browserify.org/) to bundle the javascript
  - Lint-on-save with [jshint](http://jshint.com/)
  - [browserSync](https://www.browsersync.io/).
  - Source maps (for js and css)

- `gulp served`: Production ready build.
  - JavaScript minified with [gulp-uglify](https://www.npmjs.com/package/gulp-uglify).
  - CSS Minify
  - CSS Cachebuster to force the reload of assets
