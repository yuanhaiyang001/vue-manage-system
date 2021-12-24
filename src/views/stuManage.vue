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
                <el-select v-model="query.address" placeholder="在线状态" class="handle-select mr10">
                    <el-option key="1" label="在线" value="1"></el-option>
                    <el-option key="2" label="离线" value="0"></el-option>
                </el-select>
                <el-input v-model="query.stuNo" placeholder="学号" class="handle-input mr10"></el-input>
                <el-input v-model="query.stuName" placeholder="姓名" class="handle-input mr10"></el-input>
                <el-input v-model="query.college" placeholder="学院" class="handle-input mr10"></el-input>
                <el-input v-model="query.discipline" placeholder="专业" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table :data="tableData" height="600" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="序号" type = "index" width="55" align="center"></el-table-column>
                <el-table-column prop="stuNo" label="学号" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
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
                        <el-button type="text" style="color: red">{{ scope.row.onlineStatus === '1' ? "下线" : ""}}</el-button>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                               :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
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
    import { ref, reactive } from "vue";
    import { ElMessage, ElMessageBox } from "element-plus";
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
            // 获取表格数据
            const getData = () => {
                // let table = ref("table");
                // console.log(table.load);
                axios.post('http://localhost:8762/admin/userManage/queryStuInfo', {
                    stuName: query.stuName,
                    stuNo: query.stuNo,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    if (res.data.code != 1000){
                        if (res.data.code === 999){
                            ElMessage.error(res.data.message);
                            router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    }else{
                        // console.log(res.data);
                        var response = res.data.data;
                        response.list.forEach(item =>{
                            var studentInfo = {};
                            studentInfo.stuNo = item.userNo;
                            studentInfo.name = item.realName;
                            studentInfo.college = item.college;
                            studentInfo.discipline = item.discipline;
                            studentInfo.onlineStatus = item.onlineStatus;
                            tableData.push(studentInfo);
                        });
                        Vue.set(tableData, 0, tableData);

                        console.log(tableData);
                    }
                })
            };
            getData();

            // 查询操作
            const handleSearch = () => {
                query.pageIndex = 1;
                tableData = [];
                getData();
            };
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
                    .catch(() => {});
            };

            // 表格编辑时弹窗和保存
            const editVisible = ref(false);
            let form = reactive({
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
                query,
                tableData,
                pageTotal,
                editVisible,
                form,
                handleSearch,
                handlePageChange,
                handleDelete,
                handleEdit,
                saveEdit,
            };
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
