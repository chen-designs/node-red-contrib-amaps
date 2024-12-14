import Apis from '@/libs/apis'
import { createNode, evaluateNodeProperty } from '@/libs/utils'

export default function (RED) {
  // 路径规划
  RED.nodes.registerType('amaps-routes', function (config) {
    const {} = createNode(RED, this, config)
    // 获取配置信息
    const { apis } = RED.nodes.getNode(config.amaps) as { apis: Apis }
    if (!apis) this.error('没有配置正确的地图配置')
    // 监听输入
    this.on('input', async (msg, send, done) => {
      try {
        this.status({ fill: 'blue', shape: 'dot', text: 'Running' })
        // 获取起点坐标、终点坐标、起点城市、终点城市、请求日期、请求时间、车牌号码
        const mode = await evaluateNodeProperty(config.mode, config.mode_type, this, msg, RED)
        const origin = await evaluateNodeProperty(config.origin, config.origin_type, this, msg, RED)
        const destination = await evaluateNodeProperty(config.destination, config.destination_type, this, msg, RED)
        const city1 = await evaluateNodeProperty(config.city1, config.city1_type, this, msg, RED, value => {
          if (/^(\d+)$/.test(value)) return value
          return apis
            .search({ keywords: value, subdistrict: 0 })
            .then(result => result.districts?.[0] || {})
            .then(result => result.adcode || result.citycode || value)
            .catch(() => value)
        })
        const city2 = await evaluateNodeProperty(config.city2, config.city2_type, this, msg, RED, value => {
          if (/^(\d+)$/.test(value)) return value
          return apis
            .search({ keywords: value, subdistrict: 0 })
            .then(result => result.districts?.[0] || {})
            .then(result => result.adcode || result.citycode || value)
            .catch(() => value)
        })
        const date = await evaluateNodeProperty(config.date, config.date_type, this, msg, RED)
        const time = await evaluateNodeProperty(config.time, config.time_type, this, msg, RED)
        const plate = await evaluateNodeProperty(config.plate, config.plate_type, this, msg, RED)
        const strategy1 = await evaluateNodeProperty(config.strategy1, config.strategy1_type, this, msg, RED)
        const strategy2 = await evaluateNodeProperty(config.strategy2, config.strategy2_type, this, msg, RED)
        const cartype = await evaluateNodeProperty(config.cartype, config.cartype_type, this, msg, RED)
        const ferry = await evaluateNodeProperty(config.ferry, config.ferry_type, this, msg, RED)
        const strategy = mode === 'transit' ? strategy1 : strategy2
        await apis
          .routes(mode, { origin, destination, strategy, city1, city2, date, time, plate, cartype, ferry })
          .then(res => send(Object.assign(msg, { payload: res.route.paths || res.route.transits || [] })))
          .then(() => this.status({ fill: 'green', shape: 'dot', text: 'Success' }))
          .finally(done)
      } catch (error: any) {
        if (done) done(error)
        this.status({ fill: 'red', shape: 'dot', text: error.message })
      }
    })
    this.on('close', () => this.status({}))
  })
}
