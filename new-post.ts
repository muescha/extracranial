import { createWriteStream } from 'fs'

const colorHexGenerator = () => {
  const letters = '0123456789ABCDEF'
  let color = ''
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const content = `
---
title: "Untitled"
draft: true
# keywords: []
# image: https://cho.sh/
---
`

const filePrefix = `${process.cwd()}/blog/`

const generatePostFile = () => {
  const fileName = `${colorHexGenerator()}.md`
  const filePath = `${filePrefix}${fileName}`
  const file = createWriteStream(filePath)
  file.write(content)
  file.end()
  console.log(`${filePath} created`)
}

generatePostFile()
