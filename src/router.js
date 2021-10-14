import { createRouter, createWebHashHistory } from "vue-router";
import dashboard from './view/dashboard'
import HelloWorld from "./components/HelloWorld";
import SettingProject  from "./view/setting/project";
import SettingDemand from "./view/setting/demand";
import SettingProgram from "./view/setting/program"
import SettingRoles from "./view/setting/roles"
import SettingUsers from "./view/setting/users"
import SettingGroups from "./view/setting/groups"
const routerHistory = createWebHashHistory();

export default createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: dashboard,
            children:[
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
                },
                {
                    path: '/setting/groups',
                    name: 'SettingGroups',
                    component: SettingGroups
                }
            ]
        },{
            path: '/401',
            name: 'noAuth',
            component: HelloWorld,
        }
    ],
});