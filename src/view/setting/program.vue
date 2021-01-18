<template>
  <section>
    <div class="add-button">
      <a-config-provider :auto-insert-space-in-button="false">
        <a-button type="primary" @click="addProjet"> 添加 </a-button>
      </a-config-provider>
    </div>
    <a-table :columns="columns" :data-source="data" bordered>
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #action="{ text: record }">
        <span>
          <a-divider type="vertical" />
          <a class="onSelect" @click="deleteProject(record.id)">删除</a>
          <a-divider type="vertical" />
          <a class="onSelect" @click="editProject(record)">编辑</a>
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
        <a-form
          :model="project"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item label="项目名称" has-feedback>
                <a-select
                  v-model:value="program.projectId"
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
                    <a-form-item label="工程名称">
            <a-input
              placeholder="请输入项目名称"
              v-model:value="program.name"
            />
          </a-form-item>
          <a-form-item label=" 工程信息">
            <a-textarea
              style="min-width: 400px"
              v-model:value="program.info"
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

// 表头配置
const columns = [
  {
    title: "项目名称",
    dataIndex: "projectName",
    slots: { customRender: "projectName" },
  },
  {
    title: "工程名称",
    //className: "column-projetInfo",
    dataIndex: "name",
    slots: { customRender: "name" },
  },
    {
    title: "工程信息",
    //className: "column-projetInfo",
    dataIndex: "info",
    slots: { customRender: "info" },
  },
  //   {
  //     title: "Address",
  //     dataIndex: "address",
  //   },
  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" },
  },
];

const data = [
  {
    id: "idid",
    name: "John Brown",
    projectName: "ERP系统",
    projectId: "899",
    info: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    projetInfo: "￥1,256,000.00",
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    projetInfo: "￥120,000.00",
    address: "Sidney No. 1 Lake Park",
  },
];

export default {
  name: "SettingProject",
  data() {
    return {
      wtitle: "添加",
      data,
      columns,
      projects: [],
      addEditVisible: false,
      confirmLoading: false,
      program: {
        id: "",
        name: "",
        info: "",
      },
    };
  },
  mounted() {
    //this.getList();
  },
  methods: {
    getList() {
      var _this = this;
      http("post", "./pm/busi/project/list")
        .then(function (data) {
          console.log(data);
          if (data != null && data.length > 0) {
            _this.data = data;
          }
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    deleteProject: function (id) {
      var _this = this;
      http("get", "./pm/busi/project/delete", { id: id })
        .then(function (data) {
          console.log(data);
          _this.getList();
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    editProject: function (row) {
      this.showWindows("编辑项目", JSON.parse(JSON.stringify(row)));
    },
    addProjet() {
      this.showWindows("添加项目", {});
    },
    showWindows: function (title, row) {
      console.log(row);
      this.program = row;
      this.wtitle = "添加项目";
      this.addEditVisible = true;
    },
    handleOk() {
      console.log(this.project);
      this.confirmLoading = true;
      var _this = this;
      http("post", "./pm/busi/project/add", this.project)
        .then(function (data) {
          console.log(data);
          _this.addEditVisible = false;
          _this.getList();
        })
        .catch(function (e) {
          console.error(e);
          _this.confirmLoading = false;
        });
      // setTimeout(() => {
      //   this.addEditVisible = false;
      //   this.confirmLoading = false;
      // }, 2000);
    },
  },
};
</script>
<style>
.add-button {
  text-align: right;
  margin-bottom: 10px;
}
.onSelect {
  -moz-user-select: -moz-none;
  user-select: none;
}
</style>