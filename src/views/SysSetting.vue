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
                    <el-form-item label="允许三方用户登录" prop="systemSetting.allowThirdPartyLogin">
                        <el-switch v-model="systemSetting.allowThirdPartyLogin" @change="changeThirdLogin"></el-switch>
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
                    allowThirdPartyLogin: true,
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
                axios.post('http://localhost:8762/common/querySettings',{

                },{
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
                    }else {
                        this.systemSetting.allowDorManagerLogin = res.data.data[0].value === '1' ? true:false;
                        this.systemSetting.allowStudentLogin = res.data.data[1].value === '1' ? true:false;
                        this.systemSetting.allowThirdPartyLogin = res.data.data[2].value === '1' ? true:false;
                    }
                    console.log(res.data.data);
                });
                setTimeout(()=>{
                    this.isLoading = false;
                },0.5 * 1000)

            },
            //禁止/允许宿管登录
            changeDorManagerLogin(e) {
                if (e === false) {
                    ElMessageBox.confirm("此修改将会禁止宿舍管理员登录，请再次确认是否修改", "警告", {type: 'warning'})
                        .then(() => {
                            this.updateSetting({setting:'dor_manager_login',value:'0'});
                            console.log("已禁止所有用户登录");
                            setTimeout(()=>{
                                this.getSystemSetting();
                            }, 1000);

                        })
                    .catch(()=>{
                        console.log("取消操作");
                        this.getSystemSetting();
                    })
                }else {
                    ElMessageBox.confirm("此修改将会允许宿舍管理员登录，请再次确认是否做修改", "警告", {type: 'warning'})
                        .then(() => {
                            this.updateSetting({setting:'dor_manager_login',value:'1'});
                            console.log("已允许所有用户登录");
                            setTimeout(()=>{
                                this.getSystemSetting();
                            }, 1000);
                        })
                        .catch(()=>{
                            console.log("取消操作");
                            this.getSystemSetting();
                        })
                }
            },
            //禁止/允许学生登录
            changeStudentLogin(e){
                if (e === false) {
                    ElMessageBox.confirm("此修改将会禁止所有学生用户登录，请再次确认是否修改", "警告", {type: 'warning'})
                        .then(() => {
                            this.updateSetting({setting:'stu_login',value:'0'});
                            console.log("已禁止所有学生用户登录");
                            setTimeout(()=>{
                                this.getSystemSetting();
                            }, 1000);
                        })
                        .catch(()=>{
                            console.log("取消操作");
                            this.getSystemSetting();
                        })
                }else {
                    ElMessageBox.confirm("此修改将会允许所有学生用户登录，请再次确认是否做修改", "警告", {type: 'warning'})
                        .then(() => {
                            this.updateSetting({setting:'stu_login',value:'1'});
                            console.log("已允许所有学生用户登录");
                            setTimeout(()=>{
                                this.getSystemSetting();
                            }, 1000);
                        })
                        .catch(()=>{
                            console.log("取消操作");
                            this.getSystemSetting();
                        })
                }
            },
            //允许/禁止三方用户登录
            changeThirdLogin(e){
                if (e === false) {
                    ElMessageBox.confirm("此修改将会禁止三方用户登录，请再次确认是否修改", "警告", {type: 'warning'})
                        .then(() => {
                            this.updateSetting({setting:'third_party_login',value:'0'});
                            console.log("已禁止三方用户登录");
                            setTimeout(()=>{
                                this.getSystemSetting();
                            }, 1000);
                        })
                        .catch(()=>{
                            console.log("取消操作");
                            this.getSystemSetting();
                        })
                }else {
                    ElMessageBox.confirm("此修改将会允许三方用户登录，请再次确认是否做修改", "警告", {type: 'warning'})
                        .then(() => {
                            this.updateSetting({setting:'third_party_login',value:'1'});
                            console.log("已允许三方用户登录");
                            setTimeout(()=>{
                                this.getSystemSetting();
                            }, 1000);
                        })
                        .catch(()=>{
                            console.log("取消操作");
                            this.getSystemSetting();
                        })
                }
            },

            //更新
            updateSetting(set){
                axios.post('http://localhost:8762/common/updateSetting',{
                    setting: set.setting,
                    value: set.value
                },{
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
                        ElMessage.success(res.data.message);
                    }
                });
            }
        }

    }
</script>

<style scoped>

</style>
