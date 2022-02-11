import {createRouter, createWebHashHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/login'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            },
            {
                path: "/stuManage",
                name: "stuManage",
                meta: {
                    title: '学生列表'
                },
                component: () => import("../views/StuManage.vue")
            }, {
                path: "/importStu",
                name: "importStu",
                meta: {
                    title: '导入学生信息'
                },
                component: () => import("../views/ImportStu.vue")
            },
            {
                path: "/dorManage",
                name: "dorManage",
                meta: {
                    title: '寝室列表'
                },
                component: () => import("../views/DorManage.vue")
            }, {
                path: "/importDor",
                name: "importDor",
                meta: {
                    title: '导入寝室信息'
                },
                component: () => import("../views/ImportDor.vue")
            },
            {
                path: "/myService",
                name: "myService",
                meta: {
                    title: '我的服务'
                },
                component: () => import("../views/MyService.vue")
            },
            {
                path: "/myOrders",
                name: "myOrders",
                meta: {
                    title: '我的订单'
                },
                component: () => import("../views/MyOrders.vue")
            },
            {
                path: "/appeals",
                name: "appeals",
                meta: {
                    title: '服务信息'
                },
                component: () => import("../views/Appeals.vue")
            },
            {
                path: "/sysSetting",
                name: "sysSetting",
                meta: {
                    title: '系统设置'
                },
                component: () => import("../views/SysSetting.vue")
            },
            {
                path: "/addDict",
                name: "addDict",
                meta: {
                    title: '添加数据字典'
                },
                component: () => import("../views/AddDict.vue")
            },
            {
                path: "/dictList",
                name: "dictList",
                meta: {
                    title: '数据字典'
                },
                component: () => import("../views/DictList.vue")
            },
            {
                path: "/charts",
                name: "basecharts",
                meta: {
                    title: '图表'
                },
                component: () => import ( /* webpackChunkName: "charts" */ "../views/BaseCharts.vue")
            }, {
                path: "/form",
                name: "baseform",
                meta: {
                    title: '表单'
                },
                component: () => import ( /* webpackChunkName: "form" */ "../views/BaseForm.vue")
            }, {
                path: "/permission",
                name: "permission",
                meta: {
                    title: '权限管理',
                    permission: true
                },
                component: () => import ( /* webpackChunkName: "permission" */ "../views/Permission.vue")
            }, {
                path: "/i18n",
                name: "i18n",
                meta: {
                    title: '国际化语言'
                },
                component: () => import ( /* webpackChunkName: "i18n" */ "../views/I18n.vue")
            }, {
                path: "/upload",
                name: "upload",
                meta: {
                    title: '上传插件'
                },
                component: () => import ( /* webpackChunkName: "upload" */ "../views/Upload.vue")
            }, {
                path: "/icon",
                name: "icon",
                meta: {
                    title: '自定义图标'
                },
                component: () => import ( /* webpackChunkName: "icon" */ "../views/Icon.vue")
            }, {
                path: '/404',
                name: '404',
                meta: {
                    title: '找不到页面'
                },
                component: () => import (/* webpackChunkName: "404" */ '../views/404.vue')
            }, {
                path: '/403',
                name: '403',
                meta: {
                    title: '没有权限'
                },
                component: () => import (/* webpackChunkName: "403" */ '../views/403.vue')
            }, {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心'
                },
                component: () => import (/* webpackChunkName: "user" */ '../views/User.vue')
            }, {
                path: '/editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器'
                },
                component: () => import (/* webpackChunkName: "editor" */ '../views/Editor.vue')
            }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;
