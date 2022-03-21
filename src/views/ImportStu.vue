<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 导入信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>
                <div class="handle-box">
                    <el-upload
                            class="upload-demo"
                            ref="upload"
                            :action="getUploadUrl()"
                            :headers="uploadHeaders"
                            :on-success="uploadRes"
                            accept=".xls, .xlsx"
                            :file-list="fileList"
                            :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过500kb</div>
                    </el-upload>
                    <el-button style="margin-left: 100px;" size="small" type="success" @click="preView">查看预览数据
                    </el-button>
                    <el-button style="margin-left: 50px;" size="small" type="success" @click="handleUpload">确认上传
                    </el-button>


                    <div class="upload-tips">
                        excel样例展示
                        <el-table :data="demoList" border class="demo-table" ref="multipleTable"
                                  header-cell-class-name="table-header">
                            <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
                            <el-table-column prop="userNo" label="学号" align="center"></el-table-column>
                            <el-table-column prop="realName" label="姓名" align="center"></el-table-column>
                            <el-table-column prop="phone" label="电话" align="center"></el-table-column>
                            <el-table-column prop="college" label="学院" align="center"></el-table-column>
                            <el-table-column prop="discipline" label="专业" align="center"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px; margin-bottom: 10px; color: #376da8">导入预览</div>
            <el-table :data="list" v-loading="isLoading" height="450" border class="table" ref="multipleTable"
                      header-cell-class-name="table-header">
                <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
                <el-table-column prop="userNo" label="学号" align="center"></el-table-column>
                <el-table-column prop="realName" label="姓名" align="center"></el-table-column>
                <el-table-column prop="phone" label="电话" align="center"></el-table-column>
                <el-table-column prop="college" label="学院" align="center"></el-table-column>
                <el-table-column prop="discipline" label="专业" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {ElMessage, ElMessageBox} from "element-plus";
    import axios from "axios";

    export default {
        name: "importStu",
        data() {
            return {
                isLoading: false,
                baseUploadUrl: 'http://localhost:8762/admin/userManage',
                //0预览，1上传
                action: null,
                uploadHeaders: {
                    authorization: localStorage.getItem("token")
                },
                demoList: [{
                    userNo: "201810414427",
                    realName: "张三",
                    phone: "187*******8",
                    college: "计算机学院",
                    discipline: "软件工程",
                }, {
                    userNo: "201810414428",
                    realName: "李四",
                    phone: "187*******8",
                    college: "计算机学院",
                    discipline: "计算机科学与技术",
                },],
                fileList: [],
                list: null,
            };
        },
        methods: {
            handleChange(file, fileList) {
                this.fileList = fileList.slice(-3);
            },
            //excel上传
            preView() {
                this.action = '0';
                this.isLoading = true;
                setTimeout(()=>{
                    this.$refs.upload.submit()
                },1 * 1000);
            },
            //上传返回的数据
            uploadRes(res) {
                console.log(res);
                if (res.code !== 1000) {
                    if (res.code === 999) {
                        ElMessage.error(res.message);
                        this.$router.push("/login");
                    }else if(res.code === 403){
                        ElMessage.error(res.message);
                        this.$router.replace("/403");
                    }
                    ElMessage.error(res.message);
                    return false;
                }else {
                    console.log(res);
                    if (this.action === '0'){
                        this.list = res.data;
                        ElMessage.success(res.message);
                    }else {
                        ElMessage.success("上传成功");
                    }
                    this.isLoading = false;
                }
            },
            handleUpload() {
                this.action = '1';
                this.isLoading = true;
                setTimeout(()=>{
                    this.$refs.upload.submit()
                },1 * 1000);

            },
            getUploadUrl() {
                return this.action === '1' ? this.baseUploadUrl + "/importStuInfo" : this.baseUploadUrl + "/preViewUserInfo";
            }

        }
    }
</script>

<style scoped>

    .upload-demo {
        width: 22%;
        float: left;
        margin-right: 20px;
    }

    .handle-box {
        /*float: bottom;*/
        /*height: 300px;*/
    }

    .upload-tips {
        /*margin-left: 50px;*/
        text-align: center;
        color: #00a854;
    }

    .demo-table {
        /*background: #00a854;*/
        /*color: #00a854;*/
        border-left-left: 10px;
        width: 75%;
    }

</style>
