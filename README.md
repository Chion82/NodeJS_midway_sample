#NodeJS Midway Sample
##Introduction
NodeJS midway is an advanced solution to separate frondend and backend workflow based on the main idea illustrated on http://ued.taobao.org/blog/2014/04/full-stack-development-with-nodejs/  
This is a sample project using this workflow.

##Installation
```
$ npm install
$ bower install
```

##Usage
* Run the backend server for testing. You can fetch the Python script from https://gist.github.com/Chion82/29fbadbd0d7ff888a09d . Then run  
```
$ python server.py
```

* Development mode:  
> When running in development mode, scripts & stylesheets will be compiled without being bundled

```
$ gulp update_all
$ gulp watch
$ node bin/www debug
```

* Production mode:  
> When running in production mode, scripts & stylesheets will be compiled, minified, bundled and hash-renamed.

```
$ gulp dist
$ node bin/www
```
