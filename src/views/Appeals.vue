<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 服务消息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-button icon="el-icon-refresh" type="primary" style="margin-bottom: 5px" @click="reload">刷新</el-button>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`${appealStatusCount[0].label}(${appealStatusCount[0].total})`" name="first">
                    <el-table :data="unhandleList" :show-header="false" style="width: 100%" v-loading="isLoading">
                        <el-table-column :show-overflow-tooltip="true">
                            <template #default="scope">
                                <span class="message-title">{{"【"+scope.row.appealTitle+"】" + scope.row.appealContent}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template #default="scope">
                                <el-button size="small" @click="handleRead(scope.$index)">查看详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :current-page="query.pageIndex"
                                       :page-size="query.pageSize"
                                       :total="query.total"
                                       :page-sizes="[10,20,30,50]"
                                       @prev-click="prePage"
                                       @next-click="nextPage"
                                       @size-change="sizeChange"
                                       @current-change="currentPage"></el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="`${appealStatusCount[1].label}(${appealStatusCount[1].total})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="handledList" :show-header="false" style="width: 100%" v-loading="isLoading">
                            <el-table-column>
                                <template #default="scope">
                                    <span class="message-title">{{"【"+scope.row.appealTitle+"】" + scope.row.appealContent}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template #default="scope">
                                    <el-button :type="scope.row.auditStatus === '1'?
                                                   'success' : 'info'" @click="handleDel(scope.$index)" disabled="false">
                                        {{scope.row.auditStatus === '1' ? "通过" : "驳回"}}
                                    </el-button>
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
                        <el-table :data="state.recycle" :show-header="false" style="width: 100%" v-loading="isLoading">
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
        <el-dialog title="审核" v-model="detailVisible" width="25%">
            <el-form label-width="27%">
                <el-form-item label="时间">
                    <el-input v-model="appealDetails.createTime" type="text" style="width: 70%"
                              readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="发起人">
                    <el-input v-model="appealDetails.createUser" type="text" style="width: 70%"
                              readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="appealDetails.appealTitle" type="textarea" style="width: 70%"
                              readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="appealDetails.appealContent" type="textarea" rows="4" style="width: 70%;"
                              readonly="true"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="success" @click="doAudit(appealDetails.appealNo,'1'),visible = false">通 过</el-button>
                    <el-button type="danger" @click="doAudit(appealDetails.appealNo, '2')">驳 回</el-button>
                    <el-button @click="detailVisible = false">取 消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {ref, reactive} from "vue";
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
                query: reactive({
                    pageIndex: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                }),
                isLoading: false,
                appealStatusCount: [{
                    label: "待处理",
                    handelStatus: "0",
                    total: 0
                }, {
                    label: "已处理",
                    handelStatus: "1",
                    total: 0
                }, {
                    label: "已撤销",
                    handelStatus: "2",
                    total: 0
                }],

                detailVisible: ref(false),
                appealDetails: {
                    appealNo: "",
                    createTime: "2018-04-19 20:00:00",
                    createUserNo: "201810414427",
                    createUser: "超级管理员",
                    appealTitle: "标题",
                    appealContent: "内容adada该系统将于今晚凌晨2点到5点进行升级维护",
                },

                unhandleList: [],
                handledList: [],
                revokedList: [],
            }
        },
        mounted() {
            this.getAppealSum();
            this.getListData();
        },
        methods: {
            reload() {
                this.getAppealSum();
                this.getListData();
                this.isLoading = true;
                setTimeout(()=>{
                    this.isLoading = false;
                }, 0.5 * 1000)
            },

            //获取各状态信息数量
            getAppealSum() {
                axios.post('http://localhost:8762/admin/appealManage/sum', {}, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    if (res.data.code != 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        setTimeout(() => {
                            this.appealStatusCount = res.data.data;
                        }, 0.5 * 1000);
                        console.log(this.appealStatusCount);
                    }
                })
            },

            //获取列表数据
            getListData() {
                axios.post('http://localhost:8762/admin/appealManage/list', {
                    appealStatus: "0",
                    pageNo: this.query.pageNo,
                    pageSize: this.query.pageSize,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    if (res.data.code != 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        console.log(res.data.data.list);
                        setTimeout(() => {
                            this.unhandleList = res.data.data.list;
                        }, 0.5 * 1000);

                    }
                });

                axios.post('http://localhost:8762/admin/appealManage/list', {
                    appealStatus: "1",
                    pageNo: this.query.pageNo,
                    pageSize: this.query.pageSize,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    if (res.data.code != 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        console.log(res.data.data.list);
                        setTimeout(() => {
                            this.handledList = res.data.data.list;
                        }, 0.5 * 1000);

                    }
                });

                axios.post('http://localhost:8762/admin/appealManage/list', {
                    appealStatus: "2",
                    pageNo: this.query.pageNo,
                    pageSize: this.query.pageSize,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    if (res.data.code != 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        console.log(res.data.data.list);
                        setTimeout(() => {
                            this.revokedList = res.data.data.list;
                        }, 0.5 * 1000);

                    }
                })
            },

            //获取详情
            handleRead(index) {
                console.log(this.appealDetails);
                this.appealDetails = this.unhandleList[index];
                this.detailVisible = true;
            },

            //审核
            doAudit(appealNo, auditStatus) {
                console.log(appealNo + "审核" + auditStatus === '1' ? "通过" : "驳回");
                axios.post('http://localhost:8762/admin/appealManage/doAudit', {
                    appealNo: appealNo,
                    auditStatus : auditStatus,
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
                    } else {
                        setTimeout(() => {
                            ElMessage.success(res.data.message);
                            this.detailVisible = false;
                            this.reload();
                        }, 0.5 * 1000);
                        console.log(this.appealStatusCount);
                    }
                });

            },

            //上一页
            prePage(currentNo) {
                this.query.pageNo = currentNo;
                this.getListData();
            },

            //下一页
            nextPage(currentNo) {
                this.query.pageNo = currentNo;
                this.getListData();
            },

            //pagesize改变
            sizeChange(size) {
                this.query.pageSize = size;
                this.getListData();
            },

            //当前页改变
            currentPage(currentNo) {
                this.query.pageNo = currentNo;
                this.getListData();
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

