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
                            action="http://localhost:8762/admin/userManage/preViewUserInfo"
                            :headers="uploadHeaders"
                            :on-success="uploadRes"
                            accept=".xls, .xlsx"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :file-list="fileList"
                            :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过500kb</div>
                    </el-upload>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="handleUpload">查看预览数据</el-button>
                    <el-button style="margin-left: 50px;" size="small" type="success" @click="">确认上传</el-button>


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
            <el-table :data="list" v-loading="" height="450" border class="table" ref="multipleTable"
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
                uploadHeaders: {
                    authorization: localStorage.getItem("token")
                },
                demoList:[{
                    userNo: "201810414427",
                    realName: "张三",
                    phone: "187*******8",
                    college: "计算机学院",
                    discipline: "软件工程",
                },{
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
            handleUpload(file){
                this.$refs.upload.submit();
                ElMessage.success("上传成功");
            },
            //上传返回的数据
            uploadRes(res){
                console.log(res.data);
                this.list = res.data;
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
    .handle-box{
        /*float: bottom;*/
        /*height: 300px;*/
    }
    .upload-tips{
        /*margin-left: 50px;*/
        text-align: center;
        color: #00a854;
    }
    .demo-table{
        /*background: #00a854;*/
        /*color: #00a854;*/
        border-left-left: 10px;
        width: 75%;
    }

</style>
