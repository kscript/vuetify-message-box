<template>
  <transition name="fade">
    <v-dialog
      class="message-box"
      v-bind="opts.attrs"
      v-model="visible"
      :dark="opts.dark"
      :width="opts.width"
      :content-class="contentClass"
      :persistent="!opts.closeOnClickModal"
      @click:outside="close('outside')"
    >
      <v-card :dark="opts.dark" v-bind="opts.contentAttrs">
        <v-alert
          v-if="opts.title"
          v-model="visible"
          v-bind="opts.titleAttrs"
          :type="alertType"
          :close-icon="opts.closeIcon"
          :icon="opts.icon"
          :dark="opts.dark"
          :dismissible="dismissible"
          text
        >
          <slot name="title">
            <div :class="titleClass">{{ opts.title }}</div>
          </slot>
        </v-alert>
        <v-card-text :class="opts.title ? '' : 'pt-5'">
          <slot>
            <template v-if="message">
              {{ message }}
            </template>
            <component v-else-if="contentVM" :is="contentVM" />
          </slot>
        </v-card-text>
        <v-card-actions :class="opts.center ? 'justify-center' : 'justify-end'">
          <component v-if="prependVM" :is="prependVM" />
          <slot name="foot">
            <template v-if="opts.showCancelButton">
              <component v-if="cancelButtonVM" :is="cancelButtonVM" @click="onCancel"/>
              <v-btn
                v-else
                :class="opts.cancelButtonClass"
                :dark="opts.dark"
                @click="onCancel"
              >
                {{ opts.cancelButtonText }}
              </v-btn>
            </template>
            <template v-if="opts.showConfirmButton">
              <component v-if="confirmButtonVM" :is="confirmButtonVM" @click="onConfirm"/>
              <v-btn
                v-else
                color="primary"
                :class="opts.confirmButtonClass"
                :dark="opts.dark"
                @click="onConfirm"
                tabindex="1"
              >
                {{ opts.confirmButtonText }}
              </v-btn>
            </template>
          </slot>
          <component v-if="appendVM" :is="appendVM" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </transition>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'message-box',
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Boolean,
      default: false
    },
    done: {
      type: Function,
      default: () => { }
    }
  },
  computed: {
    opts: {
      get () {
        return Vue.observable(Object.assign({
          width: 400,
          dark: false,
          title: '消息提示',
          closeIcon: 'mdi-close-circle',
          contentClass: '',
          center: true,
          attrs: {},
          contentAttrs: {},
          titleAttrs: {},
          closeOnClickModal: true,
          showConfirmButton: true,
          confirmButtonText: '确定'
        }, this.options))
      },
      set (value) {
        this.$emit('update:options', value)
      }
    },
    visible: {
      get () {
        return !!(this.propVisible || this.opts.visible)
      },
      set (visible) {
        if (visible) {
          this.isClose = true
        } else {
          this.afterLeave()
          if (this.isClose) {
            this.done('close')
          }
        }
        this.propVisible = this.opts.visible = visible
        this.$emit('input', visible)
      }
    },
    message () {
      const { message, content } = this.opts
      if (message && typeof message === 'string') {
        return message
      } else if (content && typeof content === 'string') {
        return content
      }
      return ''
    },
    contentVM () {
      return this.getVNode('content')
    },
    prependVM () {
      return this.getVNode('prepend')
    },
    appendVM () {
      return this.getVNode('append')
    },
    confirmButtonVM () {
      return this.getVNode('confirmButton')
    },
    cancelButtonVM () {
      return this.getVNode('cancelButton')
    },
    titleClass () {
      return !['success', 'error', 'wraning', 'info'].includes(this.opts.type) && this.opts.center ? 'pl-9' : ''
    },
    contentClass () {
      const { contentClass, center } = this.opts
      const centerClass = center ? ' text-center' : ''
      if (typeof contentClass === 'string' && contentClass) {
        return contentClass + centerClass
      }
      return centerClass
    },
    dismissible () {
      return !['alert', 'confirm'].includes(this.opts.type)
    },
    alertType () {
      return ['success', 'error', 'warning', 'info'].includes(this.opts.type) ? this.opts.type : undefined
    },
    closeDelay () {
      const closeDelay = +(this.opts.closeDelay || this.opts['close-delay'])
      return closeDelay >= 0 ? closeDelay : 5e3
    }
  },
  watch: {
    value: {
      handler (newValue) {
        this.propVisible = newValue
      },
      immediate: true
    }
  },
  data () {
    return {
      isClose: true,
      propVisible: false
    }
  },
  methods: {
    getVNode (key) {
      const node = this.opts[key]
      if (node instanceof Object && node.tag) {
        return {
          render () {
            return node
          }
        }
      }
      return null
    },
    onCancel () {
      this.isClose = false
      this.visible = false
      this.done('cancel')
    },
    onConfirm () {
      this.isClose = false
      this.visible = false
      this.done('confirm')
    },
    close (type) {
      if (type === 'outside' && !this.opts.closeOnClickModal) return
      this.visible = false
      this.done('close')
    },
    afterLeave () {
      if (this.$parent) return
      setTimeout(() => {
        if (!this.visible) {
          this.$el.parentNode.removeChild(this.$el)
          this.$destroy(true)
        }
      }, this.closeDelay)
    }
  }
}
</script>
