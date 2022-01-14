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
                        <el-table-column type="index" width="55"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true">
                            <template #default="scope">
                                <span class="message-title">{{"【"+scope.row.appealTitle+"】" + scope.row.appealContent}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template #default="scope">
                                <el-button size="small" @click="handleRead(scope.$index)">查看详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                                       :current-page="waitHandleQuery.pageIndex"
                                       :page-size="waitHandleQuery.pageSize"
                                       :total="waitHandleQuery.total"
                                       :page-sizes="[10,20,30,50]"
                                       @prev-click="prePage1"
                                       @next-click="nextPage1"
                                       @size-change="sizeChange1"
                                       @current-change="currentPage1"></el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="`${appealStatusCount[1].label}(${appealStatusCount[1].total})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="handledList" :show-header="false" style="width: 100%" v-loading="isLoading">
                            <el-table-column type="index" width="55"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true">
                                <template #default="scope">
                                    <span class="message-title">{{"【"+scope.row.appealTitle+"】" + scope.row.appealContent}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template #default="scope">
                                    <el-button :type="scope.row.auditStatus === '1'?
                                                   'success' : 'info'" @click="handleDel(scope.$index)"
                                               disabled="false">
                                        {{scope.row.auditStatus === '1' ? "通过" : "驳回"}}
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                                           :current-page="handledQuery.pageIndex"
                                           :page-size="handledQuery.pageSize"
                                           :total="handledQuery.total"
                                           :page-sizes="[10,20,30,50]"
                                           @prev-click="prePage2"
                                           @next-click="nextPage2"
                                           @size-change="sizeChange2"
                                           @current-change="currentPage2"></el-pagination>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`${appealStatusCount[2].label}(${appealStatusCount[2].total})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="revokedList" :show-header="false" style="width: 100%" v-loading="isLoading">
                            <el-table-column type="index" width="55"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true">
                                <template #default="scope">
                                    <span class="message-title">{{"【"+scope.row.appealTitle+"】" + scope.row.appealContent}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template #default="scope">
                                    <el-button @click="revokeDetails(scope.$index)">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                                           :current-page="revokedQuery.pageIndex"
                                           :page-size="revokedQuery.pageSize"
                                           :total="revokedQuery.total"
                                           :page-sizes="[10,20,30,50]"
                                           @prev-click="prePage3"
                                           @next-click="nextPage3"
                                           @size-change="sizeChange3"
                                           @current-change="currentPage3"></el-pagination>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog title="审核" v-model="auditDetailVisible" width="25%">
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
                    <el-button type="success"
                               @click="doAudit(appealDetails.appealNo,'1'),visible = false">通 过</el-button>
                    <el-button type="danger" @click="doAudit(appealDetails.appealNo, '2')">驳 回</el-button>
                    <el-button @click="auditDetailVisible = false">取 消</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog title="详情" v-model="detailVisible" width="25%">
            <el-form label-width="27%">
                <el-form-item label="时间">
                    <el-input v-model="appealDetails.createTime" type="text" style="width: 70%"
                              readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="撤销时间">
                    <el-input v-model="appealDetails.revokeTime" type="text" style="width: 70%"
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
        </el-dialog>
    </div>
</template>

<script>
    import {ref, reactive} from "vue";
    import {ElMessage, ElMessageBox} from "element-plus";
    import axios from "axios";

    export default {
        name: "appeals",
        data() {
            return {
                message: ref("first"),
                waitHandleQuery: reactive({
                    pageIndex: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                }),
                handledQuery: reactive({
                    pageIndex: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                }),
                revokedQuery: reactive({
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

                auditDetailVisible: ref(false),
                detailVisible: ref(false),
                appealDetails: {
                    appealNo: "",
                    createTime: "2018-04-19 20:00:00",
                    createUserNo: "201810414427",
                    createUser: "超级管理员",
                    appealTitle: "标题",
                    appealContent: "内容adada该系统将于今晚凌晨2点到5点进行升级维护",
                    revokeTime: "",
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
            //刷新页面
            reload() {
                this.getAppealSum();
                this.getListData();
                this.isLoading = true;
                setTimeout(() => {
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
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
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
                    pageNo: this.waitHandleQuery.pageNo,
                    pageSize: this.waitHandleQuery.pageSize,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        console.log(res.data.data.list);
                        setTimeout(() => {
                            this.unhandleList = res.data.data.list;
                            this.waitHandleQuery.total = res.data.data.total;
                        }, 0.5 * 1000);

                    }
                });

                axios.post('http://localhost:8762/admin/appealManage/list', {
                    appealStatus: "1",
                    pageNo: this.handledQuery.pageNo,
                    pageSize: this.handledQuery.pageSize,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        console.log(res.data.data.list);
                        setTimeout(() => {
                            this.handledList = res.data.data.list;
                            this.handledQuery.total = res.data.data.total;
                        }, 0.5 * 1000);

                    }
                });

                axios.post('http://localhost:8762/admin/appealManage/list', {
                    appealStatus: "2",
                    pageNo: this.revokedQuery.pageNo,
                    pageSize: this.revokedQuery.pageSize,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        console.log(res.data.data.list);
                        setTimeout(() => {
                            this.revokedList = res.data.data.list;
                            this.revokedQuery.total = res.data.data.total;
                        }, 0.5 * 1000);

                    }
                })
            },

            //获取详情
            handleRead(index) {
                console.log(this.appealDetails);
                this.appealDetails = this.unhandleList[index];
                this.auditDetailVisible = true;
            },

            //撤销详情
            revokeDetails(index) {
                console.log(this.appealDetails);
                this.appealDetails = this.revokedList[index];
                this.detailVisible = true;
            },

            //审核
            doAudit(appealNo, auditStatus) {
                console.log(appealNo + "审核" + auditStatus === '1' ? "通过" : "驳回");
                axios.post('http://localhost:8762/admin/appealManage/doAudit', {
                    appealNo: appealNo,
                    auditStatus: auditStatus,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        setTimeout(() => {
                            ElMessage.success(res.data.message);
                            this.auditDetailVisible = false;
                            this.reload();
                        }, 0.5 * 1000);
                        console.log(this.appealStatusCount);
                    }
                });

            },

            //上一页
            prePage1(currentNo) {
                this.waitHandleQuery.pageNo = currentNo;
                this.getListData();
            },

            //下一页
            nextPage1(currentNo) {
                this.waitHandleQuery.pageNo = currentNo;
                this.getListData();
            },

            //pagesize改变
            sizeChange1(size) {
                this.waitHandleQuery.pageSize = size;
                this.getListData();
            },

            //当前页改变
            currentPage1(currentNo) {
                this.waitHandleQuery.pageNo = currentNo;
                this.getListData();
            },

            //上一页
            prePage2(currentNo) {
                this.handledQuery.pageNo = currentNo;
                this.getListData();
            },

            //下一页
            nextPage2(currentNo) {
                this.handledQuery.pageNo = currentNo;
                this.getListData();
            },

            //pagesize改变
            sizeChange2(size) {
                this.handledQuery.pageSize = size;
                this.getListData();
            },

            //当前页改变
            currentPage2(currentNo) {
                this.handledQuery.pageNo = currentNo;
                this.getListData();
            },

            //上一页
            prePage3(currentNo) {
                this.revokedQuery.pageNo = currentNo;
                this.getListData();
            },

            //下一页
            nextPage3(currentNo) {
                this.revokedQuery.pageNo = currentNo;
                this.getListData();
            },

            //pagesize改变
            sizeChange3(size) {
                this.revokedQuery.pageSize = size;
                this.getListData();
            },

            //当前页改变
            currentPage3(currentNo) {
                this.revokedQuery.pageNo = currentNo;
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

