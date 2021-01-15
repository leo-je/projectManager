import { createRouter, createWebHashHistory } from "vue-router";
import HelloWorld from "./components/HelloWorld";
import SettingProject  from "./view/setting/project";

const routerHistory = createWebHashHistory();

export default createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: HelloWorld
        },
        {
            path: '/setting/project',
            name: 'SettingProject',
            component: SettingProject
        }
    ],
});