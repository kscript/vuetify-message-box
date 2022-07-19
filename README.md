# vuetify-message-box
基于 vue2 + vuetify 的消息弹框组件

## 使用方法
### 安装
``` npm
npm i vuetify-message-box
```
### 引入
``` js
import Vue from 'vue'
import Vuetify from 'vuetify'
import VuetifyMessageBox from 'vuetify-message-box'
const vuetify = new Vuetify({})
Vue.use(Vuetify)
Vue.use(VuetifyMessageBox, {
	vuetify
})
```
### 调用
``` vue
<script>
export default {
	methods: {
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
					message: 'hello world',
					center: true
				})
			} else if (mode === '使用VNode') {
				this.$msgbox({
					content: this.$createElement('div', {
						style: {
							color: 'red'
						}
					}, 'hello world')
				})
			} else if (mode === '关闭最后一个') {
				this.$msgbox('消息1', { name: 'msg1' })
				this.$msgbox('消息2', { name: 'msg2' })
				setTimeout(() => {
					this.$msgbox.close()
				}, 3e3)
			} else if (mode === '关闭指定name') {
				this.$msgbox('消息1', { name: 'msg1' })
				this.$msgbox('消息2', { name: 'msg2' })
				setTimeout(() => {
					this.$msgbox.close('msg1')
				}, 3e3)
			}
		}
	}
}

</script>
```

## 选项
| 属性 | 类型 | 默认值 | 说明 |
| -- | -- | -- | -- |
| title | string | '消息提示' | 标题 |
| width | string, number | 400 | 组件宽度 |
| center | boolean | true | 是否居中显示 |
| dark | boolean | false | 是否使用暗色主题 |
| type | string | '' | 消息类型 'success', 'error', 'warning', 'info' |
| icon | boolean, string | - | 消息图标, 默认根据type显示, false则不显示 |
| closeIcon | string | '' | 关闭按钮图标 |
| contentClass | string | '' | 消息内容class |
| showConfirmButton | boolean | true | 是否显示确认按钮 |
| confirmButtonText | string | '确定' | 确认按钮文本 |
| showCancelButton | boolean | true | 是否显示取消按钮 |
| cancelButtonText | string | '取消' | 取消按钮文本 |
| closeOnClickModal | boolean | true | 点击遮罩是否关闭 |
| silence | boolean | false | 是否关闭reject提示, 为true时, 最好在同一eventLoop周期内调用then/catch, 不然原有回调的参数会被丢弃 |

## License
[MIT](http://opensource.org/licenses/MIT)