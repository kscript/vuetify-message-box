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
          <div :class="titleClass">{{ opts.title }}</div>
        </v-alert>
        <v-card-text :class="opts.title ? '' : 'pt-5'">
          <template v-if="message">
            {{ message }}
          </template>
          <component v-else-if="contentVM" :is="contentVM" />
        </v-card-text>
        <v-card-actions :class="opts.center ? 'justify-center' : 'justify-end'">
          <v-btn
            v-if="opts.showCancelButton"
            :class="opts.cancelButtonClass"
            :dark="opts.dark"
            @click="onCancel"
          >
            {{ opts.cancelButtonText }}
          </v-btn>
          <v-btn
            color="primary"
            v-if="opts.showConfirmButton"
            :class="opts.confirmButtonClass"
            :dark="opts.dark"
            @click="onConfirm"
            tabindex="1"
          >
            {{ opts.confirmButtonText }}
          </v-btn>
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
        return this.opts.visible
      },
      set (val) {
        if (val) {
          this.isClose = true
        } else {
          this.afterLeave()
          if (this.isClose) {
            this.done('close')
          }
        }
        this.opts.visible = val
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
      const { content } = this.opts
      if (content instanceof Object && content.tag) {
        return {
          render () {
            return content
          }
        }
      }
      return null
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
  data () {
    return {
      isClose: true
    }
  },
  methods: {
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
      setTimeout(() => {
        if (!this.visible) {
          this.$destroy(true)
          this.$el.parentNode.removeChild(this.$el)
        }
      }, this.closeDelay)
    }
  }
}
</script>