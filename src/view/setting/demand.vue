<template>
  <section>
    <div class="add-button">
      <a-config-provider :auto-insert-space-in-button="false">
        <a-button type="primary" @click="addProjet"> 添加 </a-button>
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
          <a class="onSelect" @click="deleteProject(record.id)">上升+1</a>
          <a-divider type="vertical" />
          <a class="onSelect" @click="deleteProject(record.id)">下降-1</a>
          <a-divider type="vertical" />
          <a class="onSelect" @click="editProject(record)">编辑</a>
          <a-divider type="vertical" />
          <a class="onSelect" @click="deleteProject(record.id)">删除</a>
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
                  v-model:value="demand.projectName"
                  placeholder="Please select a country"
                >
                  <a-select-option value="china"> China </a-select-option>
                  <a-select-option value="usa"> U.S.A </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="需求名称">
                <a-input
                  placeholder="请输入项目名称"
                  v-model:value="demand.demandName"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="计划开始时间">
                <a-date-picker show-time placeholder="选择时间" /> </a-form-item
            ></a-col>
            <a-col :span="12">
              <a-form-item label="计划上线时间">
                <a-date-picker show-time placeholder="选择时间" />
              </a-form-item>
            </a-col>
          </a-row>
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
              v-model:value="demand.demandInfo"
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
// 表头配置
const columns = [
  {
    title: "项目名称",
    dataIndex: "projectName",
    slots: { customRender: "name" },
  },
  {
    title: "需求名称",
    dataIndex: "demandName",
    slots: { customRender: "name" },
  },
  {
    title: "需求信息",
    //className: "column-projetInfo",
    dataIndex: "demandInfo",
    slots: { customRender: "demandInfo" },
  },
  {
    title: "计划完成时间",
    //className: "column-projetInfo",
    dataIndex: "demandInfo",
    slots: { customRender: "demandInfo" },
  },
  {
    title: "计划上线时间",
    //className: "column-projetInfo",
    dataIndex: "demandInfo",
    slots: { customRender: "demandInfo" },
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

const data = [
  {
    id: "idid",
    key: "1",
    projectName: "xxx项目",
    demandName: "xxx优化",
    status: "未开始",
    demandInfo: "￥300,000.00",
    programmeList: [
      {
        key: "1",
        programmeName: "cloud-office-busi-finance",
        branchName: "fix/5056",
      },
      {
        key: "2",
        programmeName: "cloud-office-busi-hr",
        branchName: "fix/5056",
      },
    ],
    address: "New York No. 1 Lake Park",
  },
  {
    id: "2",
    projectName: "xxx项目",
    demandName: "xx2优化",
    status: "未开始",
    demandInfo: "￥1,256,000.00",
    address: "London No. 1 Lake Park",
  },
  {
    id: "3",
    projectName: "xxx项目",
    demandName: "Joe Black",
    status: "未开始",
    demandInfo: "￥120,000.00",
    address: "Sidney No. 1 Lake Park",
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
      data,
      columns,
      programmeColumns,
      programmeList,
      programmeHasEdit: false,
      addEditVisible: false,
      confirmLoading: false,
      demand: {
        id: "",
        projectName: "",
        projectId: "",
        demandName: "",
        demandInfo: "",
      },
    };
  },
  methods: {
    deleteProject: function (id) {
      console.log(id);
    },
    editProject: function (row) {
      console.log(this.programmeHasEdit);
      this.programmeList = row.programmeList;
      this.showWindows("编辑项目", JSON.parse(JSON.stringify(row)));
    },
    addProjet() {
      this.programmeList = [];
      this.showWindows("添加项目", {});
    },
    showWindows: function (title, row) {
      console.log(row);
      this.demand = row;
      this.wtitle = title;
      this.addEditVisible = true;
    },
    handleOk() {
      console.log(this.demand);
      this.confirmLoading = true;
      setTimeout(() => {
        this.addEditVisible = false;
        this.confirmLoading = false;
      }, 2000);
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