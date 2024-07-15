export interface Tree {
	[key: string]: any;
}
export interface TreeList {
  [key: string]: any;
}

export const data3=[
  { label: "操作系统版本",},
  { label: "主机管理员",},
  { label: "应用管理员",},
  { label: "中间件管理员",},
  { label: "数据库管理员",},
  { label: "数据中心",},
  { label: "机房",},
  { label: "部署区域",},
  { label: "所属处室",},
  { label: "安全接口人",},
]
export const defaultProps = {
  children: 'children',
  label: 'label',
}
export const departmentOption=[
  {
    value: '0',
    label: '未知',
  },
  {
    value: '1',
    label: '南信息中心',
  },
  {
    value: '2',
    label: '人保财险',
  },
  {
    value: '3',
    label: '人保寿险',
  },
  {
    value: '4',
    label: '人保健康',
  },
  {
    value: '5',
    label: '人保养老',
  },
  {
    value: '6',
    label: '人保再保险',
  },
  {
    value: '7',
    label: '人保金服',
  },
  {
    value: '8',
    label: '集团信息科技部',
  },
  {
    value: '9',
    label: '人保资产',
  },
  {
    value: '10',
    label: '人保资本',
  },
  {
    value: '11',
    label: '人保投控',
  },

  {
    value: '12',
    label: '中诚信托',
  },
  {
    value: '13',
    label: '人保科技',
  },
  {
    value: '14',
    label: '人保香港',
  },
  {
    value: '15',
    label: '保互通公司',
  },

]

export const regionOption=[
  {
    value: '0',
    label: '未知',
  },
  {
    value: '1',
    label: '南信息中心',
  },
  {
    value: '2',
    label: '中金数据中心',
  },
  {
    value: '3',
    label: '美的数据中心',
  },
  {
    value: '4',
    label: '集团总部机房',
  },
  {
    value: '5',
    label: '其它',
  },
  {
    value: '6',
    label: '安贞大厦机房',
  },
  {
    value: '7',
    label: '安外数据中心',
  },
  {
    value: '8',
    label: '世纪汇机房',
  },
  {
    value: '9',
    label: '万国数据中心',
  },
  {
    value: '10',
    label: '北同城信息中心',
  },
  {
    value: '11',
    label: '联通云廊坊数据中心',
  },

  {
    value: '12',
    label: '北方信息中心',
  },
  {
    value: '13',
    label: '寿险总部机房',
  },
  {
    value: '14',
    label: '六里桥职场机房',
  },
  {
    value: '15',
    label: '丰汇职场机房',
  },
  {
    value: '16',
    label: '金服总部机房',
  },
  {
    value: '17',
    label: '财险北分职场机房',
  },
  {
    value: '18',
    label: '两江云计算数据中心',
  },
  {
    value: '19',
    label: '重庆电信机房',
  },
  {
    value: '64',
    label: '昆明联通机房',
  },



]

export const AllList=[
  {
    prop:"id",
    label:"资产ID",
    boolean:true
  },
  {
    prop:"ip",
    label:"IP地址",
    boolean:true
  },
  {
    prop:"class_name",
    label:"设备名称",
    boolean:true
  },
  {
    prop:"resource_type",
    label:"资源类型",
    boolean:true
  },
  {
    prop:"biz",
    label:"所属系统",
    boolean:true
  },
  {
    prop:"data_center_display",
    label:"所属部门",
    boolean:true
  },
  {
    prop:"os",
    label:"操作系统",
    boolean:true
  },
  {
    prop:"os_version",
    label:"操作系统版本",
    boolean:false
  },
  {
    prop:"host_manager",
    label:"主机管理员",
    boolean:false
  },
  {
    prop:"app_admin",
    label:"应用管理员",
    boolean:false
  },
  {
    prop:"middleware_admin",
    label:"中间件管理员",
    boolean:false
  },
  {
    prop:"db_admin",
    label:"数据库管理员",
    boolean:false
  },
  {
    prop:"data_center",
    label:"数据中心",
    boolean:false
  },
  {
    prop:"room",
    label:"机房",
    boolean:false
  },
  {
    prop:"network_area",
    label:"部署区域",
    boolean:false
  },

  {
    prop:"safe_person",
    label:"安全接口人",
    boolean:false
  },
  
]

// 应用系统展示
export const appList={
  'id': '系统ID',
  'name': '系统名称',
  'biz_class': '应用大类',
  'biz_type': '应用类别',
  'biz_plate': '所属业务板块',
  'biz_level': '等保级别',
  'biz_state': '系统状态',
  'company': '系统所属公司',
  'dept': '系统所属部门',
  'biz_manager': '应用管理员',
  'mail_of_main': '管理员邮箱',
  'tp_of_main': '管理员电话',
  'domain': '业务域',
  'project_desc': '项目描述',
  'network_area': '网络域',
  'external_lan_ip': '对外业务内网ip',
  'load_ip': '负载IP',
  'public_ip': '公网ip',
  'open_port': '对外开放端口',
  'supplier': '软件厂商',
  'source_id': '数据源来源id',
  'is_known': '资产状态',
  'reviewer': '审核人'
}

// 资源类型
export const resourcesClass=[
{  value: '0',
label: '未知',},
{  value: '2',
label: '待审核',}
]
// 部署区域
export const regionqy=[
  {
    value: '0',
    label: '未知',
  },
  {
    value: '1',
    label: '内网区',
  },
  {
    value: '2',
    label: '外联接入区',
  },
  {
    value: '3',
    label: '互联网接入区',
  },
  {
    value: '4',
    label: '敏态生产资源池',
  },
  {
    value: '5',
    label: '敏态测试资源池',
  },
  {
    value: '6',
    label: '稳态资源池',
  },
  {
    value: '7',
    label: '大数据资源池',
  },
]
export const treeListLeftALLNO=[
  {"id":"0", "label":"未知" },
  {"id":"1", "label":"南信息中心" },
  {"id":"2", "label":"中金数据中心" },
  {"id":"3", "label":"美的数据中心" },
  {"id":"4", "label":"集团总部机房" },
  {"id":"5", "label":"其它" },
  {"id":"6", "label":"安贞大厦机房" },
  {"id":"7", "label":"安外数据中心" },
  {"id":"8", "label":"世纪汇机房" },
  {"id":"9", "label":"万国数据中心" },
  {"id":"10", "label":"北同城信息中心" },
  {"id":"11", "label":"联通云廊坊数据中心" },
  {"id":"12", "label":"北方信息中心" },
  {"id":"13", "label":"寿险总部机房" },
  {"id":"14", "label":"六里桥职场机房" },
  {"id":"15", "label":"丰汇职场机房" },
  {"id":"16", "label":"金服总部机房" },
  {"id":"17", "label":"财险北分职场机房" },
  {"id":"18", "label":"两江云计算数据中心" },
  {"id":"19", "label":"重庆电信机房" },
  {"id":"64", "label":"昆明联通机房" },
]

export const dayNum=[
  {
    value: 1,
    label: '1号',
  },
  {
    value: 2,
    label: '2号',
  },
  {
    value: 3,
    label: '3号',
  },
  {
    value: 4,
    label: '4号',
  },
  {
    value: 5,
    label: '5号',
  },
  {
    value: 6,
    label: '6号',
  },
  {
    value: 7,
    label: '7号',
  },
  {
    value: 8,
    label: '8号',
  },
  {
    value: 9,
    label: '9号',
  },
  {
    value: 10,
    label: '10号',
  },
  {
    value: 11,
    label: '11号',
  },
  {
    value: 13,
    label: '13号',
  },
  {
    value: 14,
    label: '14号',
  },
  {
    value: 15,
    label: '15号',
  },
  {
    value: 16,
    label: '16号',
  },

  {
    value: 17,
    label: '17号',
  },
  {
    value: 18,
    label: '18号',
  },
  {
    value: 19,
    label: '19号',
  },
  {
    value: 20,
    label: '20号',
  },

  {
    value: 21,
    label: '21号',
  },
  {
    value: 22,
    label: '22号',
  },
  {
    value: 23,
    label: '23号',
  },
  {
    value: 24,
    label: '24号',
  },
  {
    value: 25,
    label: '25号',
  },
  {
    value: 26,
    label: '26号',
  },
  {
    value: 27,
    label: '27号',
  },
  {
    value: 28,
    label: '28号',
  },


]

// tree
