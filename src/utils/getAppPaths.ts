import fs from 'fs'
import path from 'path'

export function getAppPaths(dir: string = 'app'): string[] {
  const appDirectory = path.join(process.cwd(), dir)
  return getAllFilePaths(appDirectory)
}

function getAllFilePaths(dir: string): string[] {
  let results: string[] = []
  const list = fs.readdirSync(dir)

  list.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFilePaths(filePath))
    } else {
      results.push(filePath)
    }
  })

  return results.map(path => path.replace(process.cwd(), ''))
}

