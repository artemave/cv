const http = require('node:http')
const path = require('node:path')
const postcss = require('postcss')
const fs = require('fs-extra')
const chokidar = require('chokidar')
const Handlebars = require('handlebars')
const { parseISO, format } = require('date-fns')
const puppeteer = require('puppeteer')

const DEV_PORT = 4000

Handlebars.registerHelper('friendlyDate', function (datestamp) {
  if (datestamp) {
    return format(parseISO(datestamp), 'do MMM yyyy')
  }
  return 'present'
})

async function copyPublic() {
  try {
    await fs.copy('src/public', 'public')
    await fs.copy('src/resume.json', 'public/artem-avetisyan-cv.json')
    console.log('✅ Public files copied')
  } catch (error) {
    console.error('❌ Error copying public files:', error)
    process.exit(1)
  }
}

async function buildHtml() {
  try {
    const template = Handlebars.compile(
      await fs.readFile('src/resume.hbs', 'utf8'),
    )
    const resume = await fs.readJson('src/resume.json')
    await fs.outputFile('public/index.html', template({ resume }))
    console.log('✅ HTML built')
  } catch (error) {
    console.error('❌ Error building HTML:', error)
    process.exit(1)
  }
}

async function buildStyles() {
  try {
    const inputPath = 'src/styles/style.css'
    const outputPath = 'public/style.min.css'
    const css = await fs.readFile(inputPath, 'utf8')
    const result = await postcss([
      require('postcss-import'),
      require('postcss-preset-env')({
        stage: 0,
      }),
      require('cssnano'),
    ]).process(css, {
      from: inputPath,
      to: outputPath,
    })
    await fs.outputFile(outputPath, result.css)
    console.log(`✅ CSS built`)
  } catch (error) {
    console.error('❌ Error building CSS:', error)
    process.exit(1)
  }
}

async function buildPdf() {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox'],
    })
    const page = await browser.newPage()
    await page.goto(`file://${__dirname}/public/index.html`, {
      waitUntil: 'networkidle0',
    })
    await page.pdf({
      path: 'public/artem-avetisyan-cv.pdf',
      margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' },
    })
    await browser.close()
    console.log('✅ PDF built')
  } catch (error) {
    console.error('❌ Error building PDF:', error)
    process.exit(1)
  }
}

function watch() {
  console.log('👀 Watching for changes...')
  chokidar
    .watch('src/styles', {
      ignoreInitial: true,
      ignored: (path, stats) => stats?.isFile() && !path.endsWith('.css'),
    })
    .on('all', async (event, path) => {
      console.log(`🛠️ Changes detected in ${path}`)
      await buildStyles()
    })
  chokidar
    .watch(['src/resume.json', 'src/resume.hbs'], { ignoreInitial: true })
    .on('all', async (event, path) => {
      console.log(`🛠️ Changes detected in ${path}`)
      await copyPublic()
      await buildHtml()
    })
}

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}

function serve() {
  http
    .createServer(async (req, res) => {
      const { pathname } = new URL(req.url, 'http://localhost')
      const file = path.join(
        'public',
        decodeURIComponent(
          pathname.endsWith('/') ? `${pathname}index.html` : pathname,
        ),
      )
      try {
        const body = await fs.readFile(file)
        res.writeHead(200, {
          'Content-Type': CONTENT_TYPES[path.extname(file)],
        })
        res.end(body)
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
        res.writeHead(404)
        res.end()
      }
    })
    .listen(DEV_PORT, () =>
      console.log(`🌐 Serving on http://localhost:${DEV_PORT}`),
    )
}

async function build() {
  console.log('🚀 Building assets...')
  await copyPublic()
  await buildHtml()
  await buildStyles()
  await buildPdf()
  console.log('🎉 Build completed.')

  if (process.argv.includes('--watch')) {
    watch()
    if (process.argv.includes('--serve')) serve()
  } else {
    process.exit()
  }
}

build()
