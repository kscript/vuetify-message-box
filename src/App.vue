<template>
  <v-app id="app">
    <v-main class="pa-5">
      <v-card class="mb-5" width="500">
        <v-card-title>调用示例</v-card-title>
        <v-card-text>
          <code>
            this.$msgbox('hello world', {
              center: false
            })
          </code>
        </v-card-text>
        <v-card-actions class="flex-wrap">
          <v-btn
            class="ml-0 mr-2 mb-2"
            color="primary"
            v-for="(item, index) in examples"
            :key="index"
            @click="msgbox(item)"
          >
            {{ item }}
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card class="mb-5" width="500">
        <v-card-title>类型方法调用示例</v-card-title>
        <v-card-text>
          <code>
            this.$msgbox.success('success')
          </code>
        </v-card-text>
        <v-card-actions class="flex-wrap">
          <v-btn class="ml-0 mr-2 mb-2" @click="msgType('default')">默认</v-btn>
          <v-btn class="ml-0 mr-2 mb-2" color="success" @click="msgType('success')">成功</v-btn>
          <v-btn class="ml-0 mr-2 mb-2" color="error" @click="msgType('error')">失败</v-btn>
          <v-btn class="ml-0 mr-2 mb-2" color="warning" @click="msgType('warning')">警告</v-btn>
          <v-btn class="ml-0 mr-2 mb-2" color="info" @click="msgType('info')">信息</v-btn>
          <v-btn class="ml-0 mr-2 mb-2" color="primary" @click="msgType('alert')">弹出框</v-btn>
          <v-btn class="ml-0 mr-2 mb-2" color="primary" @click="msgType('confirm')">确认框</v-btn>
        </v-card-actions>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      examples: [
        '默认',
        '带选项1',
        '带选项2',
        '按类型',
        '使用VNode',
        '关闭最后一个',
        '关闭指定name'
      ]
    }
  },
  methods: {
    msgType (type = 'default') {
      if (typeof this.$msgbox[type] === 'function') {
        this.$msgbox[type](type).catch(console.log)
      } else if (type === 'close') {
        this.$msgbox.close()
      } else {
        this.$msgbox(type).catch(console.log)
      }
    },
    msgbox (mode = '默认') {
      if (mode === '默认') {
        // 只传入消息内容
        this.$msgbox('hello world')
      } else if (mode === '带选项1') {
        // 传入消息内容, 选项
        this.$msgbox('hello world', {
          center: true
        })
      } else if (mode === '带选项2') {
        // 只传入选项, 消息内容在选项中
        this.$msgbox({
          message: 'hello world',
          center: true
        })
      } else if (mode === '按类型') {
        // success error warning info
        this.$msgbox.success({
          message: 'hello world'
        })
      } else if (mode === '使用VNode') {
        // content
        this.$msgbox({
          content: this.$createElement('div', {
            style: {
              color: 'red'
            }
          }, 'hello world')
        })
      } else if (mode === '关闭最后一个') {
        // 默认关闭最后一个
        this.$msgbox('消息1', { name: 'msg1' })
        this.$msgbox('消息2', { name: 'msg2' })
        setTimeout(() => {
          this.$msgbox.close()
        }, 2e3)
      } else if (mode === '关闭指定name') {
        // 传入name的消息弹框, 可以使用name来关闭
        this.$msgbox('消息1', { name: 'msg1' })
        this.$msgbox('消息2', { name: 'msg2' })
        setTimeout(() => {
          this.$msgbox.close('msg1')
        }, 2e3)
      }
    }
  },
  created () {
    window.app = this
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
