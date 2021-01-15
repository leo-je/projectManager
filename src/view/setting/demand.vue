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
        v-model:visible="addEditVisible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
      >
        <a-form :model="demand" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="项目名称" has-feedback>
            <a-select
              v-model:value="demand.projectName"
              placeholder="Please select a country"
            >
              <a-select-option value="china"> China </a-select-option>
              <a-select-option value="usa"> U.S.A </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="需求名称">
            <a-input
              placeholder="请输入项目名称"
              v-model:value="demand.demandName"
            />
          </a-form-item>

          <a-form-item label="计划开始时间">
            <a-date-picker show-time placeholder="选择时间" />
          </a-form-item>
          <a-form-item label="计划上线时间">
            <a-date-picker show-time placeholder="选择时间" />
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
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    projectName: "xxx项目",
    demandName: "xx2优化",
    status: "未开始",
    demandInfo: "￥1,256,000.00",
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    projectName: "xxx项目",
    demandName: "Joe Black",
    status: "未开始",
    demandInfo: "￥120,000.00",
    address: "Sidney No. 1 Lake Park",
  },
];

export default {
  name: "SettingDemand",
  data() {
    return {
      wtitle: "添加",
      data,
      columns,
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
      this.showWindows("编辑项目", JSON.parse(JSON.stringify(row)));
    },
    addProjet() {
      this.showWindows("添加项目", {});
    },
    showWindows: function (title, row) {
      console.log(row);
      this.demand = row;
      this.wtitle = "添加项目";
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