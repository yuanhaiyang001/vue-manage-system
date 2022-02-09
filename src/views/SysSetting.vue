<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-settings"></i> 系统设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form label-position="left" ref="formRef" label-width="150px" v-loading = "isLoading">
                    <el-form-item label="允许宿舍管理员登录" prop="systemSetting.allowDorManagerLogin">
                        <el-switch v-model="systemSetting.allowDorManagerLogin" @change="changeDorManagerLogin"></el-switch>
                    </el-form-item>
                    <el-form-item label="允许学生用户登录" prop="systemSetting.allowStudentLogin">
                        <el-switch v-model="systemSetting.allowStudentLogin" @change="changeStudentLogin"></el-switch>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {reactive, ref} from "vue";
    import {ElMessage, ElMessageBox} from "element-plus";
    import axios from "axios";

    export default {
        name: "SysSetting",
        data() {
            return {
                systemSetting:{
                    allowDorManagerLogin: true,
                    allowStudentLogin: true,
                },
                isLoading: false,
            }
        },
        mounted() {
            this.getSystemSetting();
        },
        methods: {
            //获取系统设置
            getSystemSetting(){
                this.isLoading = true;
                setTimeout(()=>{
                    this.isLoading = false;
                },1 * 1000)
            },
            //禁止/允许宿管登录
            changeDorManagerLogin(e) {
                if (e === true) {
                    ElMessageBox.confirm("此修改将会禁止所有学生和宿舍管理员登录，请再次确认是否开启", "警告", {type: 'warning'})
                        .then(() => {
                            console.log("已禁止所有用户登录");
                            this.getSystemSetting();
                        })
                    .catch(()=>{
                        console.log("取消操作");
                        this.getSystemSetting();
                    })
                }else {
                    ElMessageBox.confirm("此修改将会允许所有学生和宿舍管理员登录，请再次确认是否关闭", "警告", {type: 'warning'})
                        .then(() => {
                            console.log("已允许所有用户登录");
                            this.getSystemSetting();
                        })
                        .catch(()=>{
                            console.log("取消操作");
                            this.getSystemSetting();
                        })
                }
            },
            //禁止/允许学生登录
            changeStudentLogin(e){
                if (e === true) {
                    ElMessageBox.confirm("此修改将会禁止所有学生用户登录，请再次确认是否开启", "警告", {type: 'warning'})
                        .then(() => {
                            console.log("已禁止所有学生用户登录");
                            this.getSystemSetting();
                        })
                        .catch(()=>{
                            console.log("取消操作");
                            this.getSystemSetting();
                        })
                }else {
                    ElMessageBox.confirm("此修改将会允许所有学生用户登录，请再次确认是否关闭", "警告", {type: 'warning'})
                        .then(() => {
                            console.log("已允许所有学生用户登录");
                            this.getSystemSetting();
                        })
                        .catch(()=>{
                            console.log("取消操作");
                            this.getSystemSetting();
                        })
                }
            }
        }

    }
</script>

<style scoped>

</style>
