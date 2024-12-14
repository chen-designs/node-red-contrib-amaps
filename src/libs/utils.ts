import mustache from 'mustache'
import { extend, isFunction, isString } from 'lodash-es'

export const STR_EMPTY = String('')

export function evaluateNodeProperty<T = any>(value: string, type: string, node: any, msg: any, RED: any, processHandler?: (value: any) => T | Promise<T>) {
  return new Promise<T>((resolve, reject) => {
    const result = isString(value) ? mustache.render(value, msg) : value
    RED.util.evaluateNodeProperty(result, type, node, msg, (err, res) => {
      if (err) return reject(err)
      return resolve(isFunction(processHandler) ? processHandler(res || null) : res || null)
    })
  })
}

export function createNode(RED: any, ctx: any, config: any) {
  return extend((RED.nodes.createNode(ctx, config), ctx), config)
}
