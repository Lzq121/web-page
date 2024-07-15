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

// tree
export const treeListLeftALL=[{'id': 0, 'label': '未知', 'children': [{'id': '0-0', 'label': '未知', 'children': [{'id': '0-0-1', 'label': 'ip资产视 角'}, {'id': '0-0-2', 'label': '应用系统视角'}]}, {'id': '0-1', 'label': '内网区', 'children': [{'id': '0-1-1', 'label': 'ip资产视角'}, {'id': '0-1-2', 'label': '应用系统视角'}]}, {'id': '0-2', 'label': '外联接入区', 'children': [{'id': '0-2-1', 'label': 'ip资产视角'}, {'id': '0-2-2', 'label': '应用系统视角'}]}, {'id': '0-3', 'label': '互联网接入区', 'children': [{'id': '0-3-1', 'label': 'ip资产视角'}, {'id': '0-3-2', 'label': '应用系统视角'}]}, {'id': '0-4', 'label': '敏态生产资源池', 'children': [{'id': '0-4-1', 'label': 'ip资产视角'}, {'id': '0-4-2', 'label': '应用系统视角'}]}, {'id': '0-5', 'label': '敏态测试资源池', 'children': [{'id': '0-5-1', 'label': 'ip资产视角'}, {'id': '0-5-2', 'label': '应用系统视角'}]}, {'id': '0-6', 'label': '稳态资源池', 'children': [{'id': '0-6-1', 'label': 'ip资产视角'}, {'id': '0-6-2', 'label': '应用系统视角'}]}, {'id': '0-7', 'label': '大数据资源池', 'children': [{'id': '0-7-1', 'label': 'ip资产视角'}, {'id': '0-7-2', 'label': '应用系统视角'}]}]}, {'id': 1, 'label': '南信息中心', 'children': [{'id': '1-0', 'label': '未知', 'children': [{'id': '1-0-1', 'label': 'ip资产视角'}, {'id': '1-0-2', 'label': '应用系统视角'}]}, {'id': '1-1', 'label': '内网区', 'children': [{'id': '1-1-1', 'label': 'ip资产视角'}, {'id': '1-1-2', 'label': '应用系统视角'}]}, {'id': '1-2', 'label': '外联接入区', 'children': [{'id': '1-2-1', 'label': 'ip资产视角'}, {'id': '1-2-2', 'label': '应用系统视角'}]}, {'id': '1-3', 'label': '互联网接入区', 'children': [{'id': '1-3-1', 'label': 'ip资产视角'}, {'id': '1-3-2', 'label': '应用系统视角'}]}, {'id': '1-4', 'label': '敏态生产资源池', 'children': [{'id': '1-4-1', 'label': 'ip资产视角'}, {'id': '1-4-2', 'label': '应用系统视角'}]}, {'id': '1-5', 'label': '敏态测试资源池', 'children': [{'id': '1-5-1', 'label': 'ip资产视角'}, {'id': '1-5-2', 'label': '应用系统视角'}]}, {'id': '1-6', 'label': '稳态资源池', 'children': [{'id': '1-6-1', 'label': 'ip资产视角'}, {'id': '1-6-2', 'label': '应用系统视角'}]}, {'id': '1-7', 'label': '大数据资源池', 'children': [{'id': '1-7-1', 'label': 'ip资产视角'}, {'id': '1-7-2', 'label': '应用系统视角'}]}]}, {'id': 2, 'label': '中金数据中心', 'children': [{'id': '2-0', 'label': '未知', 'children': [{'id': '2-0-1', 'label': 'ip资产视角'}, {'id': '2-0-2', 'label': '应用系统视角'}]}, {'id': '2-1', 'label': '内网区', 'children': [{'id': '2-1-1', 'label': 'ip资产视角'}, {'id': '2-1-2', 'label': '应用系统视角'}]}, {'id': '2-2', 'label': '外联接入区', 'children': [{'id': '2-2-1', 'label': 'ip资产视角'}, {'id': '2-2-2', 'label': '应用系统视角'}]}, {'id': '2-3', 'label': '互联网接入区', 'children': [{'id': '2-3-1', 'label': 'ip资产视角'}, {'id': '2-3-2', 'label': '应用系统视角'}]}, {'id': '2-4', 'label': '敏态生产资源池', 'children': [{'id': '2-4-1', 'label': 'ip资产视角'}, {'id': '2-4-2', 'label': '应用系统视角'}]}, {'id': '2-5', 'label': '敏态测试资源池', 'children': [{'id': '2-5-1', 'label': 'ip资产视角'}, {'id': '2-5-2', 'label': '应用系统视角'}]}, {'id': '2-6', 'label': '稳态资源池', 'children': [{'id': '2-6-1', 'label': 'ip资产视角'}, {'id': '2-6-2', 'label': '应用系统视角'}]}, {'id': '2-7', 'label': '大数据资源池', 'children': [{'id': '2-7-1', 'label': 'ip资产视角'}, {'id': '2-7-2', 'label': '应用系统视角'}]}]}, {'id': 3, 'label': '美的数据中心', 'children': [{'id': '3-0', 'label': '未知', 'children': [{'id': '3-0-1', 'label': 'ip资产视角'}, {'id': '3-0-2', 'label': '应用系统视角'}]}, {'id': '3-1', 'label': '内网区', 'children': [{'id': '3-1-1', 'label': 'ip资产视角'}, {'id': '3-1-2', 'label': '应用系统视角'}]}, {'id': '3-2', 'label': '外联接入区', 'children': [{'id': '3-2-1', 'label': 'ip资产视角'}, {'id': '3-2-2', 'label': '应用系统视角'}]}, {'id': '3-3', 'label': '互联网接入区', 'children': [{'id': '3-3-1', 'label': 'ip资产视角'}, {'id': '3-3-2', 'label': '应用系统视角'}]}, {'id': '3-4', 'label': '敏态生产资源池', 'children': [{'id': '3-4-1', 'label': 'ip资产视角'}, {'id': '3-4-2', 'label': '应用系统视角'}]}, {'id': '3-5', 'label': '敏态测试资源池', 'children': [{'id': '3-5-1', 'label': 'ip资产视角'}, {'id': '3-5-2', 'label': '应用系统视角'}]}, {'id': '3-6', 'label': '稳态资源池', 'children': [{'id': '3-6-1', 'label': 'ip资产视角'}, {'id': '3-6-2', 'label': '应用系统视角'}]}, {'id': '3-7', 'label': '大数据资源池', 'children': [{'id': '3-7-1', 'label': 'ip资产视角'}, {'id': '3-7-2', 'label': '应用系统视角'}]}]}, {'id': 4, 'label': '集团总部机房', 'children': [{'id': '4-0', 'label': '未知', 'children': [{'id': '4-0-1', 'label': 'ip资产视角'}, {'id': '4-0-2', 'label': '应用系统视角'}]}, {'id': '4-1', 'label': '内网区', 'children': [{'id': '4-1-1', 'label': 'ip资产视角'}, {'id': '4-1-2', 'label': '应用系统视角'}]}, {'id': '4-2', 'label': '外联接入区', 'children': [{'id': '4-2-1', 'label': 'ip资产视角'}, {'id': '4-2-2', 'label': '应用系统视角'}]}, {'id': '4-3', 'label': '互联网接入区', 'children': [{'id': '4-3-1', 'label': 'ip资产视角'}, {'id': '4-3-2', 'label': '应用系统视角'}]}, {'id': '4-4', 'label': '敏态生产资源池', 'children': [{'id': '4-4-1', 'label': 'ip资产视角'}, {'id': '4-4-2', 'label': '应用系统视角'}]}, {'id': '4-5', 'label': '敏态测试资源池', 'children': [{'id': '4-5-1', 'label': 'ip资产视角'}, {'id': '4-5-2', 'label': '应用系统视角'}]}, {'id': '4-6', 'label': '稳态资源池', 'children': [{'id': '4-6-1', 'label': 'ip资产视角'}, {'id': '4-6-2', 'label': '应用系统视角'}]}, {'id': '4-7', 'label': '大数据资源池', 'children': [{'id': '4-7-1', 'label': 'ip资产视角'}, {'id': '4-7-2', 'label': '应用系统视角'}]}]}, {'id': 5, 'label': '其它', 'children': [{'id': '5-0', 'label': '未知', 'children': [{'id': '5-0-1', 'label': 'ip资产视角'}, {'id': '5-0-2', 'label': '应用系统视角'}]}, {'id': '5-1', 'label': '内网区', 'children': [{'id': '5-1-1', 'label': 'ip资产视角'}, {'id': '5-1-2', 'label': '应用系统视角'}]}, {'id': '5-2', 'label': '外联接入区', 'children': [{'id': '5-2-1', 'label': 'ip资产视角'}, {'id': '5-2-2', 'label': '应用系统视角'}]}, {'id': '5-3', 'label': '互联网接入区', 'children': [{'id': '5-3-1', 'label': 'ip资产视角'}, {'id': '5-3-2', 'label': '应用系统视角'}]}, {'id': '5-4', 'label': '敏态生产资源池', 'children': [{'id': '5-4-1', 'label': 'ip资产视角'}, {'id': '5-4-2', 'label': '应用系统视角'}]}, {'id': '5-5', 'label': '敏态测试资源池', 'children': [{'id': '5-5-1', 'label': 'ip资产视角'}, {'id': '5-5-2', 'label': '应用系统视角'}]}, {'id': '5-6', 'label': '稳态资源池', 'children': [{'id': '5-6-1', 'label': 'ip资产视角'}, {'id': '5-6-2', 'label': '应用系统视角'}]}, {'id': '5-7', 'label': '大数据资源池', 'children': [{'id': '5-7-1', 'label': 'ip资产视角'}, {'id': '5-7-2', 'label': '应用系统视角'}]}]}, {'id': 6, 'label': '安贞大厦机房', 'children': [{'id': '6-0', 'label': '未知', 'children': [{'id': '6-0-1', 'label': 'ip资产视角'}, {'id': '6-0-2', 'label': '应用系统视角'}]}, {'id': '6-1', 'label': '内网区', 'children': [{'id': '6-1-1', 'label': 'ip资产视角'}, {'id': '6-1-2', 'label': '应用系统视角'}]}, {'id': '6-2', 'label': '外联接入区', 'children': [{'id': '6-2-1', 'label': 'ip资产视角'}, {'id': '6-2-2', 'label': '应用系统视角'}]}, {'id': '6-3', 'label': '互联网接入区', 'children': [{'id': '6-3-1', 'label': 'ip资产视角'}, {'id': '6-3-2', 'label': '应用系统视角'}]}, {'id': '6-4', 'label': '敏态生产资源池', 'children': [{'id': '6-4-1', 'label': 'ip资产视角'}, {'id': '6-4-2', 'label': '应用系统视角'}]}, {'id': '6-5', 'label': '敏态测试资源池', 'children': [{'id': '6-5-1', 'label': 'ip资产视角'}, {'id': '6-5-2', 'label': '应用系统视角'}]}, {'id': '6-6', 'label': '稳态资源池', 'children': [{'id': '6-6-1', 'label': 'ip资产视角'}, {'id': '6-6-2', 'label': '应用系统视角'}]}, {'id': '6-7', 'label': '大数据资源池', 'children': [{'id': '6-7-1', 'label': 'ip资产视角'}, {'id': '6-7-2', 'label': '应用系统视角'}]}]}, {'id': 7, 'label': '安外数据中心', 'children': [{'id': '7-0', 'label': '未知', 'children': [{'id': '7-0-1', 'label': 'ip资产视角'}, {'id': '7-0-2', 'label': '应用系统视角'}]}, {'id': '7-1', 'label': '内网区', 'children': [{'id': '7-1-1', 'label': 'ip资产视角'}, {'id': '7-1-2', 'label': '应用系统视角'}]}, {'id': '7-2', 'label': '外联接入区', 'children': [{'id': '7-2-1', 'label': 'ip资产视角'}, {'id': '7-2-2', 'label': '应用系统视角'}]}, {'id': '7-3', 'label': '互联网接入区', 'children': [{'id': '7-3-1', 'label': 'ip资产视角'}, {'id': '7-3-2', 'label': '应用系统视角'}]}, {'id': '7-4', 'label': '敏态生产资源池', 'children': [{'id': '7-4-1', 'label': 'ip资产视角'}, {'id': '7-4-2', 'label': '应用系统视角'}]}, {'id': '7-5', 'label': '敏态测试资源池', 'children': [{'id': '7-5-1', 'label': 'ip资产视角'}, {'id': '7-5-2', 'label': '应用系统视角'}]}, {'id': '7-6', 'label': '稳态资源池', 'children': [{'id': '7-6-1', 'label': 'ip资产视角'}, {'id': '7-6-2', 'label': '应用系统视角'}]}, {'id': '7-7', 'label': '大数据资源池', 'children': [{'id': '7-7-1', 'label': 'ip资产视角'}, {'id': '7-7-2', 'label': '应用系统视角'}]}]}, {'id': 8, 'label': '世纪汇机房', 'children': [{'id': '8-0', 'label': '未知', 'children': [{'id': '8-0-1', 'label': 'ip资产视角'}, {'id': '8-0-2', 'label': '应用系统视角'}]}, {'id': '8-1', 'label': '内网区', 'children': [{'id': '8-1-1', 'label': 'ip资产视角'}, {'id': '8-1-2', 'label': '应用系统视角'}]}, {'id': '8-2', 'label': '外联接入区', 'children': [{'id': '8-2-1', 'label': 'ip资产视角'}, {'id': '8-2-2', 'label': '应用系统视角'}]}, {'id': '8-3', 'label': '互联网接入区', 'children': [{'id': '8-3-1', 'label': 'ip资产视角'}, {'id': '8-3-2', 'label': '应用系统视角'}]}, {'id': '8-4', 'label': '敏态生产资源池', 'children': [{'id': '8-4-1', 'label': 'ip资产视角'}, {'id': '8-4-2', 'label': '应用系统视角'}]}, {'id': '8-5', 'label': '敏态测试资源池', 'children': [{'id': '8-5-1', 'label': 'ip资产视角'}, {'id': '8-5-2', 'label': '应用系统视角'}]}, {'id': '8-6', 'label': '稳态资源池', 'children': [{'id': '8-6-1', 'label': 'ip资产视角'}, {'id': '8-6-2', 'label': '应用系统视角'}]}, {'id': '8-7', 'label': '大数据资源池', 'children': [{'id': '8-7-1', 'label': 'ip资产视角'}, {'id': '8-7-2', 'label': '应用系统视角'}]}]}, {'id': 9, 'label': '万国数据中心', 'children': [{'id': '9-0', 'label': '未知', 'children': [{'id': '9-0-1', 'label': 'ip资产视角'}, {'id': '9-0-2', 'label': '应用系统视角'}]}, {'id': '9-1', 'label': '内网区', 'children': [{'id': '9-1-1', 'label': 'ip资产视角'}, {'id': '9-1-2', 'label': '应用系统视角'}]}, {'id': '9-2', 'label': '外联接入区', 'children': [{'id': '9-2-1', 'label': 'ip资产视角'}, {'id': '9-2-2', 'label': '应用系统视角'}]}, {'id': '9-3', 'label': '互联网接入区', 'children': [{'id': '9-3-1', 'label': 'ip资产视角'}, {'id': '9-3-2', 'label': '应用系统视角'}]}, {'id': '9-4', 'label': '敏态生产资源池', 'children': [{'id': '9-4-1', 'label': 'ip资产视角'}, {'id': '9-4-2', 'label': '应用系统视角'}]}, {'id': '9-5', 'label': '敏态测试资源池', 'children': [{'id': '9-5-1', 'label': 'ip资产视角'}, {'id': '9-5-2', 'label': '应用系统视角'}]}, {'id': '9-6', 'label': '稳态资源池', 'children': [{'id': '9-6-1', 'label': 'ip资产视角'}, {'id': '9-6-2', 'label': '应用系统视角'}]}, {'id': '9-7', 'label': '大数据资源池', 'children': [{'id': '9-7-1', 'label': 'ip资产视角'}, {'id': '9-7-2', 'label': '应用系统视角'}]}]}, {'id': 10, 'label': '北同城信息中心', 'children': [{'id': '10-0', 'label': '未知', 'children': [{'id': '10-0-1', 'label': 'ip资产视角'}, {'id': '10-0-2', 'label': '应用系统视角'}]}, {'id': '10-1', 'label': '内网区', 'children': [{'id': '10-1-1', 'label': 'ip资产视角'}, {'id': '10-1-2', 'label': ' 应用系统视角'}]}, {'id': '10-2', 'label': '外联接入区', 'children': [{'id': '10-2-1', 'label': 'ip资产视角'}, {'id': '10-2-2', 'label': '应用系统视角'}]}, {'id': '10-3', 'label': '互联网接入区', 'children': [{'id': '10-3-1', 'label': 'ip资 产视角'}, {'id': '10-3-2', 'label': '应用系统视角'}]}, {'id': '10-4', 'label': '敏态生产资源池', 'children': [{'id': '10-4-1', 'label': 'ip资产视角'}, {'id': '10-4-2', 'label': '应用系统视角'}]}, {'id': '10-5', 'label': '敏态测试资源池', 'children': [{'id': '10-5-1', 'label': 'ip资产视角'}, {'id': '10-5-2', 'label': '应用系统视角'}]}, {'id': '10-6', 'label': '稳态资源池', 'children': [{'id': '10-6-1', 'label': 'ip资产视角'}, {'id': '10-6-2', 'label': '应用系统视角'}]}, {'id': '10-7', 'label': '大数据资源池', 'children': [{'id': '10-7-1', 'label': 'ip资产视角'}, {'id': '10-7-2', 'label': '应用 系统视角'}]}]}, {'id': 11, 'label': '联通云廊坊数据中心', 'children': [{'id': '11-0', 'label': '未知', 'children': [{'id': '11-0-1', 'label': 'ip资产视角'}, {'id': '11-0-2', 'label': '应用系统视角'}]}, {'id': '11-1', 'label': '内网区', 'children': [{'id': '11-1-1', 'label': 'ip资产视角'}, {'id': '11-1-2', 'label': '应用系统视角'}]}, {'id': '11-2', 'label': '外联接入区', 'children': [{'id': '11-2-1', 'label': 'ip资产视角'}, {'id': '11-2-2', 'label': '应用系统视角'}]}, {'id': '11-3', 'label': '互联网接入区', 'children': [{'id': '11-3-1', 'label': 'ip资产视角'}, {'id': '11-3-2', 'label': '应用系 统视角'}]}, {'id': '11-4', 'label': '敏态生产资源池', 'children': [{'id': '11-4-1', 'label': 'ip资产视角'}, {'id': '11-4-2', 'label': '应用系统视角'}]}, {'id': '11-5', 'label': '敏态测试资源池', 'children': [{'id': '11-5-1', 'label': 'ip资 产视角'}, {'id': '11-5-2', 'label': '应用系统视角'}]}, {'id': '11-6', 'label': '稳态资源池', 'children': [{'id': '11-6-1', 'label': 'ip资产视角'}, {'id': '11-6-2', 'label': '应用系统视角'}]}, {'id': '11-7', 'label': '大数据资源池', 'children': [{'id': '11-7-1', 'label': 'ip资产视角'}, {'id': '11-7-2', 'label': '应用系统视角'}]}]}, {'id': 12, 'label': '北方信息中心', 'children': [{'id': '12-0', 'label': '未知', 'children': [{'id': '12-0-1', 'label': 'ip资产视角'}, {'id': '12-0-2', 'label': '应用系统视角'}]}, {'id': '12-1', 'label': '内网区', 'children': [{'id': '12-1-1', 'label': 'ip资产视角'}, {'id': '12-1-2', 'label': '应用系统视角'}]}, {'id': '12-2', 'label': '外联接入区', 'children': [{'id': '12-2-1', 'label': 'ip资产视角'}, {'id': '12-2-2', 'label': '应用系统视角'}]}, {'id': '12-3', 'label': '互联网接入区', 'children': [{'id': '12-3-1', 'label': 'ip资产视角'}, {'id': '12-3-2', 'label': '应用系统视角'}]}, {'id': '12-4', 'label': '敏态生产资源 池', 'children': [{'id': '12-4-1', 'label': 'ip资产视角'}, {'id': '12-4-2', 'label': '应用系统视角'}]}, {'id': '12-5', 'label': '敏态测试资源池', 'children': [{'id': '12-5-1', 'label': 'ip资产视角'}, {'id': '12-5-2', 'label': '应用系统视角'}]}, {'id': '12-6', 'label': '稳态资源池', 'children': [{'id': '12-6-1', 'label': 'ip资产视角'}, {'id': '12-6-2', 'label': '应用系统视角'}]}, {'id': '12-7', 'label': '大数据资源池', 'children': [{'id': '12-7-1', 'label': 'ip资产视角'}, {'id': '12-7-2', 'label': '应用系统视角'}]}]}, {'id': 13, 'label': '寿险总部机房', 'children': [{'id': '13-0', 'label': '未 知', 'children': [{'id': '13-0-1', 'label': 'ip资产视角'}, {'id': '13-0-2', 'label': '应用系统视角'}]}, {'id': '13-1', 'label': '内网区', 'children': [{'id': '13-1-1', 'label': 'ip资产视角'}, {'id': '13-1-2', 'label': '应用系统视角'}]}, {'id': '13-2', 'label': '外联接入区', 'children': [{'id': '13-2-1', 'label': 'ip资产视角'}, {'id': '13-2-2', 'label': '应用系统视角'}]}, {'id': '13-3', 'label': '互联网接入区', 'children': [{'id': '13-3-1', 'label': 'ip资产视角'}, {'id': '13-3-2', 'label': '应用系统视角'}]}, {'id': '13-4', 'label': '敏态生产资源池', 'children': [{'id': '13-4-1', 'label': 'ip资 产视角'}, {'id': '13-4-2', 'label': '应用系统视角'}]}, {'id': '13-5', 'label': '敏态测试资源池', 'children': [{'id': '13-5-1', 'label': 'ip资产视角'}, {'id': '13-5-2', 'label': '应用系统视角'}]}, {'id': '13-6', 'label': '稳态资源池', 'children': [{'id': '13-6-1', 'label': 'ip资产视角'}, {'id': '13-6-2', 'label': '应用系统视角'}]}, {'id': '13-7', 'label': '大数据资源池', 'children': [{'id': '13-7-1', 'label': 'ip资产视角'}, {'id': '13-7-2', 'label': '应用系统视角'}]}]}, {'id': 14, 'label': '六里桥职场机房', 'children': [{'id': '14-0', 'label': '未知', 'children': [{'id': '14-0-1', 'label': 'ip 资产视角'}, {'id': '14-0-2', 'label': '应用系统视角'}]}, {'id': '14-1', 'label': '内网区', 'children': [{'id': '14-1-1', 'label': 'ip资产视角'}, {'id': '14-1-2', 'label': '应用系统视角'}]}, {'id': '14-2', 'label': '外联接入区', 'children': [{'id': '14-2-1', 'label': 'ip资产视角'}, {'id': '14-2-2', 'label': '应用系统视角'}]}, {'id': '14-3', 'label': '互联网接入区', 'children': [{'id': '14-3-1', 'label': 'ip资产视角'}, {'id': '14-3-2', 'label': '应用系统视角'}]}, {'id': '14-4', 'label': '敏态生产资源池', 'children': [{'id': '14-4-1', 'label': 'ip资产视角'}, {'id': '14-4-2', 'label': '应用系统视 角'}]}, {'id': '14-5', 'label': '敏态测试资源池', 'children': [{'id': '14-5-1', 'label': 'ip资产视角'}, {'id': '14-5-2', 'label': '应用系统视角'}]}, {'id': '14-6', 'label': '稳态资源池', 'children': [{'id': '14-6-1', 'label': 'ip资产视角'}, {'id': '14-6-2', 'label': '应用系统视角'}]}, {'id': '14-7', 'label': '大数据资源池', 'children': [{'id': '14-7-1', 'label': 'ip资产视角'}, {'id': '14-7-2', 'label': '应用系统视角'}]}]}, {'id': 15, 'label': '丰汇职场机房', 'children': [{'id': '15-0', 'label': '未知', 'children': [{'id': '15-0-1', 'label': 'ip资产视角'}, {'id': '15-0-2', 'label': '应用系统视 角'}]}, {'id': '15-1', 'label': '内网区', 'children': [{'id': '15-1-1', 'label': 'ip资产视角'}, {'id': '15-1-2', 'label': '应用系统视角'}]}, {'id': '15-2', 'label': '外联接入区', 'children': [{'id': '15-2-1', 'label': 'ip资产视角'}, {'id': '15-2-2', 'label': '应用系统视角'}]}, {'id': '15-3', 'label': '互联网接入区', 'children': [{'id': '15-3-1', 'label': 'ip资产视角'}, {'id': '15-3-2', 'label': '应用系统视角'}]}, {'id': '15-4', 'label': '敏态生产资源池', 'children': [{'id': '15-4-1', 'label': 'ip资产视角'}, {'id': '15-4-2', 'label': '应用系统视角'}]}, {'id': '15-5', 'label': '敏态测试资源池', 'children': [{'id': '15-5-1', 'label': 'ip资产视角'}, {'id': '15-5-2', 'label': '应用系统视角'}]}, {'id': '15-6', 'label': '稳态资源池', 'children': [{'id': '15-6-1', 'label': 'ip资产视角'}, {'id': '15-6-2', 'label': '应用系统视角'}]}, {'id': '15-7', 'label': '大数据资源池', 'children': [{'id': '15-7-1', 'label': 'ip资产视角'}, {'id': '15-7-2', 'label': '应 用系统视角'}]}]}, {'id': 16, 'label': '金服总部机房', 'children': [{'id': '16-0', 'label': '未知', 'children': [{'id': '16-0-1', 'label': 'ip资产视角'}, {'id': '16-0-2', 'label': '应用系统视角'}]}, {'id': '16-1', 'label': '内网区', 'children': [{'id': '16-1-1', 'label': 'ip资产视角'}, {'id': '16-1-2', 'label': '应用系统视角'}]}, {'id': '16-2', 'label': '外联接入区', 'children': [{'id': '16-2-1', 'label': 'ip资产视角'}, {'id': '16-2-2', 'label': '应用系统视角'}]}, {'id': '16-3', 'label': '互联网接入区', 'children': [{'id': '16-3-1', 'label': 'ip资产视角'}, {'id': '16-3-2', 'label': '应用系统视 角'}]}, {'id': '16-4', 'label': '敏态生产资源池', 'children': [{'id': '16-4-1', 'label': 'ip资产视角'}, {'id': '16-4-2', 'label': '应用系统视角'}]}, {'id': '16-5', 'label': '敏态测试资源池', 'children': [{'id': '16-5-1', 'label': 'ip资产视 角'}, {'id': '16-5-2', 'label': '应用系统视角'}]}, {'id': '16-6', 'label': '稳态资源池', 'children': [{'id': '16-6-1', 'label': 'ip资产视角'}, {'id': '16-6-2', 'label': '应用系统视角'}]}, {'id': '16-7', 'label': '大数据资源池', 'children': [{'id': '16-7-1', 'label': 'ip资产视角'}, {'id': '16-7-2', 'label': '应用系统视角'}]}]}, {'id': 17, 'label': '财险北分职场机房', 'children': [{'id': '17-0', 'label': '未知', 'children': [{'id': '17-0-1', 'label': 'ip资产视角'}, {'id': '17-0-2', 'label': '应用系统视角'}]}, {'id': '17-1', 'label': '内网区', 'children': [{'id': '17-1-1', 'label': 'ip资产视角'}, {'id': '17-1-2', 'label': '应用系统视角'}]}, {'id': '17-2', 'label': '外联接入区', 'children': [{'id': '17-2-1', 'label': 'ip资产视角'}, {'id': '17-2-2', 'label': '应用系统视角'}]}, {'id': '17-3', 'label': '互联网接入区', 'children': [{'id': '17-3-1', 'label': 'ip资产视角'}, {'id': '17-3-2', 'label': '应用系统视角'}]}, {'id': '17-4', 'label': '敏态生产资源 池', 'children': [{'id': '17-4-1', 'label': 'ip资产视角'}, {'id': '17-4-2', 'label': '应用系统视角'}]}, {'id': '17-5', 'label': '敏态测试资源池', 'children': [{'id': '17-5-1', 'label': 'ip资产视角'}, {'id': '17-5-2', 'label': '应用系统视角'}]}, {'id': '17-6', 'label': '稳态资源池', 'children': [{'id': '17-6-1', 'label': 'ip资产视角'}, {'id': '17-6-2', 'label': '应用系统视角'}]}, {'id': '17-7', 'label': '大数据资源池', 'children': [{'id': '17-7-1', 'label': 'ip资产视角'}, {'id': '17-7-2', 'label': '应用系统视角'}]}]}, {'id': 18, 'label': '两江云计算数据中心', 'children': [{'id': '18-0', 'label': '未知', 'children': [{'id': '18-0-1', 'label': 'ip资产视角'}, {'id': '18-0-2', 'label': '应用系统视角'}]}, {'id': '18-1', 'label': '内网区', 'children': [{'id': '18-1-1', 'label': 'ip资产视角'}, {'id': '18-1-2', 'label': '应用系统视角'}]}, {'id': '18-2', 'label': '外联接入区', 'children': [{'id': '18-2-1', 'label': 'ip资产视角'}, {'id': '18-2-2', 'label': '应用系统视角'}]}, {'id': '18-3', 'label': '互联网接入区', 'children': [{'id': '18-3-1', 'label': 'ip资产视角'}, {'id': '18-3-2', 'label': '应用系统视角'}]}, {'id': '18-4', 'label': '敏态生产资源池', 'children': [{'id': '18-4-1', 'label': 'ip资产视角'}, {'id': '18-4-2', 'label': '应用系统视角'}]}, {'id': '18-5', 'label': '敏态测试资源池', 'children': [{'id': '18-5-1', 'label': 'ip资产视角'}, {'id': '18-5-2', 'label': '应用系统视角'}]}, {'id': '18-6', 'label': '稳态资源池', 'children': [{'id': '18-6-1', 'label': 'ip资产视角'}, {'id': '18-6-2', 'label': '应用系统视角'}]}, {'id': '18-7', 'label': '大数据资源池', 'children': [{'id': '18-7-1', 'label': 'ip资产视角'}, {'id': '18-7-2', 'label': '应用系统视角'}]}]}, {'id': 19, 'label': '重庆电信机房', 'children': [{'id': '19-0', 'label': '未知', 'children': [{'id': '19-0-1', 'label': 'ip资产视角'}, {'id': '19-0-2', 'label': '应用系统视角'}]}, {'id': '19-1', 'label': '内网区', 'children': [{'id': '19-1-1', 'label': 'ip资产视角'}, {'id': '19-1-2', 'label': '应用系统视角'}]}, {'id': '19-2', 'label': '外联接入区', 'children': [{'id': '19-2-1', 'label': 'ip资产视角'}, {'id': '19-2-2', 'label': '应用系统视角'}]}, {'id': '19-3', 'label': '互联网 接入区', 'children': [{'id': '19-3-1', 'label': 'ip资产视角'}, {'id': '19-3-2', 'label': '应用系统视角'}]}, {'id': '19-4', 'label': '敏态生产资源池', 'children': [{'id': '19-4-1', 'label': 'ip资产视角'}, {'id': '19-4-2', 'label': '应用系统 视角'}]}, {'id': '19-5', 'label': '敏态测试资源池', 'children': [{'id': '19-5-1', 'label': 'ip资产视角'}, {'id': '19-5-2', 'label': '应用系统视角'}]}, {'id': '19-6', 'label': '稳态资源池', 'children': [{'id': '19-6-1', 'label': 'ip资产视角'}, {'id': '19-6-2', 'label': '应用系统视角'}]}, {'id': '19-7', 'label': '大数据资源池', 'children': [{'id': '19-7-1', 'label': 'ip资产视角'}, {'id': '19-7-2', 'label': '应用系统视角'}]}]}, {'id': 64, 'label': '昆明联通机房', 'children': [{'id': '64-0', 'label': '未知', 'children': [{'id': '64-0-1', 'label': 'ip资产视角'}, {'id': '64-0-2', 'label': '应用系统 视角'}]}, {'id': '64-1', 'label': '内网区', 'children': [{'id': '64-1-1', 'label': 'ip资产视角'}, {'id': '64-1-2', 'label': '应用系统视角'}]}, {'id': '64-2', 'label': '外联接入区', 'children': [{'id': '64-2-1', 'label': 'ip资产视角'}, {'id': '64-2-2', 'label': '应用系统视角'}]}, {'id': '64-3', 'label': '互联网接入区', 'children': [{'id': '64-3-1', 'label': 'ip资产视角'}, {'id': '64-3-2', 'label': '应用系统视角'}]}, {'id': '64-4', 'label': '敏态生产资源池', 'children': [{'id': '64-4-1', 'label': 'ip资产视角'}, {'id': '64-4-2', 'label': '应用系统视角'}]}, {'id': '64-5', 'label': '敏态测试资源池', 'children': [{'id': '64-5-1', 'label': 'ip资产视角'}, {'id': '64-5-2', 'label': '应用系统视角'}]}, {'id': '64-6', 'label': '稳态资源池', 'children': [{'id': '64-6-1', 'label': 'ip资产视角'}, {'id': '64-6-2', 'label': '应用系统视角'}]}, {'id': '64-7', 'label': '大数据资源池', 'children': [{'id': '64-7-1', 'label': 'ip资产视角'}, {'id': '64-7-2', 'label': ' 应用系统视角'}]}]}]


