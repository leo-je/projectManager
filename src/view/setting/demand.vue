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

      <template #programmeList="{ text }">
        <div v-for="item in text" :key="item">
          <span>
            <a>{{ item.programmeName }}{{ " " }}{{ item.branchName }}</a>
          </span>
        </div>
      </template>

      <template #scheduledFinishTime="{ text }">
        <span>
          {{ formatTime(text) }}
        </span>
      </template>

      <template #scheduledOnLineTime="{ text }">
        <span>
          {{ formatTime(text) }}
        </span>
      </template>

      <template #status="{ text: record }">
        <a>{{ record.status }}</a>
        <a-divider type="vertical" />
        <a class="onSelect" @click="deleteProject(record.id)">更新</a>
      </template>
      <template #updateInfo="{ text: record }">
        <a class="onSelect" @click="deleteProject(record.id)">查看</a>
      </template>
      <template #action="{ text: record }">
        <span>
          <a class="onSelect" @click="deleteProject(record.id)">上升</a>
          <a-divider type="vertical" />
          <a class="onSelect" @click="deleteProject(record.id)">下降</a>
          <a-divider type="vertical" />
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

    <!-- 对话框 -->
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

          <a-form-item label="挂载版本">
            <a-input
              placeholder="请输入版本号"
              v-model:value="demand.version"
            />
          </a-form-item>

          <a-form-item label="工程/分支">
            <a-table
              :columns="programmeColumns"
              :data-source="programmeList"
              bordered
            >
              <template #programmeName="{ text, record }">
                <div>
                  <a-input
                    v-if="record.editable"
                    style="margin: -5px 0"
                    :value="text"
                    @change="
                      (e) => handleChangeProgrammeName(e.target.value, record)
                    "
                  />
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
                      @click="saveProgramme(record)"
                      >确定</a-button
                    >
                  </span>
                  <span v-else>
                    <a-button
                      type="primary"
                      :disabled="programmeHasEdit"
                      class="onSelect"
                      @click="editProgramme(record)"
                      >编辑</a-button
                    >
                  </span>

                  <a-divider type="vertical" />
                  <a-button
                    type="primary"
                    class="onSelect"
                    @click="deleteProgramme(record)"
                    >删除</a-button
                  >
                </span>
              </template>
            </a-table>
            <a-config-provider :auto-insert-space-in-button="false">
              <a-button type="primary" @click="addProgramme"> 添加 </a-button>
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
    title: "需求信息",
    //className: "column-projetInfo",
    dataIndex: "info",
    slots: { customRender: "info" },
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
    dataIndex: "programmeList",
    slots: { customRender: "programmeList" },
  },
  {
    title: "状态",
    //className: "column-projetInfo",
    key: "action",
    slots: { customRender: "status" },
  },
  {
    title: "更新记录",
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

const programmeColumns = [
  {
    title: "工程名称",
    dataIndex: "programmeName",
    slots: { customRender: "programmeName" },
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

const programmeList = [];

export default {
  name: "SettingDemand",
  data() {
    return {
      wtitle: "添加",
      data:[],
      columns,
      projects: [],
      programmeColumns,
      programmeList,
      programmeHasEdit: false,
      addEditVisible: false,
      confirmLoading: false,
      demand: {
        id: "",
        projectName: "",
        projectId: "",
        name: "",
        info: "",
      },
    };
  },
  mounted() {
    this.getprojects();
    this.getList();
  },
  methods: {
    formatTime(data) {
      return ft(data);
    },
    getList() {
      var _this = this;
      http("post", "./pm/busi/demand/list")
        .then(function (data) {
          console.log(data);
          data.forEach(element => {
            if(element.scheduledOnLineTime)element.scheduledOnLineTime = new Date(element.scheduledOnLineTime)
            if(element.scheduledFinishTime)element.scheduledFinishTime = new Date(element.scheduledFinishTime)
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
      this.programmeList = row.programmeList;
      this.showWindows("编辑项目", JSON.parse(JSON.stringify(row)));
    },
    addDemand() {
      this.programmeList = [];
      this.showWindows("添加项目", {});
    },
    showWindows: function (title, row) {
      console.log(row);
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
    editProgramme(row) {
      this.programmeHasEdit = true;
      row.editable = true;
    },
    saveProgramme(row) {
      console.log(row);
      this.programmeHasEdit = false;
      delete row.editable;
    },
    handleChangeProgrammeName(value, row) {
      row.programmeName = value;
    },
    handleChangeBranchName(value, row) {
      row.branchName = value;
    },
    addProgramme() {
      if (this.programmeHasEdit) {
        return;
      }
      this.programmeHasEdit = true;
      if (!this.programmeList) {
        this.programmeList = [];
      }
      this.programmeList.push({
        id: "",
        editable: true,
        programmeName: "",
        branchName: "",
      });
    },
    deleteProgramme(row) {
      console.log(row);
      var target = this.programmeList.filter((item) => item != row);
      this.programmeList = target;
      this.programmeHasEdit = false;
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