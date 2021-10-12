import { createRouter, createWebHashHistory } from "vue-router";
import HelloWorld from "./components/HelloWorld";
import SettingProject  from "./view/setting/project";
import SettingDemand from "./view/setting/demand";
import SettingProgram from "./view/setting/program"
import SettingRoles from "./view/setting/roles"
import SettingUsers from "./view/setting/users"
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
        },
        {
            path: '/setting/demand',
            name: 'SettingDemand',
            component: SettingDemand
        },
        {
            path: '/setting/program',
            name: 'SettingProgram',
            component: SettingProgram
        },
        {
            path: '/setting/roles',
            name: 'SettingRoles',
            component: SettingRoles
        },
        {
            path: '/setting/users',
            name: 'SettingUsers',
            component: SettingUsers
        }
    ],
});