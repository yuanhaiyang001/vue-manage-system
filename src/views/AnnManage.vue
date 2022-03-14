<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 公告管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select style="margin-left: 100px" v-model="query.expiredFlag" placeholder="过期状态"
                           class="handle-select mr10">
                    <el-option key="2" label="全部" value="2"></el-option>
                    <el-option key="1" label="未过期" value="0"></el-option>
                    <el-option key="0" label="已过期" value="1"></el-option>
                </el-select>
                编号：
                <el-input v-model="query.annNo" placeholder="请输入公告编号" class="handle-input mr10"></el-input>
                标题：
                <el-input v-model="query.annTitle" placeholder="请输入标题" class="handle-input mr10"></el-input>
                摘要：
                <el-input v-model="query.summary" placeholder="请输入摘要" class="handle-input mr10"></el-input>
                <br>
                <div style="margin-left: 100px;margin-right: 200px">发布时间：
                    <el-date-picker
                            v-model="queryExpiredTime"
                            value-format="YYYY-MM-DD"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>

                    <el-button type="primary" icon="el-icon-search" @click="getTableData" class="reset">搜索</el-button>
                    <el-button type="primary" icon="el-icon-search" @click="resetTableData" class="reset">重置</el-button>
                    <el-button type="text" icon="el-icon-lx-add" class="red insert" @click="addVisible = true">发布公告
                    </el-button>
                </div>
            </div>
            <el-table :data="list" v-loading="isLoading" class="table" ref="multipleTable"
                      header-cell-class-name="table-header">
                <el-table-column label="序号" type="index" width="55"></el-table-column>
                <el-table-column width="170%" prop="annNo" label="公告编号"></el-table-column>
                <el-table-column width="200%" prop="annTitle" label="公告标题"></el-table-column>
                <el-table-column width="280%" prop="annContent" label="内容"></el-table-column>
                <el-table-column width="170%" prop="createTime" label="发布时间"></el-table-column>
                <el-table-column width="170%" prop="expiredTime" label="过期时间"></el-table-column>
                <el-table-column width="100%" prop="serviceStatus" label="状态" align="center">
                    <template #default="scope">
                        <el-tag :type="
                                scope.row.expiredFlag === '0'
                                    ? 'success'
                                    : 'info'
                            ">{{ scope.row.expiredFlag === '1' ? "已过期" : "未过期"}}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="90" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="delAnn(scope.row.id)">删除
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
        <!-- 添加弹出框 -->
        <el-dialog title="添加" v-model="addVisible" width="30%">
            <el-form label-width="30%" :model="ann" :rules="rules" ref="formRef">
                <el-form-item label="标题：" prop="annTitle">
                    <el-input v-model="ann.annTitle" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="摘要：" prop="summary">
                    <el-input type="textarea" rows="4" v-model="ann.summary"
                              style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="内容：" clearable prop="annContent">
                    <el-input type="textarea" rows="6" v-model="ann.annContent"
                              style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="摘要：">
                    <el-date-picker
                            ref="datePick"
                            v-model="addExpiredTime"
                            type="date"
                            value-format="YYYY-MM-DD"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addAnn">发 布</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {ElMessage, ElMessageBox} from "element-plus";
    import axios from "axios";
    import {reactive, ref} from "vue";

    export default {
        name: "AnnManage",
        data() {
            return {
                valid: false,
                addExpiredTime:[],
                rules: {
                    annTitle: [
                        {required: true, message: '请输入公告标题', trigger: 'blur'},
                        {min: 2, message: '长度最短为2个字符', trigger: 'blur'},
                        {max: 10, message: '长度最长为10个字符', trigger: 'blur'}
                    ],
                    summary: [
                        {required: true, message: '请输入摘要', trigger: 'blur'},
                        {min: 10, message: '长度最短为10个字符', trigger: 'blur'},
                        {max: 50, message: '长度最长为50个字符', trigger: 'blur'}
                    ],
                    annContent: [
                        {required: true, message: '请输入内容', trigger: 'blur'},
                        {min: 20, message: '长度最短为20个字符', trigger: 'blur'},
                        {max: 100, message: '长度最长为100个字符', trigger: 'blur'}
                    ]
                },
                isLoading: false,
                addVisible: false,
                queryExpiredTime: [],
                query: {
                    annNo: "",
                    annTitle: "",
                    summary: "",
                    createTimeStart: "",
                    createTimeEnd: "",
                    expiredFlag: "",
                    pageIndex: "1",
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                },
                list: [],
                ann:{
                    annTitle:"",
                    summary:"",
                    annContent:"",
                    expiredTime:""
                }
            }
        },
        mounted() {
            this.getTableData();
        },
        methods: {
            //获取表格信息
            getTableData() {
                // console.log(this.value1[0]);
                this.isLoading = true;
                axios.post('http://localhost:8762/admin/annManage/annList', {
                    annNo: this.query.annNo,
                    annTitle: this.query.annTitle,
                    summary: this.query.summary,
                    expiredFlag: this.query.expiredFlag === '2' ? null : this.query.expiredFlag,
                    createTimeStart: this.queryExpiredTime[0],
                    createTimeEnd: this.queryExpiredTime[1],
                    pageNo: this.query.pageNo,
                    pageSize: this.query.pageSize,
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
                this.query.annNo = '';
                this.query.annTitle = '';
                this.query.summary = '';
                this.query.expiredFlag = null;
                this.queryExpiredTime = [];
                this.query.pageIndex = 1;
                this.query.pageNo = 1;
                this.query.pageSize = 10;
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

            //删除寝室信息
            delAnn(id) {
                // 二次确认删除
                ElMessageBox.confirm("确定要删除吗？", "提示", {
                    type: "warning",
                }).then(() => {
                    axios.post('http://localhost:8762/admin/annManage/delAnn', {
                        id: id,
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
                            this.query.isLoading = true;
                            ElMessage.success("删除成功");
                            this.getTableData();
                            setTimeout(() => {
                                this.query.isLoading = false;
                            }, 0.5 * 1000);
                        }
                    });
                    this.getTableData();
                })
                    .catch((error) => {
                        ElMessageBox.alert("删除失败" + error)
                    });
            },
            addCheck(formName) {
                this.$refs[formName].validate((valid) => {
                    this.valid = valid;
                });
            },
            //发布公告
            addAnn() {
                this.addCheck('formRef');
                if (this.valid === true){
                }else{
                    return;
                }
                axios.post('http://localhost:8762/admin/annManage/addAnn',{
                    annTitle: this.ann.annTitle,
                    summary: this.ann.summary,
                    annContent: this.ann.annContent,
                    expiredTime: this.addExpiredTime,
                },{
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res =>{
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        this.addVisible = false;
                        this.getTableData();
                        ElMessage.success(res.data.message);
                    }
                });
            },
        },
    }
</script>

<style scoped>
    .insert {
        /*margin-left: 100%;*/
    }

    .handle-box {
        /*display: flex;*/
        margin-bottom: 20px;
        /*justify-content: center;*/
        /*align-items: center;*/
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