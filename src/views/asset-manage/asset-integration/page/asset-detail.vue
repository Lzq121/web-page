<template>
  <div :class="{ isActivate: !disabledBNO }"
       class="disabled-three-form-layout">
    <dp title="资产详情"
        @back="backIndex"
        :desc="route.query.queryName">
      <template #left>
        <span class="field-color">
          <b>其它字段</b>
          <b class="cmdb-color">CMDB字段</b>
          <b class="edr-color">EDR字段</b>
          <b class="scan-color">扫描字段</b>
        </span>
        <el-button v-if="route.query.detailID && Object.keys(tagData).length>0"
                   color="#626aef"
                   @click="replaceAllTag"> 不应用所有标签 </el-button>
      </template>
      <template #right>

        <span v-if="disabledBNO">
          <el-button plain
                     @click="disabledEdit"
                     v-if="props.addType == 'edit' ? true : false"> 取消 </el-button>
          <el-button type="primary"
                     @click="addYes">确 认</el-button>
        </span>
        <el-button v-else
                   type="primary"
                   @click="editAssets">编 辑</el-button>
      </template>

      <dl class="dl-container-position">
        <dt>基础信息</dt>
        <dd>
          <el-form :inline="true"
                   :model="addlist"
                   label-width="150px"
                   :disabled="disabledB">
            <el-form-item required
                          v-if="route.query.addType === 'edit'">
              <template #label>
                <span :style="`color:${fieldColor.id}`"> 设备ID: </span>
              </template>
              <span>{{ addlist.id }}</span>
            </el-form-item>
            <el-form-item required
                          v-if="route.query.addType === 'edit'">
              <template #label>
                <span :style="`color:${fieldColor.id}`"> agentId: </span>
              </template>
              <span>{{ addlist.agent_id }}</span>
              <div class="tag-text"
                   v-if="tagData?.agent_id">
                <el-select :placeholder="tagData.agent_id[0].desc"
                           @change="replaceValue(changeAssetsHelp.agent_id, 'agent_id')"
                           size="small"
                           v-model="changeAssetsHelp.agent_id">
                  <el-option v-for="(tag, tagindex) in tagData.agent_id"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>

            <el-form-item required>
              <template #label>
                <span :style="`color:${fieldColor.name}`">
                  {{ props.ipOrApp == '1' ? '设备名称:' : '系统名称:' }}
                </span>
              </template>
              <el-input v-model="addlist.name"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.name">
                <el-select :placeholder="tagData.name[0].desc"
                           @change="replaceValue(changeAssetsHelp.name, 'name')"
                           size="small"
                           v-model="changeAssetsHelp.name">
                  <el-option v-for="(tag, tagindex) in tagData.name"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item required>
              <template #label>
                <span :style="`color:${fieldColor.ip}`">{{ props.ipOrApp == '1' ? '设备IP:' : 'URL:' }}</span>
              </template>
              <el-input v-model="addlist.ip"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.ip">
                <el-select :placeholder="tagData.ip[0].desc"
                           @change="replaceValue(changeAssetsHelp.ip, 'ip')"
                           size="small"
                           v-model="changeAssetsHelp.ip">
                  <el-option v-for="(tag, tagindex) in tagData.ip"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item required>
              <template #label>
                <span :style="`color:${fieldColor.class_name || fieldColor.biz_class}`">{{ props.ipOrApp == '1' ? '资产大类:' : '应用大类:' }}</span>
              </template>
              <el-select v-if="props.ipOrApp == '1'"
                         placeholder="-"
                         value-key="value"
                         v-model="addlist.class_name"
                         :disabled="disabledB"
                         @change="classIPappListFn">
                <el-option v-for="item in resourcesIPappList"
                           :key="item.id"
                           :label="item.name"
                           :value="item.name" />
              </el-select>

              <el-select v-else
                         placeholder="-"
                         value-key="value"
                         v-model="addlist.biz_class"
                         :disabled="disabledB"
                         @change="classIPappListFn">
                <el-option v-for="item in resourcesIPappList"
                           :key="item.id"
                           :label="item.name"
                           :value="item.name" />
              </el-select>
              <div class="tag-text"
                   v-if="tagData?.class_name">
                <el-select :placeholder="tagData.class_name[0].desc"
                           @change="replaceValue(changeAssetsHelp.class_name, 'class_name')"
                           size="small"
                           v-model="changeAssetsHelp.class_name">
                  <el-option v-for="(tag, tagindex) in tagData.class_name"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>

              <div class="tag-text"
                   v-if="tagData?.biz_class">
                <el-select :placeholder="tagData.biz_class[0].desc"
                           @change="replaceValue(changeAssetsHelp.biz_class, 'biz_class')"
                           size="small"
                           v-model="changeAssetsHelp.biz_class">
                  <el-option v-for="(tag, tagindex) in tagData.biz_class"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item required>
              <template #label>
                <span :style="`color:${fieldColor.resource_type || fieldColor.biz_type}`">{{
									props.ipOrApp == '1' ? '资产类型:' : '应用类型:'
								}}</span>
              </template>
              <el-select v-if="props.ipOrApp == '1'"
                         placeholder="-"
                         value-key="value"
                         v-model="addlist.resource_type"
                         :disabled="disabledB"
                         @change="childChange">
                <el-option v-for="item in classIPappList"
                           :key="item.id"
                           :label="item.name"
                           :value="item.name" />
              </el-select>
              <el-select v-else
                         placeholder="-"
                         value-key="value"
                         v-model="addlist.biz_type"
                         :disabled="disabledB"
                         @change="childChange">
                <el-option v-for="item in classIPappList"
                           :key="item.id"
                           :label="item.name"
                           :value="item.name" />
              </el-select>
              <div class="tag-text"
                   v-if="tagData?.resource_type">
                <el-select :placeholder="tagData.resource_type[0].desc"
                           @change="replaceValue(changeAssetsHelp.resource_type, 'resource_type')"
                           size="small"
                           v-model="changeAssetsHelp.resource_type">
                  <el-option v-for="(tag, tagindex) in tagData.resource_type"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>

              <div class="tag-text"
                   v-if="tagData?.biz_type">
                <el-select :placeholder="tagData.biz_type[0].desc"
                           @change="replaceValue(changeAssetsHelp.biz_type, 'biz_type')"
                           size="small"
                           v-model="changeAssetsHelp.biz_type">
                  <el-option v-for="(tag, tagindex) in tagData.biz_type"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item required>
              <template #label>
                <span :style="`color:${fieldColor.biz}`">{{ props.ipOrApp == '1' ? '所属应用:' : '部署区域:' }}</span>
              </template>
              <el-input v-model="addlist.biz"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.biz">
                <el-select :placeholder="tagData.biz[0].desc"
                           @change="replaceValue(changeAssetsHelp.biz, 'biz')"
                           size="small"
                           v-model="changeAssetsHelp.biz">
                  <el-option v-for="(tag, tagindex) in tagData.biz"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item required>
              <template #label>
                <span :style="`color:${fieldColor.status}`">{{ props.ipOrApp == '1' ? '运行状态:' : '系统状态:' }}</span>
              </template>
              <el-input v-model="addlist.status"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.status">

                <el-select :placeholder="tagData.status[0].desc"
                           @change="replaceValue(changeAssetsHelp.status, 'status')"
                           size="small"
                           v-model="changeAssetsHelp.status">
                  <el-option v-for="(tag, tagindex) in tagData.status"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>

            <el-form-item required>
              <template #label>
                <span :style="`color:${fieldColor.company}`">所属公司:</span>
              </template>
              <el-select placeholder="-"
                         value-key="value"
                         v-model="addlist.company"
                         :disabled="disabledB">
                <el-option v-for="item in departmentOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.label" />
              </el-select>
              <div class="tag-text"
                   v-if="tagData?.company">
                <el-select :placeholder="tagData.company[0].desc"
                           @change="replaceValue(changeAssetsHelp.company, 'company')"
                           size="small"
                           v-model="changeAssetsHelp.company">
                  <el-option v-for="(tag, tagindex) in tagData.company"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item required>
              <template #label>
                <span :style="`color:${fieldColor.dept}`">所属部门:</span>
              </template>
              <el-input v-if="props.ipOrApp != '1'"
                        v-model="addlist.dept"
                        :disabled="disabledB" />
              <el-select v-else
                         placeholder="-"
                         value-key="value"
                         v-model="addlist.dept"
                         :disabled="disabledB">
                <el-option v-for="item in departmentOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.label" />
              </el-select>
              <div class="tag-text"
                   v-if="tagData?.dept">
                <el-select :placeholder="tagData.dept[0].desc"
                           @change="replaceValue(changeAssetsHelp.dept, 'dept')"
                           size="small"
                           v-model="changeAssetsHelp.dept">
                  <el-option v-for="(tag, tagindex) in tagData.dept"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item required>
              <template #label>
                <span :style="`color:${fieldColor.safe_person}`">接口人:</span>
              </template>
              <el-input v-model="addlist.safe_person"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.safe_person">
                <el-select :placeholder="tagData.safe_person[0].desc"
                           @change="replaceValue(changeAssetsHelp.safe_person, 'safe_person')"
                           size="small"
                           v-model="changeAssetsHelp.safe_person">
                  <el-option v-for="(tag, tagindex) in tagData.safe_person"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <span :style="`color:${fieldColor.tp_safe}`">接口人电话:</span>
              </template>
              <el-input v-model="addlist.tp_safe"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.tp_safe">
                <el-select :placeholder="tagData.tp_safe[0].desc"
                           @change="replaceValue(changeAssetsHelp.tp_safe, 'tp_safe')"
                           size="small"
                           v-model="changeAssetsHelp.tp_safe">
                  <el-option v-for="(tag, tagindex) in tagData.tp_safe"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <span :style="`color:${fieldColor.dept_safe}`">接口人部门:</span>
              </template>
              <el-input v-model="addlist.dept_safe"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.dept_safe">

                <el-select :placeholder="tagData.dept_safe[0].desc"
                           @change="replaceValue(changeAssetsHelp.dept_safe, 'dept_safe')"
                           size="small"
                           v-model="changeAssetsHelp.dept_safe">
                  <el-option v-for="(tag, tagindex) in tagData.dept_safe"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <div v-if="props.ipOrApp == '1'">
              <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.external_ip}`">对外内网IP:</span>
                </template>
                <el-input v-model="addlist.external_ip"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.external_ip">
                  <el-select :placeholder="tagData.external_ip[0].desc"
                             @change="replaceValue(changeAssetsHelp.external_ip, 'external_ip')"
                             size="small"
                             v-model="changeAssetsHelp.external_ip">
                    <el-option v-for="(tag, tagindex) in tagData.external_ip"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.internal_ip}`">对外外网IP:</span>
                </template>
                <el-input v-model="addlist.internal_ip"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.internal_ip">

                  <el-select :placeholder="tagData.internal_ip[0].desc"
                             @change="replaceValue(changeAssetsHelp.internal_ip, 'internal_ip')"
                             size="small"
                             v-model="changeAssetsHelp.internal_ip">
                    <el-option v-for="(tag, tagindex) in tagData.internal_ip"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.hostname}`">主机名:</span>
                </template>
                <el-input v-model="addlist.hostname"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.hostname">
                  <el-select :placeholder="tagData.hostname[0].desc"
                             @change="replaceValue(changeAssetsHelp.hostname, 'hostname')"
                             size="small"
                             v-model="changeAssetsHelp.hostname">
                    <el-option v-for="(tag, tagindex) in tagData.hostname"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item>
            </div>
            <el-form-item v-if="props.ipOrApp == '2'">
              <template #label>
                <span :style="`color:${fieldColor.or_internet_app}`">是否互联网应用:</span>
              </template>
              <el-select clearable
                         placeholder=""
                         v-model="addlist.or_internet_app">
                <el-option label="是"
                           value="是" />
                <el-option label="否"
                           value="否" />
                <el-option label="未知"
                           value="未知" />
              </el-select>
            </el-form-item>

            <el-form-item style="width: 95%">
              <template #label>
                <span :style="`color:${fieldColor.os_version}`">系统版本:</span>
              </template>
              <el-input v-model="addlist.os_version"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.os_version">
                <el-select :placeholder="tagData.os_version[0].desc"
                           @change="replaceValue(changeAssetsHelp.os_version, 'os_version')"
                           size="small"
                           v-model="changeAssetsHelp.os_version">
                  <el-option v-for="(tag, tagindex) in tagData.os_version"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item style="width: 95%">
              <template #label>
                <span :style="`color:${fieldColor.description}`">描述信息:</span>
              </template>
              <el-input type="textarea"
                        v-model="addlist.description"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.description">
                <el-select :placeholder="tagData.description[0].desc"
                           @change="replaceValue(changeAssetsHelp.description, 'description')"
                           size="small"
                           v-model="changeAssetsHelp.description">
                  <el-option v-for="(tag, tagindex) in tagData.description"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>

            <el-form-item style="width: 95%"
                          v-if="Array.isArray(addlist.assets_label)">
              <template #label>
                <span>标签信息:</span>
              </template>
              <el-tag style="margin: 5px"
                      v-for="(item, index) in addlist.assets_label"
                      :key="index">{{ item }}</el-tag>
            </el-form-item>
          </el-form>
        </dd>
      </dl>
      <dl class="dl-container-position"
          v-if="assetFreshness && route.query.addType === 'edit'">
        <dt>新鲜度和完整度</dt>
        <dd style="padding: 20px">
          <table class="m_table"
                 style="text-align: center">
            <tr class="bold-td">
              <td>新鲜度等级</td>
              <td>新鲜度得分</td>
              <td>完整度</td>
            </tr>
            <tr>
              <td>{{ assetFreshness.freshness_level }}</td>
              <td>{{ assetFreshness.freshness_score }}</td>
              <td>{{ assetFreshness.completion }}</td>
            </tr>
          </table>
        </dd>
      </dl>
      <dl class="dl-container-position"
          v-if="props.ipOrApp == '1' && route.query.addType === 'edit'">
        <dt>网卡信息</dt>
        <dd>
          <table-unit :isShowPatination="false"
                      :topColShow="false"
                      :columns="networkCardCols"
                      :list="networkCards"></table-unit>
        </dd>
      </dl>

      <dl class="dl-container-position"
          v-if="props.ipOrApp == '1'">
        <dt>部署信息</dt>
        <dd>
          <el-form :inline="true"
                   :model="addlist"
                   label-suffix=":"
                   label-width="150px"
                   :disabled="disabledB">
            <el-form-item required>
              <template #label>
                <span :style="`color:${fieldColor.data_center}`">数据中心:</span>
              </template>
              <el-select placeholder="-"
                         v-model="addlist.data_center"
                         :disabled="disabledB">
                <el-option label="南方信息中心"
                           value="南方信息中心" />
                <el-option label="北方信息中心"
                           value="北方信息中心" />
                <el-option label="北同城信息中心"
                           value="北同城信息中心" />
                <el-option label="集团总部88号"
                           value="集团总部88号" />
              </el-select>
              <div class="tag-text"
                   v-if="tagData?.data_center">

                <el-select :placeholder="tagData.data_center[0].desc"
                           @change="replaceValue(changeAssetsHelp.data_center, 'data_center')"
                           size="small"
                           v-model="changeAssetsHelp.data_center">
                  <el-option v-for="(tag, tagindex) in tagData.data_center"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <span :style="`color:${fieldColor.room}`">机房:</span>
              </template>
              <el-input v-model="addlist.room"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.room">
                <el-select :placeholder="tagData.room[0].desc"
                           @change="replaceValue(changeAssetsHelp.room, 'room')"
                           size="small"
                           v-model="changeAssetsHelp.room">
                  <el-option v-for="(tag, tagindex) in tagData.room"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <span :style="`color:${fieldColor.rock}`">机柜:</span>
              </template>
              <el-input v-model="addlist.rock"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.rock">

                <el-select :placeholder="tagData.rock[0].desc"
                           @change="replaceValue(changeAssetsHelp.rock, 'rock')"
                           size="small"
                           v-model="changeAssetsHelp.rock">
                  <el-option v-for="(tag, tagindex) in tagData.rock"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>

            <el-form-item>
              <template #label>
                <span :style="`color:${fieldColor.start_u}`">起始U位:</span>
              </template>
              <el-input v-model="addlist.start_u"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.start_u">
                <el-select :placeholder="tagData.start_u[0].desc"
                           @change="replaceValue(changeAssetsHelp.start_u, 'start_u')"
                           size="small"
                           v-model="changeAssetsHelp.start_u">
                  <el-option v-for="(tag, tagindex) in tagData.start_u"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <span :style="`color:${fieldColor.end_u}`">终极U位:</span>
              </template>
              <el-input v-model="addlist.end_u"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.end_u">

                <el-select :placeholder="tagData.end_u[0].desc"
                           @change="replaceValue(changeAssetsHelp.end_u, 'end_u')"
                           size="small"
                           v-model="changeAssetsHelp.end_u">
                  <el-option v-for="(tag, tagindex) in tagData.end_u"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <span :style="`color:${fieldColor.unit_digit}`">U位数:</span>
              </template>
              <el-input v-model="addlist.unit_digit"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.unit_digit">
                <el-select :placeholder="tagData.unit_digit[0].desc"
                           @change="replaceValue(changeAssetsHelp.unit_digit, 'unit_digit')"
                           size="small"
                           v-model="changeAssetsHelp.unit_digit">
                  <el-option v-for="(tag, tagindex) in tagData.unit_digit"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>

            <el-form-item required>
              <template #label>
                <span :style="`color:${fieldColor.network_area}`">部署区域:</span>
              </template>
              <el-select placeholder="-"
                         value-key="value"
                         v-model="addlist.network_area"
                         :disabled="disabledB">
                <el-option v-for="item in regionqy"
                           :key="item.value"
                           :label="item.label"
                           :value="item.label" />
              </el-select>
              <div class="tag-text"
                   v-if="tagData?.network_area">
                <el-select :placeholder="tagData.network_area[0].desc"
                           @change="replaceValue(changeAssetsHelp.network_area, 'network_area')"
                           size="small"
                           v-model="changeAssetsHelp.network_area">
                  <el-option v-for="(tag, tagindex) in tagData.network_area"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <span :style="`color:${fieldColor.equipment_usage}`">设备用途:</span>
              </template>
              <el-input v-model="addlist.equipment_usage"
                        :disabled="disabledB" />
              <div class="tag-text"
                   v-if="tagData?.equipment_usage">

                <el-select :placeholder="tagData.equipment_usage[0].desc"
                           @change="replaceValue(changeAssetsHelp.equipment_usage, 'equipment_usage')"
                           size="small"
                           v-model="changeAssetsHelp.equipment_usage">
                  <el-option v-for="(tag, tagindex) in tagData.equipment_usage"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
          </el-form>
        </dd>
      </dl>
      <dl class="dl-container-position"
          v-if="props.ipOrApp != '1'">
        <dt>部署信息</dt>
        <dd>
          <table class="m_table"
                 style="text-align:center">
            <tr class="bold">
              <td>数据中心</td>
              <td>部署区域</td>
              <td>操作</td>
            </tr>
            <tr v-for="(i) in deployInfoList">
              <td>{{i.data_center}}</td>
              <td>{{i.network_area}}</td>
              <td>
                <el-button type="primary"
                           size="small"
                           link
                           @click="hostList(i)">主机列表</el-button>

              </td>
            </tr>
          </table>
        </dd>
      </dl>
      <dl class="dl-container-position">
        <dt>管理员信息</dt>
        <dd>
          <el-form :inline="true"
                   :model="addlist"
                   label-width="150px"
                   :disabled="disabledB">
            <div v-if="props.ipOrApp == '1'">
              <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.host_manager}`">主机管理员:</span>
                </template>
                <el-input v-model="addlist.host_manager"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.host_manager">
                  <el-select :placeholder="tagData.host_manager[0].desc"
                             @change="replaceValue(changeAssetsHelp.host_manager, 'host_manager')"
                             size="small"
                             v-model="changeAssetsHelp.host_manager">
                    <el-option v-for="(tag, tagindex) in tagData.host_manager"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.bak_admin}`">备用管理员:</span>
                </template>
                <el-input v-model="addlist.bak_admin"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.bak_admin">

                  <el-select :placeholder="tagData.bak_admin[0].desc"
                             @change="replaceValue(changeAssetsHelp.bak_admin, 'bak_admin')"
                             size="small"
                             v-model="changeAssetsHelp.bak_admin">
                    <el-option v-for="(tag, tagindex) in tagData.bak_admin"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.app_admin}`">应用管理员:</span>
                </template>
                <el-input v-model="addlist.app_admin"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.app_admin">

                  <el-select :placeholder="tagData.app_admin[0].desc"
                             @change="replaceValue(changeAssetsHelp.app_admin, 'app_admin')"
                             size="small"
                             v-model="changeAssetsHelp.app_admin">
                    <el-option v-for="(tag, tagindex) in tagData.app_admin"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.db_admin}`">数据库管理员:</span>
                </template>
                <el-input v-model="addlist.db_admin"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.db_admin">
                  <el-select :placeholder="tagData.db_admin[0].desc"
                             @change="replaceValue(changeAssetsHelp.db_admin, 'db_admin')"
                             size="small"
                             v-model="changeAssetsHelp.db_admin">
                    <el-option v-for="(tag, tagindex) in tagData.db_admin"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.middleware_admin}`">中间件管理员:</span>
                </template>
                <el-input v-model="addlist.middleware_admin"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.middleware_admin">
                  <el-select :placeholder="tagData.middleware_admin[0].desc"
                             @change="replaceValue(changeAssetsHelp.middleware_admin, 'middleware_admin')"
                             size="small"
                             v-model="changeAssetsHelp.middleware_admin">
                    <el-option v-for="(tag, tagindex) in tagData.middleware_admin"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.mail_of_main}`">主机管理员邮箱:</span>
                </template>
                <el-input v-model="addlist.mail_of_main"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.app_admin">
                  <el-select :placeholder="tagData.mail_of_main[0].desc"
                             @change="replaceValue(changeAssetsHelp.mail_of_main, 'mail_of_main')"
                             size="small"
                             v-model="changeAssetsHelp.mail_of_main">
                    <el-option v-for="(tag, tagindex) in tagData.mail_of_main"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.tp_of_main}`">主机管理员电话:</span>
                </template>
                <el-input v-model="addlist.tp_of_main"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.tp_of_main">

                  <el-select :placeholder="tagData.tp_of_main[0].desc"
                             @change="replaceValue(changeAssetsHelp.tp_of_main, 'tp_of_main')"
                             size="small"
                             v-model="changeAssetsHelp.tp_of_main">
                    <el-option v-for="(tag, tagindex) in tagData.tp_of_main"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.host_manager_dept}`">主机管理员部门:</span>
                </template>
                <el-input v-model="addlist.host_manager_dept"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.host_manager_dept">
                  <el-select :placeholder="tagData.host_manager_dept[0].desc"
                             @change="replaceValue(changeAssetsHelp.host_manager_dept, 'host_manager_dept')"
                             size="small"
                             v-model="changeAssetsHelp.host_manager_dept">
                    <el-option v-for="(tag, tagindex) in tagData.host_manager_dept"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.biz_manager}`">应用管理员:</span>
                </template>
                <el-input v-model="addlist.biz_manager"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.biz_manager">
                  <el-select :placeholder="tagData.biz_manager[0].desc"
                             @change="replaceValue(changeAssetsHelp.biz_manager, 'biz_manager')"
                             size="small"
                             v-model="changeAssetsHelp.biz_manager">
                    <el-option v-for="(tag, tagindex) in tagData.biz_manager"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item>
              <!-- <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.db_admin}`">数据库管理员:</span>
                </template>
                <el-input v-model="addlist.db_admin"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.db_admin">
                  <el-select :placeholder="tagData.db_admin[0].desc"
                             @change="replaceValue(changeAssetsHelp.db_admin, 'db_admin')"
                             size="small"
                             v-model="changeAssetsHelp.db_admin">
                    <el-option v-for="(tag, tagindex) in tagData.db_admin"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item>
                <template #label>
                  <span :style="`color:${fieldColor.middleware_admin}`">中间件管理员:</span>
                </template>
                <el-input v-model="addlist.middleware_admin"
                          :disabled="disabledB" />
                <div class="tag-text"
                     v-if="tagData?.middleware_admin">

                  <el-select :placeholder="tagData.middleware_admin[0].desc"
                             @change="replaceValue(changeAssetsHelp.middleware_admin, 'middleware_admin')"
                             size="small"
                             v-model="changeAssetsHelp.middleware_admin">
                    <el-option v-for="(tag, tagindex) in tagData.middleware_admin"
                               :key="tagindex"
                               :label="tag.desc"
                               :value="tag.after_value" />
                  </el-select>
                </div>
              </el-form-item> -->
            </div>
          </el-form>
        </dd>
      </dl>
      <dl class="dl-container-position"
          v-if="addlist.class_name === '主机' && props.ipOrApp == '1' && route.query.addType === 'edit'">
        <dt>进程信息</dt>

        <dd>
          <table-unit :columns="columnsResult"
                      :list="agentDetailList"
                      :total="agentInfoTotal"
                      :currentPage="agentInfo.page"
                      :pageSize="agentInfo.limit"
                      @handleSizeChange="handleSizeChangeAgentInfo"
                      @handleCurrentChange="handleCurrentChangeAgentInfo">
          </table-unit>
        </dd>
      </dl>
      <dl v-if="props.ipOrApp == '2' && route.query.addType === 'edit'"
          class="dl-container-position">
        <dt>资产可信度</dt>
        <dd>
          <table-unit :columns="columnsResult"
                      :list="agentDetailList"
                      :total="agentInfoTotal"
                      :currentPage="agentInfo.page"
                      :pageSize="agentInfo.limit"
                      @handleSizeChange="handleSizeChangeAgentInfo"
                      @handleCurrentChange="handleCurrentChangeAgentInfo">
          </table-unit>
        </dd>
      </dl>
      <dl v-if="props.ipOrApp == '2' && route.query.addType === 'edit'"
          class="dl-container-position">
        <dt>
          URL信息
          <el-button @click="addUrl"
                     type="primary"
                     icon="CirclePlus"
                     link>新增URL</el-button>
        </dt>
        <dd>
          <table-unit :columns="columnsUrl"
                      :list="urlList"
                      :total="urlTotal"
                      :currentPage="urlParams.page"
                      :pageSize="urlParams.limit"
                      @handleSizeChange="handleSizeChangeUrlInfo"
                      @handleCurrentChange="handleCurrentChangeUrlInfo">
            <template v-slot="{ record }">
              <el-button plain
                         size="small"
                         link
                         type="primary"
                         @click="editRowUrl(record)">编辑</el-button>
              <el-button plain
                         size="small"
                         link
                         type="danger"
                         @click="delRowUrl(record)">删除</el-button>
            </template>
          </table-unit>

          <el-dialog v-model="urlDialogVisible"
                     title="新增/编辑"
                     width="50%">
            <el-form :model="editRowUrlData"
                     label-suffix=":"
                     label-width="120px"
                     ref="urlFormRef">
              <el-form-item label="系统名称"
                            prop="business">
                <el-input v-model="editRowUrlData.business"
                          disabled></el-input>
              </el-form-item>

              <el-form-item label="业务内网ip"
                            prop="addr"
                            :rules="[
									{
										message: '请正确输入IP',
										pattern:
											/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/,
										trigger: 'blur',
									},
								]">
                <el-input v-model="editRowUrlData.addr"></el-input>
              </el-form-item>
              <el-form-item label="公网ip"
                            prop="map_ip"
                            :rules="[
									{
										message: '请正确输入IP',
										pattern:
											/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/,
										trigger: 'blur',
									},
								]">
                <el-input v-model="editRowUrlData.map_ip"></el-input>
              </el-form-item>
              <el-form-item label="域名/url"
                            prop="domain"
                            :rules="[{ message: '请正确输入域名', pattern: /^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/, trigger: 'blur' }]">
                <el-input v-model="editRowUrlData.domain"></el-input>
              </el-form-item>
              <el-form-item label="对外开放端口"
                            prop="service_port">
                <el-input v-model="editRowUrlData.service_port"
                          type="number"></el-input>
              </el-form-item>
              <el-form-item label="部署位置"
                            prop="network_area">
                <el-input v-model="editRowUrlData.network_area"></el-input>
              </el-form-item>

              <el-form-item label="所属公司"
                            prop="company_id">
                <el-select v-model="editRowUrlData.company_id"
                           filterable>
                  <el-option v-for="item in companyList"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="应用负责人"
                            prop="info_admin_id">
                <el-select v-model="editRowUrlData.info_admin_id"
                           filterable>
                  <el-option v-for="item in adminList"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id" />
                </el-select>
              </el-form-item>

              <el-form-item label="资产状态"
                            prop="status">
                <el-select v-model="editRowUrlData.status"
                           clearable>
                  <el-option label="在线"
                             value="在线" />
                  <el-option label="不在线"
                             value="不在线" />
                  <el-option label="未知"
                             value="未知" />
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="editRowUrlData.notes"
                          type="textarea" />
              </el-form-item>
            </el-form>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="urlDialogVisible = false">取消</el-button>
                <el-button type="primary"
                           @click="confirmEditUrl(urlFormRef)"> 确认 </el-button>
              </div>
            </template>
          </el-dialog>
        </dd>
      </dl>
      <dl class="dl-container-position"
          v-if="props.ipOrApp == '1' && route.query.addType === 'edit'">
        <dt>
          访问信息
          <el-button type="primary"
                     @click="
							informationDia = true;
							nameDia = 'add';
						"
                     link
                     icon="CirclePlus">
            新增访问信息
          </el-button>
        </dt>
        <dd>
          <table-unit :columns="interviewColumns"
                      :list="interviewList"
                      :total="totalInterview"
                      :currentPage="interviewListObj.page"
                      :pageSize="interviewListObj.limit"
                      @handleSizeChange="handleSizeChange1"
                      @handleCurrentChange="handleCurrentChange1">
            <template v-slot="{ record }">
              <el-button size="small"
                         type="primary"
                         link
                         @click="assEditDiaFn(record, 'eidt')">编辑</el-button>
              <el-button size="small"
                         type="danger"
                         link
                         @click="
									visible = true;
									interviewListObj = record;
									nameDia = 'edit';
								">删除</el-button>
            </template>
          </table-unit>
          <el-dialog v-model="informationDia"
                     title="新增/编辑"
                     width="50%"
                     @close="closed">
            <el-form :model="interviewListObj"
                     label-width="100px">
              <el-form-item label="访问系统名称"
                            prop="access_system_name">
                <el-input v-model="interviewListObj.access_system_name"></el-input>
              </el-form-item>
              <el-form-item label="访问源IP"
                            prop="access_ip">
                <el-input v-model="interviewListObj.access_ip"></el-input>
              </el-form-item>
              <el-form-item label="访问源端口"
                            prop="access_port">
                <el-input v-model="interviewListObj.access_port"></el-input>
              </el-form-item>
              <el-form-item label="访问IP"
                            prop="access_source_port">
                <el-input v-model="interviewListObj.access_source_ip"></el-input>
              </el-form-item>
              <el-form-item label="访问端口"
                            prop="access_source_port">
                <el-input v-model="interviewListObj.access_source_port"></el-input>
              </el-form-item>
              <el-form-item label="访问系统说明"
                            prop="access_sys_instruction">
                <el-input v-model="interviewListObj.access_sys_instruction"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="informationDia = false">取消</el-button>
                <el-button type="primary"
                           @click="accessListPostIDApi(ruleFormRef)"> 确认 </el-button>
              </div>
            </template>
          </el-dialog>
        </dd>
      </dl>
      <dl class="dl-container-position">
        <dt>维保信息</dt>
        <dd>
          <el-form :inline="true"
                   :model="addlist"
                   label-width="150px"
                   :disabled="disabledB">
            <el-form-item>
              <template #label>
                <span :style="`color:${fieldColor.Maintenance_Info}`">终止信息:</span>
              </template>
              <el-input v-model="addlist.Maintenance_Info"
                        :disabled="disabledB" />

              <div class="tag-text"
                   v-if="tagData?.Maintenance_Info">
                <el-select :placeholder="tagData.Maintenance_Info[0].desc"
                           @change="replaceValue(changeAssetsHelp.Maintenance_Info, 'Maintenance_Info')"
                           size="small"
                           v-model="changeAssetsHelp.Maintenance_Info">
                  <el-option v-for="(tag, tagindex) in tagData.Maintenance_Info"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <span :style="`color:${fieldColor.supplier}`">维保厂商:</span>
              </template>
              <el-input v-model="addlist.supplier"
                        :disabled="disabledB" />

              <div class="tag-text"
                   v-if="tagData?.supplier">
                <el-select :placeholder="tagData.supplier[0].desc"
                           @change="replaceValue(changeAssetsHelp.supplier, 'supplier')"
                           size="small"
                           v-model="changeAssetsHelp.supplier">
                  <el-option v-for="(tag, tagindex) in tagData.supplier"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>

            </el-form-item>
            <el-form-item>
              <template #label>
                <span :style="`color:${fieldColor.Maintenance_staff}`">维保人员:</span>
              </template>
              <el-input v-model="addlist.Maintenance_staff"
                        :disabled="disabledB" />

              <div class="tag-text"
                   v-if="tagData?.Maintenance_staff">
                <el-select :placeholder="tagData.Maintenance_staff[0].desc"
                           @change="replaceValue(changeAssetsHelp.Maintenance_staff, 'Maintenance_staff')"
                           size="small"
                           v-model="changeAssetsHelp.Maintenance_staff">
                  <el-option v-for="(tag, tagindex) in tagData.Maintenance_staff"
                             :key="tagindex"
                             :label="tag.desc"
                             :value="tag.after_value" />
                </el-select>
              </div>
            </el-form-item>
          </el-form>
        </dd>
      </dl>
      <dl class="dl-container-position"
          v-if="route.query.addType === 'edit'">
        <dt>更新日志</dt>
        <dd>
          <table-unit :currentPage="changeid.page"
                      :pageSize="changeid.limit"
                      :columns="columns"
                      :list="rawDataListOBJ"
                      :total="total1"
                      @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange">
          </table-unit>
        </dd>
      </dl>
      <div style="text-align: right; padding-top: 30px">
        <el-button style="width: 20%"
                   type="primary"
                   v-if="route.query.addType === 'edit'"
                   @click="storagePostIDApi">{{
					addlist.is_storage === '1' ? '更新 台账' : '确认 入库'
				}}</el-button>
      </div>
    </dp>
    <el-dialog v-model="visible"
               title="删除"
               width="500">
      <span>是否要删除该条信息</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary"
                     @click="assEditListPdelIDApi"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>

    <el-drawer v-model="isOpenHostList"
               :title="`主机列表（${hostListTotal}条）`"
               size="80%">
      <table-unit :columns="hostCols"
                  :list="hostListData"
                  :isIndex="true"
                  :height="tableHeight"
                  :isShowPatination="false">
      </table-unit>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import apis from '../api';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { regionqy, AllList, departmentOption, appList } from '../type.ts';
const router = useRouter();
const route = useRoute();
let props = ref(route.query);

let disabledB = ref(true);
let disabledBNO = ref(false);
let resourcesIPappList: any = ref([]);
let classIPappList = ref([]);
let rawDataListOBJ = ref([]);
let total1 = ref<number>(0);
let rawDataListPS = ref({
	page: 1,
	limit: 30,
});
let informationDia = ref(false);
const columnsResult = [
	{
		title: '进程PID',
		dataIndex: 'process_id',
	},

	{
		title: '进程版本',
		dataIndex: 'process_version',
	},
	{
		title: '进程状态',
		dataIndex: 'process_status',
	},
	{
		title: '端口号',
		dataIndex: 'port',
	},
	{
		title: '应用名',
		dataIndex: 'app_name',
	},
	{
		title: '应用版本',
		dataIndex: 'app_version',
	},
	{
		title: '应用类别',
		dataIndex: 'app_type',
	},
];

const columns = [
	{
		title: '更新人',
		dataIndex: 'modifier_name',
	},
	{
		title: '变更内容',
		dataIndex: 'change_data',
	},
	{
		title: '更新时间',
		dataIndex: 'update_datetime',
	},
];
const interviewColumns = [
	{
		title: '访问系统名称',
		dataIndex: 'access_system_name',
	},
	{
		title: '访问IP',
		dataIndex: 'access_source_ip',
	},
	{
		title: '访问端口',
		dataIndex: 'access_source_port',
	},
	{
		title: '访问源IP',
		dataIndex: 'access_ip',
	},
	{
		title: '访问源端口',
		dataIndex: 'access_port',
	},
	{
		title: '访问系统说明',
		dataIndex: 'access_sys_instruction',
	},
	{
		title: '操作',
		dataIndex: 'operate',
		width: 200,
	},
];
// 新增列表
let addlist: any = ref({
	id: '',
	logical_name: '',
	ip: '',
	class_name: '',
	resource_type: '',
	biz: '',
	status: '',
	company: '',
	dept: '',
	safe_person: '',
	tp_safe: '',
	dept_safe: '',
	external_ip: '',
	internal_ip: '',
	hostname: '',
	description: '',
	//基础信息结束
	data_center: '', //部署信息
	room: '',
	rock: '',
	start_u: '',
	end_u: '',
	unit_digit: '',
	network_area: '',
	equipment_usage: '',
	//部署信息结束
	os: '', //进程信息
	os_version: '',

	// 进程信息结束
	Maintenance_Info: '', //维保信息
	supplier: '',
	Maintenance_staff: '',
});

let changeid = ref({
	change_id: '',
	page: 1,
	limit: 30,
	change_table: route.query.ipOrApp === '1' ? 'HostMerge' : 'BusinessMerge',
});
let agentInfo = ref({
	limit: 30,
	page: 1,
	agent_id: '',
});

let changeAssetsHelp = ref({
	name: '',
	ip: '',
	class_name: '',
	biz_class: '',
	resource_type: '',
	biz_type: '',
	biz: '',
	status: '',
	company: '',
	dept: '',
	safe_person: '',
	tp_safe: '',
	dept_safe: '',
	external_ip: '',
	internal_ip: '',
	hostname: '',
	os_version: '',
	description: '',
	data_center: '',
	room: '',
	rock: '',
	start_u: '',
	end_u: '',
	unit_digit: '',
	network_area: '',
	equipment_usage: '',
	host_manager: '',
	agent_id: '',
	Maintenance_staff: '',
	supplier: '',
	Maintenance_Info: '',
	middleware_admin: '',
	db_admin: '',
	app_admin: '',
	host_manager_dept: '',
	tp_of_main: '',
	mail_of_main: '',
	bak_admin: '',
});

// 资源大类
const classIPappListFn = async (name: any) => {
	let id = '';
	resourcesIPappList.value.forEach((item: any) => {
		if (item.name == name) {
			addlist.value.class_name = item.name;
			id = item.id;
		}
	});
	addlist.value.resource_type = undefined;
	addlist.value.biz_type = undefined;
	let { data } = await apis.calssCategoryGetIDApi({ id: id });
	classIPappList.value = data;
};
const resourcesIPGet = async () => {
	if (props.value.ipOrApp == '2') {
		let { data } = await apis.APPCategoryGetIDApi();
		resourcesIPappList.value = data;
	} else {
		let { data } = await apis.resourceCategoryGetIDApi();
		resourcesIPappList.value = data;
	}
	if (resourcesIPappList.value.length > 0) {
		classIPappListFn(resourcesIPappList.value[0].name);
	}
};
resourcesIPGet();
// 大类选择

// 子类选择
const childChange = async (obj: any) => {
	classIPappList.value.forEach((item: any) => {
		if (item.id == obj) {
			addlist.value.resource_type = item.name;
		}
	});
};
// 入库
const storagePostIDApi = async () => {
	const query = {
		...route.query,
	};
	if (props.value.ipOrApp == '1') {
		let { code, msg } = await apis.storagePostIDApi(props.value.detailID);
		if (code == 2000) {
			ElMessageBox.confirm('入库成功，是否返回列表界面?', '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					router.push({ path: '/asset-manage/asset-integration', query });
				})
				.catch(() => {});
		}
	} else {
		let { code, msg } = await apis.storageBusinessPostIDApi(addlist.value.id);
		if (code == 2000) {
			ElMessageBox.confirm('入库成功，是否返回列表界面?', '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					router.push({ path: '/asset-manage/asset-integration', query });
				})
				.catch(() => {});
		}
	}
};
// 新增
const addYes = async () => {
	resourcesIPappList.value.forEach((item: any) => {
		if (item.id == addlist.value.class_name) {
			addlist.value.class_name = item.name;
		}
		if (item.id == addlist.value.biz_class) {
			addlist.value.biz_class = item.name;
		}
	});
	if (props.value.addType == 'edit') {
		if (props.value.ipOrApp == '1') {
			let { code, msg } = await apis.unknownListPutIDApi(addlist.value.id, addlist.value);
			if (code == 2000) {
				ElMessage.success(msg);
			}
		} else {
			let { code, msg } = await apis.bussListPutIDApi(addlist.value.id, addlist.value);
			if (code == 2000) {
				ElMessage.success(msg);
			}
		}
	} else {
		if (props.value.ipOrApp == '1') {
			let { code, msg } = await apis.unknownListPostApi(addlist.value);
			if (code == 2000) {
				ElMessage.success(msg);
			}
		} else {
			let { code, msg } = await apis.addBusinessApi(addlist.value);
			if (code == 2000) {
				ElMessage.success(msg);
			}
		}
	}
	initGet();
};
// 详情展示
let tagData: any = ref({});
let fieldColor: any = ref({});
let assetFreshness: any = ref({});
let deployInfoList = ref([]);
const detailsAll = async () => {
	if (props.value.ipOrApp == '2') {
		let { data } = await apis.AppunknownListGetIDApi(props.value.detailID);
		addlist.value = data;
		tagData.value = data.assets_help || {};
		fieldColor.value = data.field_color || {};
		assetFreshness.value = data.asset_freshness;
		deployInfoList.value = data.deploy_info;
		disabledEdit();
	} else {
		let { data } = await apis.unknownListGetIDApi(props.value.detailID);
		addlist.value = data;
		tagData.value = data.assets_help || {};
		fieldColor.value = data.field_color || {};
		assetFreshness.value = data.asset_freshness;
		deployInfoList.value = data.deploy_info;
		accessListGetIDApi(addlist.value.ip);
		disabledEdit();
	}
};

// 访问信息
let interviewList = ref();
let visible = ref(false);
let interviewListObj: any = ref({
	access_system_name: '',
	access_source_ip: '',
	access_port: '',
	access_source_port: '',
	access_sys_instruction: '',
	access_ip: '',
});
let interviewListObjIP = ref({
	access_ip: '',
	page: 1,
	limit: 30,
});
let totalInterview = ref(0);
let nameDia = ref('add');
const accessListGetIDApi = async (ip?: any) => {
	interviewListObjIP.value.access_ip = addlist.value.ip;
	interviewListObj.value.access_ip = addlist.value.ip;
	const { data, total } = await apis.accessListGetIDApi(interviewListObjIP.value);
	interviewList.value = data;
	totalInterview.value = total;
};
const accessListPostIDApi = async () => {
	if (nameDia.value == 'add') {
		const { code, msg } = await apis.accessListPostIDApi(interviewListObj.value);
		if (code == 2000) {
			ElMessage.success(msg);
			informationDia.value = false;
			accessListGetIDApi();
		}
	} else {
		assEditDiaFnYes();
	}
};
const assEditDiaFn = async (row: any, name?: any) => {
	informationDia.value = true;
	nameDia.value = name;
	interviewListObj.value = row;
};
const assEditDiaFnYes = async () => {
	const { code, msg } = await apis.assEditListPutIDApi(interviewListObj.value.id, interviewListObj.value);
	if (code == 2000) {
		ElMessage.success(msg);
		informationDia.value = false;
		accessListGetIDApi();
	}
};
const assEditListPdelIDApi = async (row?: any) => {
	const { code, msg } = await apis.assEditListPdelIDApi(interviewListObj.value.id);
	if (code == 2000) {
		ElMessage.success(msg);
		visible.value = false;
		accessListGetIDApi();
	}
};
const handleSizeChange1 = (val: any) => {
	interviewListObjIP.value.limit = val;
	interviewListObjIP.value.page = 1;
	accessListGetIDApi();
};
const handleCurrentChange1 = (val: any) => {
	interviewListObjIP.value.page = val;
	accessListGetIDApi();
};

// 更新日志
const journalListGetApi = async () => {
	changeid.value.change_id = route.query.detailID;
	let { data, total } = await apis.journalListGetApi(changeid.value);
	rawDataListOBJ.value = data;
	total1.value = total;
};

let agentDetailList = ref([]);
let agentInfoTotal = ref(0);
const agentDetail = async () => {
	agentInfo.value.agent_id = props.value.agentID;
	let { data, total } = await apis.agentDetailApi(agentInfo.value);
	agentInfoTotal.value = total;
	agentDetailList.value = data;
};
const networkCardCols = ref([
	{ title: '网卡名称', dataIndex: 'name' },
	{ title: 'MAC地址', dataIndex: 'mac' },
	{ title: 'IPV4地址', dataIndex: 'ipv4' },
	{ title: 'IPV6地址', dataIndex: 'ipv6' },
	{ title: '默认网关', dataIndex: 'gateway' },
	{ title: 'DNS Server', dataIndex: 'dns_server' },
	{ title: '网卡状态', dataIndex: 'status' },
	{ title: '网卡子网掩码', dataIndex: 'netmask' },
	{ title: '网卡广播地址', dataIndex: 'broadcast' },
	{ title: '网卡速度', dataIndex: 'speed' },
]);
let networkCards = ref([]);
const getEdrNetworkCard = async () => {
	if (props.value.ipOrApp !== '1') {
		return;
	}
	let { data, total } = await apis.getEdrNetworkCard({ agent_id: props.value.agentID });
	networkCards.value = data;
};

const handleSizeChangeAgentInfo = (val: number) => {
	agentInfo.value.limit = val;
	agentInfo.value.page = 1;
	agentDetail();
};
const handleCurrentChangeAgentInfo = (val: number) => {
	agentInfo.value.page = val;
	agentDetail();
};
const editAssets = () => {
	disabledB.value = false;
	disabledBNO.value = true;
};

const disabledEdit = () => {
	disabledB.value = true;
	disabledBNO.value = false;
};
const handleSizeChange = (val: number) => {
	changeid.value.limit = val;
	changeid.value.page = 1;
	journalListGetApi();
};
const handleCurrentChange = (val: number) => {
	changeid.value.page = val;
	journalListGetApi();
};
const backIndex = () => {
	if (route.query.bizName) {
		router.push({ path: '/asset-manage/asset-integration/host-list', query: { bizName: route.query.bizName } });
	} else {
		router.push({ path: '/asset-manage/asset-integration', query: { ...route.query } });
	}
};
const closed = () => {
	interviewListObj.value = {
		access_system_name: '',
		access_source_ip: '',
		access_port: '',
		access_source_port: '',
		access_sys_instruction: '',
		access_ip: addlist.value.ip,
	};
};
const replaceValue = (val, field_name) => {
	const data = {
		id: route.query.detailID,
		field_name,
		value: val,
	};
	apis.replaceInfo(data).then((res: any) => {
		if (res.code === 2000) {
			ElMessage.success('更新成功');
			initGet();
		}
	});
};

const columnsUrl = [
	{ title: '域名/URL', dataIndex: 'domain' },
	{ title: '业务内网IP', dataIndex: 'addr' },
	{ title: '公网IP', dataIndex: 'map_ip' },
	{ title: '对外端口', dataIndex: 'service_port' },
	{ title: '所属公司', dataIndex: 'company_name' },
	{ title: '应用负责人', dataIndex: 'info_admin_name' },
	{ title: '部署位置', dataIndex: 'network_area' },
	{ title: '备注', dataIndex: 'notes' },
	{ title: '资产状态', dataIndex: 'status' },
	{
		title: '操作',
		dataIndex: 'operate',

		width: 200,
	},
];
let urlList = ref([]);
let urlTotal = ref(0);
let urlParams = ref({
	limit: 30,
	page: 1,
	business: '',
	equal: true,
});
let companyList = ref([]);
const fetchCompanyList = async () => {
	const res = await apis.getCompanyList();
	companyList.value = res.data;
};
let adminList = ref([]);
const fetchAdminList = async () => {
	const res = await apis.getAdminList({ page: 1, limit: 9999 });
	adminList.value = res.data;
};
const getUrlInfo = async () => {
	urlParams.value.business = route.query.queryName;
	let { data, total } = await apis.getUrlList(urlParams.value);
	urlTotal.value = total;
	urlList.value = data;
	if (companyList.value.length === 0) {
		fetchCompanyList();
	}
	if (adminList.value.length === 0) {
		fetchAdminList();
	}
};
const handleSizeChangeUrlInfo = (val: number) => {
	urlParams.value.limit = val;
	urlParams.value.page = 1;
	getUrlInfo();
};
const handleCurrentChangeUrlInfo = (val: number) => {
	urlParams.value.page = val;
	getUrlInfo();
};

let editRowUrlData = ref({
	business: '',
	domain: '',
	addr: '',
	service_port: '',
	company_id: '',
	info_admin_id: '',
	network_area: '',
	notes: '',
	map_ip: null,
	id: null,
	status: null,
});
let urlDialogVisible = ref(false);
const addUrl = () => {
	urlDialogVisible.value = true;
	editRowUrlData.value = {
		business: route.query.queryName,
		domain: '',
		addr: '',
		service_port: '',
		company_id: '',
		info_admin_id: '',
		network_area: '',
		notes: '',
		map_ip: null,
		status: null,
	};
};
const editRowUrl = async (val: any) => {
	apis.getUrlObj(val.id).then((res: any) => {
		if (res.code == 2000) {
			for (const key in editRowUrlData.value) {
				editRowUrlData.value[key] = res.data[key];
			}
			urlDialogVisible.value = true;
		}
	});
};
const urlFormRef = ref<FormInstance>();
const confirmEditUrl = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			if (editRowUrlData.value.id) {
				const res = await apis.updateUrlObj(editRowUrlData.value);
				if (res.code === 2000) {
					ElMessage.success('编辑成功');
				}
			} else {
				const res = await apis.addUrlObj(editRowUrlData.value);
				if (res.code === 2000) {
					ElMessage.success('新增成功');
				}
			}
			editRowUrlData.value = {
				business: route.query.queryName,
				domain: '',
				addr: '',
				service_port: '',
				company_id: '',
				info_admin_id: '',
				network_area: '',
				notes: '',
				map_ip: null,
				id: null,
				status: null,
			};
			getUrlInfo();
			urlDialogVisible.value = false;
		}
	});
};
const delRowUrl = (val: any) => {
	ElMessageBox.confirm('确认删除吗?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const res = await apis.delUrlObj(val.id);
			if (res.code === 2000) {
				ElMessage.success('删除成功');
				getUrlInfo();
			}
		})
		.catch(() => {});
};

let isOpenHostList = ref(false);
let hostListData = ref([]);
let hostListTotal = ref();
let hostCols = [...AllList];
hostCols.pop();
let tableHeight = window.innerHeight - 70;
const hostList = async (val) => {
	let params = {
		network_area: val.network_area,
		data_center: val.data_center,
		limit: 99999,
		page: 1,
		biz_name: route.query.queryName,
	};
	let res = await apis.unknownListGetApi(params);
	hostListData.value = res.data;
	hostListTotal.value = res.total;
	hostListData.value.forEach((item: any) => {
		item.tags = item.assets_label;
		item.is_storage$ = item.is_storage === '1' ? { code: 1, value: '已入库' } : { code: 3, value: '未入库' };
	});
	isOpenHostList.value = true;
};

const replaceAllTag = () => {
	ElMessageBox.confirm('确认不应用所有标签吗?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			apis.replaceAllTag({ id: route.query.detailID }).then((res: any) => {
				if (res.code === 2000) {
					initGet();
					ElMessage.success(res.msg);
				}
			});
		})
		.catch(() => {});
};

const initGet = () => {
	detailsAll();
	agentDetail();
	getEdrNetworkCard();
	journalListGetApi();
	getUrlInfo();
};
if (route.query.addType === 'edit') {
	initGet();
} else {
	editAssets();
}
</script>

<style scoped lang="scss">
@import '@/theme/mixins/formReset.scss';

.tag-text {
	font-size: 11px;
	:deep(.el-select__wrapper.is-disabled .el-select__selected-item) {
		color: #f78989;
	}
}

.field-color {
	font-weight: 400;
	font-size: 13px;
	b {
		margin-right: 30px;
		color: var(--el-text-color-primary);

		&::before {
			content: '';
			display: inline-block;
			width: 10px;
			height: 10px;
			border-radius: 50%;
			margin-right: 5px;
			background-color: var(--el-text-color-primary);
		}
	}

	.cmdb-color {
		color: #1492ff;

		&::before {
			background-color: #1492ff;
		}
	}

	.edr-color {
		color: #67c23a;

		&::before {
			background-color: #67c23a;
		}
	}

	.scan-color {
		color: #e6a23c;

		&::before {
			background-color: #e6a23c;
		}
	}
}
</style>
