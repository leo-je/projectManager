<template>
  <section>
    <div class="add-button">
      <a-config-provider :auto-insert-space-in-button="false">
        <a-button type="primary" @click="addDemand"> 添加 </a-button>
      </a-config-provider>
    </div>
    <a-table :columns="columns" :data-source="data" bordered>
      <template #name="{ text }">
        <span>
          <a>{{ text }}</a>
        </span>
      </template>

      <template #programList="{ text }">
        <div v-for="item in text" :key="item">
          <span>
            <a>{{ item.programName }}{{ " " }}{{ item.branchName }}</a>
          </span>
        </div>
      </template>

      <template #scheduledFinishTime="{ text }">
        <span>
          {{ formatTime(text) }}
        </span>
      </template>

      <template #jiraCode="{ text }">
        <span>
          <a
            v-if="hasJiraLink(text)"
            target="view_window"
            :href="getJiraLink(text)"
            >{{ text }}</a
          >
          <span v-else>{{ text }}</span>
        </span>
      </template>

      <template #scheduledOnLineTime="{ text }">
        <span>
          {{ formatTime(text) }}
        </span>
      </template>

      <template #status="{ text: record }">
        <span>{{ getDemandStatus(record.status) }}</span>
        <a-divider type="vertical" />
        <a class="onSelect" @click="updateStatus(record)">更新</a>
      </template>
      <template #updateInfo="{ text: record }">
        <a class="onSelect" @click="lookInfo(record)">查看</a>
      </template>
      <template #action="{ text: record }">
        <span>
          <a class="onSelect" @click="editDemand(record)">编辑</a>
          <a-divider type="vertical" />
          <a class="onSelect" @click="deleteDemand(record.id)">删除</a>
        </span>
      </template>
      <!-- <template #title="">
      Header
    </template> -->

      <!-- <template #footer="">
      Footer
    </template> -->
    </a-table>

    <!-- 添加/编辑对话框 -->
    <div class="addEditWindown">
      <a-modal
        :title="wtitle"
        :width="900"
        v-model:visible="addEditVisible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
      >
        <a-form :model="demand" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="12">
              <a-form-item label="项目名称" has-feedback>
                <a-select
                  v-model:value="demand.projectId"
                  placeholder="Please select a country"
                  @change="selectProject"
                >
                  <a-select-option
                    v-for="item in projects"
                    :key="item"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                  <!-- <a-select-option value="usa"> U.S.A </a-select-option> -->
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="需求名称">
                <a-input
                  placeholder="请输入项目名称"
                  v-model:value="demand.name"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="计划开始时间">
                <a-date-picker
                  v-model:value="demand.scheduledFinishTime"
                  show-time
                  placeholder="选择时间"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="计划上线时间">
                <a-date-picker
                  v-model:value="demand.scheduledOnLineTime"
                  show-time
                  placeholder="选择时间"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="挂载版本">
                <a-input
                  placeholder="请输入版本号"
                  v-model:value="demand.version"
                /> </a-form-item
            ></a-col>
            <a-col :span="12">
              <a-form-item label="排序">
                <a-input placeholder="" v-model:value="demand.sort" />
              </a-form-item> </a-col
          ></a-row>

          <a-form-item label="jira编号">
            <a-input placeholder="" v-model:value="demand.jiraCode" />
          </a-form-item>

          <a-form-item label="工程/分支">
            <a-table
              :columns="programColumns"
              :data-source="programList"
              bordered
            >
              <template #programName="{ text, record }">
                <div>
                  <!-- <a-input
                    v-if="record.editable"
                    style="margin: -5px 0"
                    :value="text"
                    @change="
                      (e) => handleChangeprogramName(e.target.value, record)
                    "
                  /> -->

                  <a-select
                    v-if="record.editable"
                    v-model:value="record.programId"
                    placeholder="Please select a country"
                    @change="(e) => handleChangeprogramName(e, record)"
                  >
                    <a-select-option
                      v-for="item in programs"
                      :key="item"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </a-select-option>
                    <!-- <a-select-option value="usa"> U.S.A </a-select-option> -->
                  </a-select>
                  <template v-else>
                    {{ text }}
                  </template>
                </div>
              </template>
              <template #branchName="{ text, record }">
                <div>
                  <a-input
                    v-if="record.editable"
                    style="margin: -5px 0"
                    :value="text"
                    @change="
                      (e) => handleChangeBranchName(e.target.value, record)
                    "
                  />
                  <template v-else> {{ text }} </template>
                </div>
              </template>
              <template #action="{ text: record }">
                <span>
                  <span v-if="record.editable">
                    <a-button
                      type="primary"
                      class="onSelect"
                      @click="saveprogram(record)"
                      >确定</a-button
                    >
                  </span>
                  <span v-else>
                    <a-button
                      type="primary"
                      :disabled="programHasEdit"
                      class="onSelect"
                      @click="editprogram(record)"
                      >编辑</a-button
                    >
                  </span>

                  <a-divider type="vertical" />
                  <a-button
                    type="primary"
                    class="onSelect"
                    @click="deleteprogram(record)"
                    >删除</a-button
                  >
                </span>
              </template>
            </a-table>
            <a-config-provider :auto-insert-space-in-button="false">
              <a-button type="primary" @click="addprogram"> 添加 </a-button>
            </a-config-provider>
          </a-form-item>
          <a-form-item label="需求信息">
            <a-textarea
              style="min-width: 400px"
              v-model:value="demand.info"
              placeholder="请输入项目信息"
              :rows="6"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>

    <div class="updateStatusWindows">
      <a-modal
        :title="更新状态"
        :width="300"
        v-model:visible="updateStatusVisible"
        :confirm-loading="updateStatusConfirmLoading"
        @ok="updateStatusHandleOk"
      >
        <a-form :model="demand" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="状态" has-feedback>
            <a-select
              v-model:value="demand.status"
              placeholder="请选择状态"
              @change="(e) => {}"
            >
              <a-select-option
                v-for="item in statusList"
                :key="item"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
              <!-- <a-select-option value="usa"> U.S.A </a-select-option> -->
            </a-select>
          </a-form-item>
        </a-form></a-modal
      >
    </div>

    <div class="lookInfoWindows">
      <a-modal :title="信息" :width="900" v-model:visible="lookInfoVisible">
        <p>{{ demand.log }}</p>
      </a-modal>
    </div>
  </section>
</template>
<script>
import http from "../../utils/http";
import { formatTime } from "../../utils/date";
var ft = formatTime;
// 表头配置
const columns = [
  {
    title: "项目名称",
    dataIndex: "projectName",
    slots: { customRender: "name" },
  },
  {
    title: "需求名称",
    dataIndex: "name",
    slots: { customRender: "name" },
  },
    {
    title: "jira",
    //className: "column-projetInfo",
    dataIndex: "jiraCode",
    slots: { customRender: "jiraCode" },
  },
  {
    title: "挂载版本",
    dataIndex: "version",
    slots: { customRender: "version" },
  },
  {
    title: "计划完成时间",
    //className: "column-projetInfo",
    dataIndex: "scheduledFinishTime",
    slots: { customRender: "scheduledFinishTime" },
  },
  {
    title: "计划上线时间",
    //className: "column-projetInfo",
    dataIndex: "scheduledOnLineTime",
    slots: { customRender: "scheduledOnLineTime" },
  },
  {
    title: "工程/分支",
    //className: "column-projetInfo",
    dataIndex: "programList",
    slots: { customRender: "programList" },
  },
  {
    title: "状态",
    //className: "column-projetInfo",
    key: "action",
    slots: { customRender: "status" },
  },
  {
    title: "需求信息",
    //className: "column-projetInfo",
    dataIndex: "info",
    slots: { customRender: "info" },
  },
  {
    title: "信息",
    //className: "column-projetInfo",
    key: "action",
    slots: { customRender: "updateInfo" },
  },
  //   {
  //     title: "Address",
  //     dataIndex: "address",
  //   },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
  },
];

const programColumns = [
  {
    title: "工程名称",
    dataIndex: "programName",
    slots: { customRender: "programName" },
  },
  {
    title: "分支名称",
    dataIndex: "branchName",
    slots: { customRender: "branchName" },
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
  },
];

const programList = [];

const statusList = [
  { id: "0", name: "未开始" },
  { id: "1", name: "进行中" },
  { id: "2", name: "完成开发" },
  { id: "3", name: "已上线" },
  { id: "4", name: "中止开发" },
  { id: "5", name: "废弃" },
];

export default {
  name: "SettingDemand",
  data() {
    return {
      wtitle: "添加",
      data: [],
      columns,
      projects: [],
      programs: [],
      statusList,
      programColumns,
      programList,
      programHasEdit: false,
      addEditVisible: false,
      confirmLoading: false,
      lookInfoVisible: false,
      updateStatusConfirmLoading: false,
      updateStatusVisible: false,
      demand: {
        id: "",
        projectName: "",
        projectId: "",
        log: "",
        name: "",
        info: "",
      },
    };
  },
  mounted() {
    this.getprojects();
    this.getList();
    this.getprograms();
  },
  methods: {
    getJiraLink(text) {
      return 'http://jira.caih.local/browse/'+text;
    },
    hasJiraLink(text) {
      console.log(text);
      if (text ) {
        return true;
      } else {
        return false;
      }
    },
    lookInfo(row) {
      let list = [];
      if (row.log) {
        list = row.log.split("||");
        console.log(list);
      }
      this.$info({
        title: "信息",
        content: (
          <div>
            <p>
              {list.map((item) => (
                <div>{item}</div>
              ))}
            </p>
          </div>
        ),
        onOk() {},
      });
    },
    getDemandStatus(status) {
      console.log(status);
      var s = this.statusList.filter((e) => e.id === status);
      if (s != null && s.length > 0) {
        return s[0].name;
      }
      return "未知";
    },
    updateStatusHandleOk() {
      console.log(this.demand);
      this.updateStatusConfirmLoading = true;
      var _this = this;
      http("post", "./pm/busi/demand/add", {
        id: this.demand.id,
        status: this.demand.status,
      })
        .then(function (data) {
          console.log(data);
          _this.updateStatusVisible = false;
          _this.updateStatusConfirmLoading = false;
          _this.getList();
        })
        .catch(function (e) {
          console.error(e);
          _this.updateStatusConfirmLoading = false;
        });
    },
    updateStatus(row) {
      this.demand = row;
      this.updateStatusVisible = true;
    },
    formatTime(data) {
      return ft(data);
    },
    getList() {
      var _this = this;
      http("post", "./pm/busi/demand/list")
        .then(function (data) {
          console.log(data);
          data.forEach((element) => {
            if (element.scheduledOnLineTime)
              element.scheduledOnLineTime = new Date(
                element.scheduledOnLineTime
              );
            if (element.scheduledFinishTime)
              element.scheduledFinishTime = new Date(
                element.scheduledFinishTime
              );
          });
          _this.data = data;
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    getprojects() {
      var _this = this;
      http("post", "./pm/busi/project/list")
        .then(function (data) {
          console.log(data);
          _this.projects = data;
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    getprograms() {
      var _this = this;
      http("post", "./pm/busi/program/list")
        .then(function (data) {
          console.log(data);
          _this.programs = data;
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    deleteDemand: function (id) {
      var _this = this;
      http("get", "./pm/busi/demand/delete", { id: id })
        .then(function (data) {
          console.log(data);
          _this.getList();
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    editDemand: function (row) {
      this.programList = row.programList;
      this.showWindows("编辑项目", JSON.parse(JSON.stringify(row)));
    },
    addDemand() {
      this.programList = [];
      this.showWindows("添加项目", {});
    },
    showWindows: function (title, row) {
      //console.log(row);
      this.demand = row;
      this.wtitle = title;
      this.addEditVisible = true;
    },
    selectProject(key) {
      var _project = this.projects.filter((e) => e.id === key);
      this.demand.projectName = _project[0].name;
    },
    handleOk() {
      console.log(this.demand);
      console.log(this.demand.scheduledOnLineTime);
      this.confirmLoading = true;
      this.demand.programList = JSON.parse(JSON.stringify(this.programList));
      var _this = this;
      http("post", "./pm/busi/demand/add", this.demand)
        .then(function (data) {
          console.log(data);
          _this.addEditVisible = false;
          _this.confirmLoading = false;
          _this.getList();
        })
        .catch(function (e) {
          console.error(e);
          _this.confirmLoading = false;
        });
    },
    editprogram(row) {
      this.programHasEdit = true;
      row.editable = true;
    },
    saveprogram(row) {
      console.log(row);
      this.programHasEdit = false;
      delete row.editable;
    },
    handleChangeprogramName(value, row) {
      var _program = this.programs.filter((e) => e.id === value);
      row.programName = _program[0].name;
      console.log(row);
    },
    handleChangeBranchName(value, row) {
      row.branchName = value;
    },
    addprogram() {
      if (this.programHasEdit) {
        return;
      }
      this.programHasEdit = true;
      if (!this.programList) {
        this.programList = [];
      }
      this.programList.push({
        id: "",
        editable: true,
        programName: "",
        branchName: "",
      });
    },
    deleteprogram(row) {
      console.log(row);
      var target = this.programList.filter((item) => item != row);
      this.programList = target;
      this.programHasEdit = false;
    },
  },
};
</script>
<style>
th.column-money,
td.column-money {
  text-align: right !important;
}
.add-button {
  text-align: right;
  margin-bottom: 10px;
}
.onSelect {
  -moz-user-select: -moz-none;
  user-select: none;
}
</style>