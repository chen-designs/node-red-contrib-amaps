import md5 from 'md5'
import qs from 'query-string'
import { isEmpty, now, pick } from 'lodash-es'
import axios, { AxiosRequestConfig } from 'axios'
import errcodes from './errcodes.json'

const isJson = (headers: any) => /application\/json/.test(headers['content-type'])

export default class Apis {
  #baseURL = 'https://restapi.amap.com'
  #config = { key: 'your_key', sig: 'your_sig' }
  constructor(options: { key: string; sig: string }) {
    this.#config = Object.assign({}, options)
  }
  signature(params) {
    if (isEmpty(this.#config.sig)) return params
    const query = qs.stringify(params, { encode: false, skipNull: true })
    return Object.assign(params, { sig: md5(`${query}${this.#config.sig}`) })
  }
  request(url: AxiosRequestConfig['url'], options: AxiosRequestConfig) {
    const params = this.signature(Object.assign({ key: this.#config.key }, options.params))
    return axios.request({ url, baseURL: this.#baseURL, method: 'GET', ...options, params }).then(response => {
      if (response.data instanceof Buffer && isJson(response.headers)) response.data = JSON.parse(response.data.toString())
      if (response.status === 200 && !isJson(response.headers)) return response
      if (response.status === 200 && response.data.status === '1') return response.data || {}
      return Promise.reject(new Error(errcodes[response.data.infocode] || response.statusText, { cause: response.data.info }))
    })
  }
  // 地理编码
  regeo(mode: 'regeo' | 'geocode', params: any) {
    return this.request(`/v3/geocode/${mode}`, { params })
  }
  // 坐标转换
  convert(params) {
    return this.request('/v3/assistant/coordinate/convert', {
      params: Object.assign(params || {}, { coordsys: params.coordsys || 'autonavi' })
    })
  }
  // 距离测量
  distance(params) {
    return this.request('/v3/distance', {
      params: Object.assign(params || {}, { type: params.type || '0' })
    })
  }
  // 路线规划
  routes(type, params) {
    const urls = {
      transit: '/v5/direction/transit/integrated', // 公交路线规划
      driving: '/v5/direction/driving', // 驾车路线规划
      walking: '/v5/direction/walking', // 步行路线规划
      cycling: '/v5/direction/bicycling', // 骑行路线规划
      elebike: '/v5/direction/electrobike' // 电驴路线规划
    }
    const fields = {
      transit: ['origin', 'destination', 'strategy', 'city1', 'city2', 'date', 'time'],
      driving: ['origin', 'destination', 'strategy', 'plate', 'cartype', 'ferry']
    }
    return this.request(urls[type] || urls.driving, {
      params: pick(params || {}, ['origin', 'destination'].concat(fields[type] || []))
    })
  }
  // 搜索POI
  pois(mode, params) {
    const urls = { text: '/v5/place/text', around: '/v5/place/around', polygon: '/v5/place/polygon', pois: '/v5/place/detail' }
    return this.request(urls[mode] || urls.text, { params: params || {} })
  }
  // 天气查询
  weather(params) {
    return this.request('/v3/weather/weatherInfo', { params: params || {} })
  }
  // 静态地图
  staticmap(params) {
    return this.request('/v3/staticmap', { params, responseType: 'arraybuffer' }).then(response => {
      const buffer = Buffer.from(response.data)
      const data = buffer.toString('base64')
      const [type] = response.headers['content-type'].split(';')
      const prefix = `data:${type};base64`
      return { type, data, md5: md5(buffer), prefix, filename: `staticmap-${now()}.png` }
    })
  }
  // 查询行政区域
  search(params) {
    return this.request('/v3/config/district', { params: params || {} })
  }
}
