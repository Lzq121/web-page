import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { directive } from '@/directive/index';
import { i18n } from '@/i18n';
import other from '@/utils/other';
import '@/assets/style/tailwind.css'; // 先引入tailwind css, 以免element-plus冲突
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/theme/index.scss';
import mitt from 'mitt';
import VueGridLayout from 'vue-grid-layout';
import piniaPersist from 'pinia-plugin-persist';
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
// import FastCrud from '@fast-crud/fast-crud';
// @ts-ignore
import fastCrud from './settings.ts';
import pinia from './stores';
// import { RegisterPermission } from '@/plugin/permission/index';
// @ts-ignore
import eIconPicker, { iconList, analyzingIconForIconfont } from 'e-icon-picker';
import 'e-icon-picker/icon/default-icon/symbol.js'; //基本彩色图标库
import 'e-icon-picker/index.css'; // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css';
import elementPlus from 'e-icon-picker/icon/ele/element-plus.js'; //element-plus的图标
import fontAwesome470 from 'e-icon-picker/icon/fontawesome/font-awesome.v4.7.0.js'; //fontAwesome470的图标
import eIconList from 'e-icon-picker/icon/default-icon/eIconList.js';
import iconfont from '@/assets/iconfont/iconfont.json'; //引入json文件
import '@/assets/iconfont/iconfont.css'; //引入css
// 自动注册插件
import { scanAndInstallPlugins } from '@/views/plugins/index';
import VXETable from 'vxe-table'

import tableUnit from '@/components/table-unit/index.vue'
import importExcel from '@/components/importExcel/index.vue';
import detailsPage from '@/components/details-page/index.vue'
import 'vxe-table/lib/style.css'
import '@/assets/style/reset.scss';
import '@/assets/style/index.scss';
import 'element-tree-line/dist/style.css'

let forIconfont = analyzingIconForIconfont(iconfont); //解析class
iconList.addIcon(forIconfont.list); // 添加iconfont dvadmin3的icon
iconList.addIcon(elementPlus); // 添加element plus的图标
iconList.addIcon(fontAwesome470); // 添加fontAwesome 470版本的图标

let app = createApp(App);
app.component("table-unit",tableUnit)
app.component("importExcel",importExcel)
app.component("dp",detailsPage)
scanAndInstallPlugins(app);

app.use(eIconPicker, {
  addIconList: eIconList, //全局添加图标
  removeIconList: [], //全局删除图标
  zIndex: 3100, //选择器弹层的最低层,全局配置
});
app.use(Viewer, {
  defaultOptions: {
    zIndex: 9999, //(控制显示层级为最高)
    // "inline": true, //启用 inline 模式 默认false
    // "button": true, //显示右上角关闭按钮 默认true
    // "navbar": true, //显示缩略图导航 默认true
    // "title": true, //显示当前图片的标题 默认true
    // "toolbar": true, // 显示工具栏 默认true
    // "tooltip": true, // 显示缩放百分比 默认true
    // "movable": true, //图片是否可移动 默认true
    // "zoomable": true, //图片是否可缩放 默认true
    // "rotatable": true, //图片是否可旋转 默认true
    // "scalable": true, //图片是否可翻转 默认true
    // "transition": true, //使用css3过度 默认true
    // "fullscreen": true, //是否全屏 默认true
    // "keyboard": true, //是否支持键盘 默认true
    // "url": "data-source" //设置大图片的URL
  },
});
pinia.use(piniaPersist);
directive(app);
other.elSvg(app);


app.use(VXETable)
app.use(pinia).use(router).use(ElementPlus).use(i18n).use(VueGridLayout).use(fastCrud).mount('#app');
app.config.globalProperties.mittBus = mitt();
