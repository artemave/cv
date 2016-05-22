# My CV

> Because JSON.

CV for [Alec Rust](http://www.alecrust.com/) in [JSON Resume format](https://jsonresume.org/). Hosted with GitHub Pages at: http://cv.alecrust.com/

## Quick Start

Run the following to download and run locally:

1. `git clone https://github.com/AlecRust/cv.git`
2. `cd cv`
3. `npm install`
4. `npm start`

## Making Changes

`npm start` will run `resume serve` which starts a web server and opens your browser at http://localhost:4000/.

The `index.html` file viewed here is served from `/public/index.html`. Changes to `resume.json` are built to this file after calling `render()` in `index.js` which loads the `resume.hbs` Handlebars template and the CSS from `style.css`.

## Deploying Changes

[gulp-gh-pages](https://github.com/shinnn/gulp-gh-pages) is used to push changes to the `gh-pages` branch. Run `npm run deploy` and it will push the *entire* contents of `/public` (including the untracked built files) to GitHub.

## Screenshot

![Screenshot of CV](http://cv.alecrust.com/screenshot.png)
