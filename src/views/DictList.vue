<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 数据字典
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                类型：
                <el-select v-model="query.type" placeholder="选择类型" class="handle-input mr10">
                    <el-option
                            v-for="item in dictTypes"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                code：
                <el-input v-model="query.code" placeholder="输入code" class="handle-input mr10"></el-input>
                描述：
                <el-input v-model="query.describe" placeholder="输入描述" class="handle-input mr10"></el-input>

                <el-button type="primary" icon="el-icon-search" @click="getTableData" class="reset">搜索</el-button>
                <el-button type="primary" icon="el-icon-search" @click="resetTableData" class="reset">重置</el-button>
            </div>
            <el-table :data="list" v-loading="isLoading" class="table" ref="multipleTable"
                      header-cell-class-name="table-header">
                <el-table-column label="序号" type="index" width="55"></el-table-column>
                <el-table-column prop="type" label="类型" width="150%"></el-table-column>
                <el-table-column prop="code" label="code" width="150%"></el-table-column>
                <el-table-column prop="value" label="值" width="200%"></el-table-column>
                <el-table-column prop="describe" label="描述"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="170%"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="170%"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit"
                                   @click="handleEdit(scope.row.id,scope.row.code,scope.row.type,scope.row.value,scope.row.describe)">
                            编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="deleteDict(scope.row.id)">删除
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
                <el-form-item label="类型">
                    <el-input v-model="editInfo.type" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="code">
                    <el-input v-model="editInfo.code" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="value">
                    <el-input v-model="editInfo.value" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="editInfo.describe" style="width: 70%" type="textarea" rows="4"></el-input>
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
        name: "DictList",
        data() {
            return {
                dictTypes: [],
                editVisible: false,
                editInfo: {
                    id: '',
                    code: '',
                    type: '',
                    value: '',
                    describe: '',
                },
                query: {
                    code: '',
                    type: '',
                    value: '',
                    describe: '',
                    pageIndex: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                },
                list: null,
                isLoading: false
            }
        },
        mounted() {
            this.getDictTypes();
            this.getTableData();
        },
        methods: {
            //获取类型
            getDictTypes() {
                axios.post('http://localhost:8762/common/dictTypes', {}, {
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
                        this.dictTypes = res.data.data;
                    }
                })
            },
            //编辑
            handleEdit(id, code, type, value, describe) {
                this.editInfo.id = id;
                this.editInfo.code = code;
                this.editInfo.type = type;
                this.editInfo.value = value;
                this.editInfo.describe = describe;
                this.editVisible = true;
            },
            //保存
            saveEdit() {
                axios.post('http://localhost:8762/common/updateDict', {
                    id: this.editInfo.id,
                    code: this.editInfo.code,
                    type: this.editInfo.type,
                    value: this.editInfo.value,
                    describe: this.editInfo.describe,
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
                        ElMessage.success(res.data.message);
                        this.editVisible = false;
                        this.getTableData();
                    }
                })
            },
            //获取列表数据
            getTableData() {
                this.isLoading = true;
                axios.post('http://localhost:8762/common/dictsList', {
                    type: this.query.type,
                    code: this.query.code,
                    describe: this.query.describe,
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
            //重置查询条件
            resetTableData() {
                this.query.type = '';
                this.query.code = '';
                this.query.value = '';
                this.query.describe = '';
                this.query.pageIndex = 1;
                this.query.pageNo = 1;
                this.query.pageSize = 10;
                this.getTableData();
            },
            //删除字典
            deleteDict(id) {
                // 二次确认删除
                ElMessageBox.confirm("确定要删除吗？", "提示", {
                    type: "warning",
                }).then(() => {
                    axios.post('http://localhost:8762/common/deleteDict', {
                        id: id
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
                            ElMessage.success("删除成功");
                            this.getTableData();
                        }
                    });

                })
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
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-left: 100px;
        margin-bottom: 20px;
    }

    .handle-input {
        width: 15%;
        display: inline-block;
    }

    .mr10 {
        margin-right: 30px;
        margin-bottom: 10px;
    }

    .reset {
        margin-left: 50px;
    }
</style>
