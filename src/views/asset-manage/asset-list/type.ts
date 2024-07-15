export interface Tree {
  [key: string]: any;
}
export interface TreeList {
  [key: string]: any;
}

export const data3 = [
  { label: "操作系统版本", },
  { label: "主机管理员", },
  { label: "应用管理员", },
  { label: "中间件管理员", },
  { label: "数据库管理员", },
  { label: "数据中心", },
  { label: "机房", },
  { label: "部署区域", },
  { label: "所属处室", },
  { label: "安全接口人", },
]

export const departmentOption = [
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

export const regionOption = [
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

export const AllList = [

  {
    dataIndex: "ip",
    title: "IP地址",
  },
  {
    dataIndex: "resource_type_display",
    title: "资产类型",
  },
  {
    dataIndex: "host_manager_name",
    title: "主机负责人",
    width: 100,
  },
  {
    dataIndex: "biz_display",
    title: "所属系统",
  },
  {
    dataIndex: "os_version",
    title: "操作系统版本",
    width: 120,
  },
  {
    dataIndex: "data_center",
    title: "数据中心",
  },
  {
    dataIndex: "network_area",
    title: "部署区域",
  },

  {
    dataIndex: "tags",
    title: "标签",
    width: 150
  },


  {
    dataIndex: "status",
    title: "运行状态",
    hidden: true
  },
  {
    dataIndex: "class_name_display",
    title: "资产大类",
    hidden: true
  },
  {
    dataIndex: "dept",
    title: "所属部门",
    hidden: true
  },

  {
    dataIndex: "os",
    title: "操作系统",
    hidden: true
  },
  {
    dataIndex: "app_admin_name",
    title: "应用管理员",
    hidden: true
  },
  {
    dataIndex: "middleware_admin",
    title: "中间件管理员",
    hidden: true
  },
  {
    dataIndex: "db_admin",
    title: "数据库管理员",
    hidden: true
  },

  {
    dataIndex: "room",
    title: "机房",
    hidden: true
  },


  {
    dataIndex: "safe_person",
    title: "安全接口人",
    hidden: true
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 150,
    fixed: 'right'
  },

]

// 应用系统展示
export const appList = [
  { dataIndex: 'name', title: '系统名称' },
  { dataIndex: 'biz_manager_name', title: '应用管理员' },
  { dataIndex: 'biz_level', title: '等保级别' },
  { dataIndex: 'dept', title: '所属部门' },
  { dataIndex: 'company', title: '所属公司' },
  { dataIndex: 'supplier', title: '软件厂商' },
  { dataIndex: 'network_area', title: '部署区域' },
  { dataIndex: 'biz_state', title: '系统状态' },
  { dataIndex: 'biz_class_display', title: '应用大类', hidden: true },
  { dataIndex: 'biz_type_display', title: '应用类别', hidden: true },
  { dataIndex: 'biz_plate', title: '所属业务板块', hidden: true },
  { dataIndex: 'mail_of_main', title: '管理员邮箱', hidden: true },
  { dataIndex: 'tp_of_main', title: '管理员电话', hidden: true },
  { dataIndex: 'domain', title: '业务域', hidden: true },
  { dataIndex: 'project_desc', title: '项目描述', hidden: true },
  { dataIndex: 'external_lan_ip', title: '对外业务内网ip', hidden: true },
  { dataIndex: 'load_ip', title: '负载IP', hidden: true },
  { dataIndex: 'public_ip', title: '公网ip', hidden: true },
  { dataIndex: 'open_port', title: '对外开放端口', hidden: true },
  { dataIndex: 'source_id', title: '数据源来源id', hidden: true },
  { dataIndex: 'reviewer', title: '审核人', hidden: true }
]
// 资产类型
export const resourcesClass = [
  {
    value: '0',
    label: '未知',
  },
  {
    value: '2',
    label: '待审核',
  }
]
// 部署区域
export const regionqy = [
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


