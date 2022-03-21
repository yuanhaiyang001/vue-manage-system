<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 寝室管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.isUse" placeholder="使用状态" class="handle-select mr10">
                    <el-option key="2" label="全部" value="2"></el-option>
                    <el-option key="1" label="启用" value="1"></el-option>
                    <el-option key="0" label="禁用" value="0"></el-option>
                </el-select>
                编号：
                <el-input v-model="query.dorNo" placeholder="寝室号" class="handle-input mr10"></el-input>
                类型：
                <el-select v-model="query.dorType" placeholder="类型" class="handle-select mr10">
                    <el-option key="99" label="全部" value="99"></el-option>
                    <el-option key="2" label="2人间" value="2"></el-option>
                    <el-option key="4" label="4人间" value="4"></el-option>
                    <el-option key="6" label="6人间" value="6"></el-option>
                </el-select>
                学生：
                <el-input v-model="query.stuName" placeholder="学生姓名" class="handle-input mr10"></el-input>
                学号：
                <el-input v-model="query.stuNo" placeholder="学号" class="handle-input mr10"></el-input>
                <br/>
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

                <el-button type="primary" icon="el-icon-search" @click="getTableData" class="reset">搜索</el-button>
                <el-button type="primary" icon="el-icon-search" @click="resetTableData" class="reset">重置</el-button>
            </div>
            <el-table :data="list" v-loading="isLoading" class="table" ref="multipleTable"
                      header-cell-class-name="table-header">
                <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
                <el-table-column prop="college" label="学院" align="center"></el-table-column>
                <el-table-column prop="dorNo" label="寝室号" align="center"></el-table-column>
                <el-table-column prop="dorType" label="类型" align="center"></el-table-column>
                <el-table-column prop="traceWaterFee" label="水费余额" align="center"></el-table-column>
                <el-table-column prop="traceElectricityFee" label="电费余额" align="center"></el-table-column>
                <el-table-column prop="peopleTotal" label="入住人数" align="center"></el-table-column>
                <el-table-column prop="stus" label="学生" align="center"></el-table-column>
                <el-table-column prop="stuNos" label="学号" align="center"></el-table-column>
                <el-table-column prop="isUse" label="状态" align="center">
                    <template #default="scope">
                        <el-tag :type="
                                scope.row.isUse === '1'
                                    ? 'success'
                                    : 'info'
                            " style="margin-right: 15px">{{ scope.row.isUse === '1' ? "已启用" : "已禁用"}}
                        </el-tag>
                        <el-button type="text" style="color: red"
                                   @click="setUseStatus(scope.row.dorNo, scope.row.isUse)">{{
                            scope.row.isUse === '1' ? "禁用" : "启用"}}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit"
                                   @click="handleEdit(scope.row.dorNo, scope.row.dorType, scope.row.peopleTotal)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="deleteDor(scope.row.dorNo)">删除
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
                <el-form-item label="编号">
                    <span>{{editInfo.dorNo}}</span>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="editInfo.dorType" placeholder="类型">
                        <el-option key="2" label="2人间" value="2"></el-option>
                        <el-option key="4" label="4人间" value="4"></el-option>
                        <el-option key="6" label="6人间" value="6"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入住人数">
                    <el-input v-model="editInfo.peopleTotal" style="width: 70%"></el-input>
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
        name: "dorManage",
        data() {
            return {
                colleges: null,
                //寝室查询参数
                query: reactive({
                    isUse: null,
                    dorType: null,
                    pageIndex: 1,
                    stuNo: "",
                    dorNo: "",
                    stuName: "",
                    college: "",
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
                    dorNo: "",
                    dorType: "",
                    peopleTotal: "",
                }),
            }
        },
        mounted() {
            this.getColleges();
            this.getTableData();
        },
        methods: {
            //获取学院
            getColleges() {
                this.colleges = JSON.parse(sessionStorage.getItem("dicts")).college;
            },
            //获取表格信息
            getTableData() {
                this.isLoading = true;
                axios.post('http://localhost:8762/admin/dorManage/queryDorInfo', {
                    isUse: this.query.isUse === '2' ? null : this.query.isUse,
                    dorType: this.query.dorType === '99' ? null : this.query.dorType,
                    stuName: this.query.stuName,
                    stuNo: this.query.stuNo,
                    dorNo: this.query.dorNo,
                    college: this.query.college,
                    pageNo: this.query.pageNo,
                    pageSize: this.query.pageSize,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    console.log(res.data);
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
                    isUse: null,
                    dorType: null,
                    pageIndex: 1,
                    stuNo: "",
                    dorNo: "",
                    stuName: "",
                    college: "",
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

            //启用/禁用
            setUseStatus(dorNo, isUse) {
                console.log("寝室启用/禁用：" + dorNo);
                axios.post('http://localhost:8762/admin/dorManage/updateDorInfo', {
                    dorNo: dorNo,
                    isUse: isUse === '0' ? '1' : '0'
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
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

            //删除寝室信息
            deleteDor(dorNo) {
                // 二次确认删除
                ElMessageBox.confirm("确定要删除吗？", "提示", {
                    type: "warning",
                }).then(() => {
                    console.log("删除寝室" + dorNo);
                    axios.post('http://localhost:8762/admin/dorManage/delDorInfo', {
                        dorNo: dorNo,
                    }, {
                        headers: {
                            authorization: localStorage.getItem("token")
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
            handleEdit(dorNo, dorType, peopleTotal) {
                this.editInfo.dorNo = dorNo;
                this.editInfo.dorType = dorType;
                this.editInfo.peopleTotal = peopleTotal;
                this.editVisible = true;
            },

            //保存编辑信息
            saveEdit() {
                console.log(this.editInfo.peopleTotal);
                if (this.editInfo.dorNo === null || this.editInfo.dorNo === ""
                    || this.editInfo.peopleTotal === null || this.editInfo.peopleTotal === "") {
                    ElMessage.error("请填写必填参数")
                    return false;
                }
                axios.post('http://localhost:8762/admin/dorManage/updateDorInfo', {
                    dorNo: this.editInfo.dorNo,
                    dorType: this.editInfo.dorType,
                    peopleTotal: this.editInfo.peopleTotal,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
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
                axios.post('http://localhost:8762/admin/dorManage/exportDorInfo', {
                    isUse: this.query.isUse === '2' ? null : this.query.isUse,
                    dorType: this.query.dorType === '99' ? null : this.query.dorType,
                    stuName: this.query.stuName,
                    stuNo: this.query.stuNo,
                    dorNo: this.query.dorNo,
                    college: this.query.college,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token"),
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
                    } else {
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
                        link.download = year + "-" + month + "-" + day + "导出寝室信息.xlsx"; //自定义文件名
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
        width: 15%;
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
</style>
