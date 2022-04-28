<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 学生管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.onlineStatus" placeholder="在线状态" class="handle-select mr10">
                    <el-option key="2" label="全部" value="2"></el-option>
                    <el-option key="1" label="在线" value="1"></el-option>
                    <el-option key="0" label="离线" value="0"></el-option>
                </el-select>
                学号：
                <el-input v-model="query.stuNo" placeholder="学号" class="handle-input mr10"></el-input>
                姓名：
                <el-input v-model="query.stuName" placeholder="姓名" class="handle-input mr10"></el-input>
                寝室：
                <el-input v-model="query.dorNo" placeholder="寝室" class="handle-input mr10"></el-input>
                电话：
                <el-input v-model="query.phone" placeholder="电话" class="handle-input mr10"></el-input>
                <br>
                <el-button type="text" icon="el-icon-printer" class="handle-select mr10" @click="exportStuInfo">导出
                </el-button>
                学院：
                <el-select v-model="query.college" placeholder="学院" class="handle-input mr10">
                    <el-option
                            v-for="item in colleges"
                            :key="item.code"
                            :label="item.value"
                            :value="item.value">
                    </el-option>
                </el-select>
                专业：
                <el-select v-model="query.discipline" placeholder="专业" class="handle-input mr10">
                    <el-option
                            v-for="item in disciplines"
                            :key="item.code"
                            :label="item.value"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="getTableData" class="reset">搜索</el-button>
                <el-button type="primary" icon="el-icon-search" @click="resetTableData" class="reset">重置</el-button>
            </div>
            <el-table :data="list" v-loading="isLoading" class="table" ref="multipleTable"
                      header-cell-class-name="table-header">
                <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
                <el-table-column prop="userNo" label="学号" align="center"></el-table-column>
                <el-table-column prop="realName" label="姓名" align="center"></el-table-column>
                <el-table-column prop="dorNo" label="寝室" align="center"></el-table-column>
                <el-table-column prop="phone" label="电话" align="center"></el-table-column>
                <el-table-column prop="college" label="学院" align="center"></el-table-column>
                <el-table-column prop="discipline" label="专业" align="center"></el-table-column>
                <el-table-column prop="onlineStatus" label="状态" align="center">
                    <template #default="scope">
                        <el-tag :type="
                                scope.row.onlineStatus === '1'
                                    ? 'success'
                                    : 'info'
                            " style="margin-right: 15px">{{ scope.row.onlineStatus === '1' ? "在线" : "离线"}}
                        </el-tag>
                        <el-button type="text" style="color: red" @click="offline(scope.row.userNo)">{{
                            scope.row.onlineStatus === '1' ? "下线" : ""}}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row.userNo)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="deleteStu(scope.row.userNo)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                               :current-page="query.pageIndex"
                               :page-size="query.pageSize"
                               :total="query.total"
                               :page-sizes="[10,20,30,50]"
                               @prev-click="prePage"
                               @next-click="nextPage"
                               @size-change="sizeChange"
                               @current-change="currentPage"></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="25%">
            <el-form label-width="27%">
                <el-form-item label="学院">
                    <el-input v-model="editInfo.college" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="专业">
                    <el-input v-model="editInfo.discipline" style="width: 70%"></el-input>
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
    import {ref, reactive} from "vue";
    import {ElMessage, ElMessageBox} from "element-plus";
    import axios from "axios";

    export default {
        name: "stuManage",
        data() {
            return {
                colleges: null,
                disciplines: null,
                //学生查询参数
                query: reactive({
                    pageIndex: 1,
                    onlineStatus: null,
                    stuNo: "",
                    dorNo: "",
                    stuName: "",
                    phone: "",
                    college: "",
                    discipline: "",
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                }),
                isLoading: false,
                //列表数据
                list: null,
                editVisible: ref(false),
                //编辑参数
                editInfo: reactive({
                    stuNo: "",
                    college: "",
                    discipline: "",
                }),
            }
        },
        mounted() {
            this.getTableData();
            this.getColleges();
            this.getDiscipline();

        },
        methods: {
            //获取学院
            getColleges() {
                this.colleges = JSON.parse(sessionStorage.getItem("dicts")).college;
            },
            //获取专业
            getDiscipline() {
                this.disciplines = JSON.parse(sessionStorage.getItem("dicts")).discipline;
            },
            //获取表格信息
            getTableData() {
                this.isLoading = true;
                axios.post('http://localhost:8762/admin/userManage/queryStuInfo', {
                    onlineStatus: this.query.onlineStatus === '2' ? null : this.query.onlineStatus,
                    stuName: this.query.stuName,
                    stuNo: this.query.stuNo,
                    dorNo: this.query.dorNo,
                    phone: this.query.phone,
                    college: this.query.college,
                    discipline: this.query.discipline,
                    pageNo: this.query.pageNo,
                    pageSize: this.query.pageSize,
                }, {
                    headers: {
                        authorization: sessionStorage.getItem("token")
                    }
                }).then(res => {
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
                        }else if(res.data.code === 403){
                            ElMessage.error(res.data.message);
                            this.$router.replace("/403");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        this.list = res.data.data.list;
                        this.query.total = res.data.data.total;
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 0.5 * 1000);
                    }
                })
            },

            //重置查询
            resetTableData() {
                this.query = reactive({
                    pageIndex: 1,
                    onlineStatus: null,
                    stuNo: "",
                    stuName: "",
                    phone: "",
                    college: "",
                    discipline: "",
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                });
                this.getTableData();
            },

            //上一页
            prePage(currentNo) {
                this.query.pageNo = currentNo;
                this.getTableData();
            },

            //下一页
            nextPage(currentNo) {
                this.query.pageNo = currentNo;
                this.getTableData();
            },

            //pagesize改变
            sizeChange(size) {
                this.query.pageSize = size;
                this.getTableData();
            },

            //当前页改变
            currentPage(currentNo) {
                this.query.pageNo = currentNo;
                this.getTableData();
            },

            //学生下线
            offline(stuNo) {
                console.log("学生下线：" + stuNo);
                axios.post('http://localhost:8762/admin/userManage/updateStuInfo', {
                    userNo: stuNo,
                    onlineStatus: "0",
                    loginFlag: "1",
                }, {
                    headers: {
                        authorization: sessionStorage.getItem("token")
                    }
                }).then(res => {
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
                        }else if(res.data.code === 403){
                            ElMessage.error(res.data.message);
                            this.$router.replace("/403");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        this.query.isLoading = true;
                        this.getTableData();
                        ElMessage.success(res.data.message);
                        setTimeout(() => {
                            this.query.isLoading = false;
                        }, 0.5 * 1000);
                    }
                })
            },

            //删除学生信息
            deleteStu(stuNo) {
                // 二次确认删除
                ElMessageBox.confirm("确定要删除吗？", "提示", {
                    type: "warning",
                }).then(() => {
                    console.log("删除学生" + stuNo);
                    axios.post('http://localhost:8762/admin/userManage/delStuInfo', {
                        stuNo: stuNo,
                    }, {
                        headers: {
                            authorization: sessionStorage.getItem("token")
                        }
                    }).then(res => {
                        if (res.data.code !== 1000) {
                            if (res.data.code === 999) {
                                ElMessage.error(res.data.message);
                                this.$router.push("/login");
                            }else if(res.data.code === 403){
                                ElMessage.error(res.data.message);
                                this.$router.replace("/403");
                            }
                            ElMessage.error(res.data.message);
                            return false;
                        } else {
                            this.query.isLoading = true;
                            this.getTableData();
                            setTimeout(() => {
                                this.query.isLoading = false;
                            }, 0.5 * 1000);
                        }
                    });
                    ElMessage.success("删除成功");
                    this.getTableData();
                })
                    .catch((error) => {
                    });
            },

            //编辑信息
            handleEdit(stuNo) {
                this.editInfo.stuNo = stuNo;
                this.editVisible = true;
            },

            //保存编辑信息
            saveEdit() {
                console.log("编辑信息：");
                axios.post('http://localhost:8762/admin/userManage/updateStuInfo', {
                    userNo: this.editInfo.stuNo,
                    college: this.editInfo.college,
                    discipline: this.editInfo.discipline,
                }, {
                    headers: {
                        authorization: sessionStorage.getItem("token")
                    }
                }).then(res => {
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
                        }else if(res.data.code === 403){
                            ElMessage.error(res.data.message);
                            this.$router.replace("/403");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        this.query.isLoading = true;
                        this.getTableData();
                        ElMessage.success(res.data.message);
                        setTimeout(() => {
                            this.query.isLoading = false;
                        }, 0.5 * 1000);
                    }
                });
                this.editVisible = false;
            },

            //导出excel
            exportStuInfo() {
                axios.post('http://localhost:8762/admin/userManage/exportStuInfo', {
                    onlineStatus: this.query.onlineStatus === '2' ? null : this.query.onlineStatus,
                    stuName: this.query.stuName,
                    stuNo: this.query.stuNo,
                    phone: this.query.phone,
                    college: this.query.college,
                    discipline: this.query.discipline,
                    pageNo: this.query.pageNo,
                    pageSize: this.query.pageSize,
                }, {
                    headers: {
                        authorization: sessionStorage.getItem("token"),
                    },
                    responseType: 'arraybuffer'
                }).then(res => {
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
                        }else if(res.data.code === 403){
                            ElMessage.error(res.data.message);
                            this.$router.replace("/403");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    }else {
                        // 利用a标签自定义下载文件名
                        const link = document.createElement('a');
                        // 创建Blob对象，设置文件类型
                        let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
                        let objectUrl = URL.createObjectURL(blob); // 创建URL
                        link.href = objectUrl;
                        let date = new Date();
                        let year = date.getUTCFullYear();
                        let month = date.getUTCMonth() + 1;
                        let day = date.getUTCDate();
                        link.download = year + "-" + month + "-" + day + "导出学生信息.xlsx"; //自定义文件名
                        link.click(); // 下载文件
                        URL.revokeObjectURL(objectUrl); // 释放内存
                    }
                })
            }


        },
    };

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 14%;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 30px;
        margin-bottom: 10px;
    }

    .reset {
        margin-left: 58px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
