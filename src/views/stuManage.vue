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
                电话：
                <el-input v-model="query.phone" placeholder="电话" class="handle-input mr10"></el-input>
                学院：
                <el-input v-model="query.college" placeholder="学院" class="handle-input mr10"></el-input>
                专业：
                <el-input v-model="query.discipline" placeholder="专业" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getTableData">搜索</el-button>
            </div>

            <el-table :data="list" v-loading = "query.isLoading" height="600" border class="table" ref="multipleTable"
                      header-cell-class-name="table-header">
                <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
                <el-table-column prop="userNo" label="学号" align="center"></el-table-column>
                <el-table-column prop="realName" label="姓名" align="center"></el-table-column>
                <el-table-column prop="phone" label="电话" align="center"></el-table-column>
                <el-table-column prop="college" label="学院" align="center"></el-table-column>
                <el-table-column prop="discipline" label="专业" align="center"></el-table-column>
                <el-table-column prop="onlineStatus" label="状态" align="center">
                    <template #default="scope">
                        <el-tag :type="
                                scope.row.onlineStatus === '1'
                                    ? 'success'
                                    : scope.row.onlineStatus === '0'
                                    ? 'info'
                                    : ''
                            " style="margin-right: 15px">{{ scope.row.onlineStatus === '1' ? "在线" : "离线"}}
                        </el-tag>
                        <el-button type="text" style="color: red">{{ scope.row.onlineStatus === '1' ? "下线" : ""}}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                               :page-size="query.pageSize" :total="pageTotal"
                               @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
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
    import {useRouter} from "vue-router";

    export default {
        name: "stuManage",
        setup() {
            const router = useRouter();
            const query = reactive({
                stuNo: "",
                stuName: "",
                college: "",
                discipline: "",
                pageNo: 1,
                pageSize: 10,
            });
            let tableData = reactive([]);
            const pageTotal = ref(0);
            // 分页导航
            const handlePageChange = (val) => {
                query.pageIndex = val;
                getData();
            };

            // 删除操作
            const handleDelete = (index) => {
                // 二次确认删除
                ElMessageBox.confirm("确定要删除吗？", "提示", {
                    type: "warning",
                })
                    .then(() => {
                        ElMessage.success("删除成功");
                        tableData.value.splice(index, 1);
                    })
                    .catch(() => {
                    });
            };

            // 表格编辑时弹窗和保存
            const editVisible = ref(false);
            const form = reactive({
                name: "",
                address: "",
            });
            let idx = -1;
            const handleEdit = (index, row) => {
                idx = index;
                Object.keys(form).forEach((item) => {
                    form[item] = row[item];
                });
                editVisible.value = true;
            };
            const saveEdit = () => {
                editVisible.value = false;
                ElMessage.success(`修改第 ${idx + 1} 行成功`);
                Object.keys(form).forEach((item) => {
                    tableData.value[idx][item] = form[item];
                });
            };

            return {
                tableData,
                pageTotal,
                editVisible,
                form,
                handlePageChange,
                handleDelete,
                handleEdit,
                saveEdit,
            };
        },
        data() {
          return {
              query: reactive({
                  onlineStatus: null,
                  stuNo: "",
                  stuName: "",
                  phone: "",
                  college: "",
                  discipline: "",
                  pageNo: 1,
                  pageSize: 10,
              }),
              isLoading: false,
              list: null,
          }
        },
        mounted() {
            this.getTableData();
        },
        methods: {
            getTableData() {
                this.query.isLoading = true;
                axios.post('http://localhost:8762/admin/userManage/queryStuInfo', {
                    onlineStatus: this.query.onlineStatus === '2' ? null : this.query.onlineStatus,
                    stuName: this.query.stuName,
                    stuNo: this.query.stuNo,
                    phone: this.query.phone,
                    college: this.query.college,
                    discipline: this.query.discipline,
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
                        this.list = res.data.data.list;
                        console.log(this.list);
                        setTimeout(()=>{
                            this.query.isLoading = false;
                        }, 0.5 * 1000);
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
        width: 10%;
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
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
