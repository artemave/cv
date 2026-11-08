const { validate } = require('resume-schema')
const resume = require('./src/resume.json')

validate(resume, (errors) => {
  if (errors) {
    console.error('❌ resume.json is invalid:', errors)
    process.exit(1)
  }
  console.log('✅ resume.json is valid')
})
