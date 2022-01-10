<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 服务消息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`${appealStatusCount[0].label}(${appealStatusCount[0].total})`" name="first">
                    <el-table :data="unhandleList" :show-header="false" style="width: 100%">
                        <el-table-column :show-overflow-tooltip="true">
                            <template #default="scope">
                                <span class="message-title">{{scope.row.title + scope.row.content}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template #default="scope">
                                <el-button size="small" @click="handleRead(scope.row.appealNo)">查看详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary">全部标为已读</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="`${appealStatusCount[1].label}(${appealStatusCount[1].total})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="state.read" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template #default="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template #default="scope">
                                    <el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">删除全部</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`${appealStatusCount[2].label}(${appealStatusCount[2].total})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="state.recycle" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template #default="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template #default="scope">
                                    <el-button @click="handleRestore(scope.$index)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">清空回收站</el-button>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog title="审核" v-model="appealDetails" width="25%">
            <el-form label-width="27%">
                <el-form-item label="时间">
                    <el-input v-model="appealDetails.date" type="text" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="发起人">
                    <el-input v-model="appealDetails.userName" type="text" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="appealDetails.title" type="textarea" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="appealDetails.content" type="textarea" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import { ref, reactive } from "vue";
    import {ElMessage, ElMessageBox} from "element-plus";
    import axios from "axios";
    export default {
        name: "tabs",
        setup() {
            const message = ref("first");
            const state = reactive({
                unread: [
                    {
                        date: "2018-04-19 20:00:00",
                        title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                    },
                    {
                        date: "2018-04-19 21:00:00",
                        title: "今晚12点整发大红包，先到先得",
                    },
                ],
                read: [
                    {
                        date: "2018-04-19 20:00:00",
                        title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                    },
                ],
                recycle: [
                    {
                        date: "2018-04-19 20:00:00",
                        title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                    },
                ],
            });

            const handleRead = (index) => {
                const item = state.unread.splice(index, 1);
                console.log(item);
                state.read = item.concat(state.read);
            };
            const handleDel = (index) => {
                const item = state.read.splice(index, 1);
                state.recycle = item.concat(state.recycle);
            };
            const handleRestore = (index) => {
                const item = state.recycle.splice(index, 1);
                state.read = item.concat(state.read);
            };

            return {
                message,
                state,
                handleRead,
                handleDel,
                handleRestore,
            };
        },
        data() {
            return {
                appealStatusCount: [{
                    label: "待处理",
                    handelStatus: "0",
                    total: 0
                },{
                    label: "已处理",
                    handelStatus: "1",
                    total: 0
                },{
                    label: "已撤销",
                    handelStatus: "2",
                    total: 0
                }],

                appealDetails: {
                    date: "2018-04-19 20:00:00",
                    userName: "超级管理员",
                    title: "标题",
                    content: "内容adada该系统将于今晚凌晨2点到5点进行升级维护",
                },

                unhandleList: [
                    {
                        appealNo: "001",
                        date: "2018-04-19 20:00:00",
                        title: "【系统通知】",
                        content: "该系统将于今晚凌晨2点到5点进行升级维护",
                    },
                ],
                handledList: [],
                revokedList: [],
            }
        },
        mounted() {
            this.getAppealSum();
        },
        methods: {
            getAppealSum() {
                axios.post('http://localhost:8762/admin/appealManage/sum', {

                },{
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res=>{
                    if (res.data.code != 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    }else {
                        setTimeout(()=>{
                            this.appealStatusCount = res.data.data;
                        }, 0.5 * 1000);
                        console.log(this.appealStatusCount);
                    }
                })
            },
            handleRead(appealNo) {
                console.log(appealNo);
            },
        }
    };
</script>

<style>
    .message-title {
        cursor: pointer;
    }
    .handle-row {
        margin-top: 30px;
    }
</style>

