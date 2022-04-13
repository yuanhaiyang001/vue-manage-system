<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 我的服务
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <span style="position: relative; bottom: 7px">编号：</span>
                <el-input v-model="query.serviceNum" placeholder="请输入服务编号" class="handle-input mr10"></el-input>
                <span style="position: relative; bottom: 7px">服务名称：</span>
                <el-input v-model="query.serviceName" placeholder="请输入服务名称" class="handle-input mr10"></el-input>
                <span style="position: relative; bottom: 7px">状态：</span>
                <el-select v-model="query.serviceStatus" placeholder="请选择状态" class="handle-select mr10">
                    <el-option key="99" label="全部" value="99"></el-option>
                    <el-option key="0" label="未发布" value="0"></el-option>
                    <el-option key="1" label="已发布" value="1"></el-option>
                    <el-option key="2" label="已下架" value="2"></el-option>
                </el-select>

                <el-button style="position: relative; bottom: 7px" type="primary" icon="el-icon-search"
                           @click="getTableData" class="reset">搜索
                </el-button>
                <el-button style="position: relative; bottom: 7px" type="primary" icon="el-icon-search"
                           @click="resetTableData" class="reset">重置
                </el-button>
                <div>
                    <el-button type="text" icon="el-icon-lx-add" class="red insert" @click="addVisible = true">添加服务</el-button>
                </div>
            </div>
            <el-table :data="list" v-loading="isLoading" class="table" ref="multipleTable"
                      header-cell-class-name="table-header">
                <el-table-column label="序号" type="index" width="55"></el-table-column>
                <el-table-column  prop="serviceNum" label="服务编号"></el-table-column>
                <el-table-column  prop="serviceName" label="服务名称"></el-table-column>
                <el-table-column width="100%" prop="unitPrice" label="单价"></el-table-column>
                <el-table-column width="70%"  prop="stock" label="库存"></el-table-column>
<!--                <el-table-column prop="serviceDescribe" label="描述"></el-table-column>-->
                <el-table-column width="170%" prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column width="170%" prop="takeDownTime" label="下架时间"></el-table-column>
                <el-table-column width="100%" prop="serviceStatus" label="状态" align="center">
                    <template #default="scope">
                        <el-tag :type="
                                scope.row.serviceStatus === '1'
                                    ? 'success'
                                    : 'info'
                            ">{{ scope.row.serviceStatus === '1' ? "已上架" : scope.row.serviceStatus === '0' ? "未发布" :
                            "已下架"}}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit"
                                   @click="handleEdit(scope.row.id, scope.row.serviceNum, scope.row.serviceName,
                                   scope.row.serviceDescribe, scope.row.unitPrice,scope.row.stock,
                                   scope.row.serviceStatus,scope.row.image)">
                            编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="delService(scope.row.id)">删除
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
                <el-form-item label="图片：">
                    <el-image :src="editInfo.image"></el-image>
                </el-form-item>
                <el-form-item label="编号：">
                    <span>{{editInfo.serviceNum}}</span>
                </el-form-item>
                <el-form-item label="名称：">
                    <el-input v-model="editInfo.serviceName" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="单价：">
                    <el-input oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="editInfo.unitPrice" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="库存：">
                    <el-input oninput ="value=value.replace(/[^\d]/g,'')" v-model="editInfo.stock" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input  type="textarea" rows="4" v-model="editInfo.serviceDescribe" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-radio-group v-model="TStatus">
                        <el-radio label="发布" :disabled="editInfo.serviceStatus === '1'"></el-radio>
                        <el-radio label="下架" :disabled="editInfo.serviceStatus === '2'"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 添加弹出框 -->
        <el-dialog title="添加" v-model="addVisible" width="26%">
            <el-form label-width="27%" :model="serviceAddInfo" :rules="rules" ref="formRef">
                <el-form-item style="margin-bottom: 0px" label="图片：" prop="image">
                </el-form-item>
                    <el-upload
                            class="avatar-uploader"
                            action="http://www.hiyang.top:8766/common/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                <el-form-item label="名称：" prop="serviceName">
                    <el-input v-model="serviceAddInfo.serviceName" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="单价：" prop="unitPrice">
                    <el-input oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="serviceAddInfo.unitPrice" @blur="serviceAddInfo.unitPrice = $event.target.value" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="库存：" prop="stock">
                    <el-input oninput ="value=value.replace(/[^\d]/g,'')" v-model="serviceAddInfo.stock" @blur="serviceAddInfo.stock = $event.target.value" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="描述：" clearable>
                    <el-input  type="textarea" rows="4" v-model="serviceAddInfo.serviceDescribe" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addService">确 定</el-button>
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
        name: "MyService",
        data() {
            return {
                imageUrl:"",
                valid: false,
                rules: {
                    serviceName: [
                        {required: true, message: '请输入服务名称', trigger: 'blur'},
                        {min: 1, message: '长度最短为1个字符', trigger: 'blur'}
                    ],
                    unitPrice: [
                        {required: true, message: '请输入单价', trigger: 'blur'},
                    ],
                    stock: [
                        {required: true, message: '请输入库存', trigger: 'blur'},
                        {max: 4, message: '最多为9999', trigger: 'blur'}
                    ]
                },
                addVisible:false,
                serviceAddInfo: {
                    image: '',
                    serviceName: '',
                    serviceDescribe: '',
                    unitPrice: '',
                    stock: '',
                },
                //临时变量
                TStatus: null,
                //查询参数
                query: reactive({
                    serviceNum: '',
                    serviceName: '',
                    serviceStatus: null,
                    pageIndex: 1,
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
                    id: "",
                    serviceNum: "",
                    serviceName: "",
                    serviceDescribe: "",
                    unitPrice: "",
                    stock: "",
                    serviceStatus: '',
                    image: ''
                }),
            }
        },
        mounted() {
            this.getTableData();
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                console.log(res);
                if (res.code !== 1000){
                    ElMessage.error(res.message);
                }else{
                    this.serviceAddInfo.image = res.data;
                }
                console.log(this.serviceAddInfo.image)
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg' || 'image/jpg' || 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传图片只能是jpg/jpeg/png格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //获取表格信息
            getTableData() {
                this.isLoading = true;
                axios.post('https://www.hiyang.top:8762/thirdparty/service/list', {
                    publishUser: localStorage.getItem("ms_username"),
                    serviceStatus: this.query.serviceStatus === '99' ? null : this.query.serviceStatus,
                    serviceName: this.query.serviceName,
                    serviceNum: this.query.serviceNum,
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
                this.query.serviceName = '';
                this.query.serviceStatus = null;
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

            //启用/禁用
            setUseStatus(dorNo, isUse) {
                console.log("寝室启用/禁用：" + dorNo);
                axios.post('https://www.hiyang.top:8762/admin/dorManage/updateDorInfo', {
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
                    axios.post('https://www.hiyang.top:8762/admin/dorManage/delDorInfo', {
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
                        ElMessageBox.alert("删除失败" + error)
                    });
            },

            //编辑信息
            handleEdit(id, serviceNum, serviceName, serviceDescribe, unitPrice, stock, serviceStatus,image) {
                this.editInfo.id = id;
                this.editInfo.serviceNum = serviceNum;
                this.editInfo.serviceName = serviceName;
                this.editInfo.serviceDescribe = serviceDescribe;
                this.editInfo.unitPrice = unitPrice;
                this.editInfo.stock = stock;
                this.editInfo.serviceStatus = serviceStatus;
                this.TStatus = serviceStatus;
                this.editInfo.image = image;
                this.editVisible = true;
            },

            //保存编辑信息
            saveEdit() {
                this.editInfo.serviceStatus = this.TStatus;
                if (this.TStatus === "发布"){
                    this.editInfo.serviceStatus = '1';
                }else if(this.TStatus === "下架"){
                    this.editInfo.serviceStatus = '2';
                }else {
                    this.editInfo.serviceStatus = null;
                }
                console.log(this.editInfo);
                if (this.editInfo.serviceName === null || this.editInfo.serviceName === "") {
                    ElMessage.error("请填写必填参数");
                    return false;
                }
                if (this.editInfo.stock === null){
                    this.editInfo.stock = '0'
                }
                if (this.editInfo.unitPrice === null){
                    this.editInfo.unitPrice = '0'
                }
                axios.post('https://www.hiyang.top:8762/thirdparty/service/update', {
                    id: this.editInfo.id,
                    serviceName: this.editInfo.serviceName,
                    serviceDescribe: this.editInfo.serviceDescribe,
                    unitPrice: this.editInfo.unitPrice,
                    stock: this.editInfo.stock,
                    serviceStatus: this.editInfo.serviceStatus,
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
                        this.getTableData();
                        ElMessage.success(res.data.message);
                    }
                });
                this.editVisible = false;
            },

            addCheck(formName) {
                this.$refs[formName].validate((valid) => {
                    this.valid = valid;
                });
            },

            //添加服务
            addService() {
                console.log(this.serviceAddInfo);
                this.addCheck('formRef');
                if (this.valid === true){
                    console.log(this.dictData)
                }else{
                    return;
                }
                axios.post('https://www.hiyang.top:8762/thirdparty/service/insert',{
                    image: this.serviceAddInfo.image,
                    serviceName: this.serviceAddInfo.serviceName,
                    serviceDescribe: this.serviceAddInfo.serviceDescribe,
                    unitPrice: this.serviceAddInfo.unitPrice,
                    stock: this.serviceAddInfo.stock,
                    publishUser: localStorage.getItem("ms_username"),
                },{
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res =>{
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
                        this.addVisible = false;
                        // this.serviceAddInfo.serviceName = '';
                        // this.serviceAddInfo.serviceDescribe = '';
                        // this.serviceAddInfo.unitPrice = '';
                        // this.serviceAddInfo.stock = '';
                        this.getTableData();
                        ElMessage.success(res.data.message);
                    }
                });
                this.serviceAddInfo.stock = '';
                this.serviceAddInfo.image = '';
                this.serviceAddInfo.serviceDescribe = '';
                this.serviceAddInfo.serviceName = '';
                this.serviceAddInfo.unitPrice = '';
            },
            //删除服务
            delService(id) {
                // 二次确认删除
                ElMessageBox.confirm("确定要删除吗？", "提示", {
                    type: "warning",
                }).then(() =>{
                    axios.post('https://www.hiyang.top:8762/thirdparty/service/delete',{
                        id: id,
                    },{
                        headers: {
                            authorization: localStorage.getItem("token")
                        }
                    }).then(res =>{
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
                            this.getTableData();
                            ElMessage.success(res.data.message);
                        }
                    })
                }).catch((error) => {
                });
            },
        },
    }
</script>

<style scoped>
    .insert {
        margin-left: 70%;
    }
    .handle-box {
        display: flex;
        margin-bottom: 20px;
        justify-content: center;
        align-items: center;
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
    .avatar-uploader  {
        /*position: relative;*/
        /*width: 70px;*/
        /*height: 100px;*/
        margin-bottom: 10px;
    }
    .avatar-uploader :hover {
    }
    .avatar-uploader-icon {
        font-size: xx-large;
        line-height: 178px;
    }
    .avatar {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>
