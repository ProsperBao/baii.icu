// 获取文件名称列表
import { resolve } from 'path'
import { readdirSync } from 'fs-extra'

export const locales = (path: string): string[] => {
  return readdirSync(resolve(path, 'locales')).map(file => file.replace('.yml', ''))
}
