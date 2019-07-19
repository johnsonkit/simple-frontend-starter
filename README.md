# Introduction
A simple-frontend-starter utilizes the gulp toolkit for automating tasks in your development workflow.

Prominent features:
* Templating engine
    * e.g. using 'gulp-nunjucks-render' with 'gulp-yaml', 'gulp-merge-json', 'gulp-data' packages.
* Local server & Live reloading
    * i.e. browserSync
* CSS pre-processor
    * i.e. 'gulp-sass' package
    * A CSS preprocessor is a scripting language that extends CSS by allowing developers to write code in one language and then compile it into CSS.
* CSS post-processor
    * i.e. 'gulp-autoprefixer' package
    * Parse CSS and add vendor prefixes to rules by 'Can I Use'[1].
* Babel
    * i.e. 'gulp-babel' package
    * It is a JavaScript compiler, so that you can use next generation JavaScript today.
* Inject inline CSS and JS into HTML 
    * i.e. 'gulp-inline-source' package
    * Inline and compress tags that contain the 'inline' attribute, noted that supports <script>, <link>, and <img> tages.
* Inline CSS
    * i.e. 'gulp-inline-css' package
    * Inline your CSS properties into the style attribute in an html file. It's useful when developing an EDM html file. 
* Minification
    * HTML, CSS, and JS can be minified. 
    * e.g. 'gulp-htmlmin', 'gulp-cssnano', 'gulp-uglify' packages.
* Images compression 
    * i.e. 'gulp-imagemin'    

# Usage
'default' task:
* For development used.
* Automatically open the local server.
* If source files of yml, njk, nunjucks, html, scss, and js changed, the local server will reload automatically.
* Run `gulp` to execute the task.

'dist' task:
* For distribution / production used.
* Combining multiple CSS and JS files, storing those files' source code into a single HTML file, reducing the number of HTTP requests.
* Images will be compressed.
* Compressing all CSS, JS and HTML files to reduce file size.
* Run `gulp dist` to execute the task.

'dist:edm' task:
* Especially useful for sending EDM.
* The goal is creating the inline styles HTML file.
* Run `gulp dist:edm` to execute the task.

# Reference
[1] https://caniuse.com/