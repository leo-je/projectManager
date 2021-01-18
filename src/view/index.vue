<template>
  <a-layout id="components-layout-demo-top-side">
    <a-layout-header class="header">
      <div class="logo" />
      <!-- <a-menu
        theme="dark"
        mode="horizontal"
        v-model:selectedKeys="selectedKeys1"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">
          nav 1
        </a-menu-item>
        <a-menu-item key="2">
          nav 2
        </a-menu-item>
        <a-menu-item key="3">
          nav 3
        </a-menu-item>
      </a-menu> -->
    </a-layout-header>
    <a-layout-content style="padding: 0 0px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-sider width="200" style="background: #fff">
          <a-menu
            mode="inline"
            v-model:selectedKeys="selectedKeys2"
            v-model:openKeys="openKeys"
            style="height: 100%"
          >
            <a-sub-menu key="sub1">
              <template #title>
                <span><user-outlined />菜单</span>
              </template>
              <a-menu-item key="1" @click="to('/setting/demand')"
                >需求管理</a-menu-item
              >
              <a-menu-item key="2" @click="to('/setting/project')"
                >项目维护</a-menu-item
              >
              <a-menu-item key="3" @click="to('/setting/proggram')"
                >工程维护</a-menu-item
              >
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '0 24px', minHeight: '630px' }">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>

<script>
import { UserOutlined } from "@ant-design/icons-vue";

export default {
  data() {
    return {
      selectedKeys1: ["2"],
      selectedKeys2: ["1"],
      openKeys: ["sub1"],
    };
  },
  components: {
    UserOutlined,
  },
  methods: {
    to(path) {
      this.$router.push({ path });
    },
  },
  beforeCreate() {
    this.$router.push({ path: "/setting/demand" });
  },
};
</script>

<style>
#components-layout-demo-top-side .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 28px 16px 0;
  float: left;
}
</style>