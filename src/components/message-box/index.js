import Vue from 'vue'
import component from './index.vue'

export const messageBox = component

const formatOptions = (message, options = {}, baseOptions = {}) => {
  const data = message instanceof Object ? message : { message }
  options = options instanceof Object ? Object.assign({}, data, options) : data
  return Object.assign({}, baseOptions instanceof Object ? baseOptions : {}, options)
}

const getName = (name) => {
  return name && typeof name === 'string' ? 'name:' + name : ''
}

export const msgbox = ({ vuetify, zIndex = 1 }) => {
  zIndex = isNaN(zIndex) || zIndex < 1 ? 1 : zIndex
  const instances = []
  const Ctor = Vue.extend(Object.assign({ vuetify }, messageBox))
  const open = (message, options) => {
    options = formatOptions(message, options, msgbox.configs)
    const name = getName(options.name)
    const hooks = {}
    const promise = new Promise((resolve, reject) => {
      Object.assign(hooks, {
        resolve,
        reject
      })
    })
    const currentInstance = new Ctor({
      propsData: {
        value: true,
        options: Object.assign(options),
        done (type) {
          hooks[type === 'confirm' ? 'resolve' : 'reject'](type)
          if (options.silence) {
            setTimeout(() => {
              promise.catch(() => { })
            })
          }
          instances.some((item, index) => {
            if (item === currentInstance) {
              instances.splice(index, 1)
              return true
            }
            return false
          })
          if (instances[name]) {
            delete instances[name]
          }
          return promise
        }
      }
    })
    instances.push(currentInstance)
    if (name && typeof name === 'string' && !instances[name]) {
      instances[name] = currentInstance
    }
    const container = document.querySelector('[data-app=true]') || document.body
    const vm = currentInstance.$mount()
    container.appendChild(vm.$el)
    vm.$el.style.zIndex = zIndex++
    return promise
  }
  const close = async (name) => {
    name = getName(name)
    const instance = name ? instances[name] : instances.pop()
    if (instance) {
      instance.close()
    }
  }
  const getInstance = (name) => {
    return instances[getName(name)]
  }
  const setConfigs = (configs) => {
    msgbox.configs = configs instanceof Object ? configs : {}
  }
  const msgbox = (message, options = {}) => {
    return open(message, options)
  }
  const types = ['success', 'error', 'info', 'warning']
  types.forEach(type => {
    msgbox[type] = (message, options) => {
      return open(message, Object.assign({}, formatOptions(message, options, msgbox.configs), { type }))
    }
  })
  const scenes = ['alert', 'confirm']
  scenes.forEach(type => {
    msgbox[type] = (message, options) => {
      return open(message, Object.assign({}, formatOptions(message, options, msgbox.configs), {
        type,
        showCancelButton: type === 'confirm',
        closeOnClickModal: false
      }))
    }
  })
  Object.assign(msgbox, {
    open,
    close,
    getInstance,
    setConfigs
  })
  msgbox.setConfigs({
    silence: false,
    showCancelButton: true,
    cancelButtonText: '取消'
  })
  return msgbox
}

export const MessageBox = {
  install (Vue, { vuetify }) {
    Vue.prototype.$msgbox = msgbox({
      vuetify
    })
  }
}

if (typeof window !== 'undefined' && window instanceof Object) {
  window.VuetifyMsgbox = msgbox
  window.VuetifyMessageBox = MessageBox
  window.VuetifyMessageBoxComponent = messageBox
}

export default MessageBox
