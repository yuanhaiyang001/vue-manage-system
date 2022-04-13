<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="loginValid" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="请输入职工号">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="param.password"
                              @keyup.enter="login">
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="login">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {ref, reactive} from "vue";
    import {useStore} from "vuex";
    import {useRouter} from "vue-router";
    import {ElMessage} from "element-plus";
    import axios from 'axios';

    export default {
        data() {
            return {
                param: reactive({
                    username: "",
                    password: "",
                }),
                rules: {
                    username: [
                        {
                            required: true,
                            message: "请输入用户名",
                            trigger: "blur",
                        },
                    ],
                    password: [
                        {required: true, message: "请输入密码", trigger: "blur"},
                    ],
                },
                userInfo: {
                    id: "",
                    userNo: "",
                    userName: "",
                    realName: "",
                    phone: "",
                    college: "",
                    discipline: "",
                    dorNo: "",
                    email: "",
                    grade: "",
                    identityType: "",
                    loginDate: ""
                }
            }
        },

        mounted() {

        },

        methods: {
            login() {
                this.$refs["loginValid"].validate((valid) => {
                    if (valid) {
                        axios.post('https://www.hiyang.top:8762/admin/base/login', {
                            userNo: this.param.username,
                            password: this.param.password,
                        }).then(res => {
                            if (res.data.code != 1000) {
                                ElMessage.error(res.data.message);
                                return false;
                            } else {
                                localStorage.setItem("ms_username", this.param.username);
                                ElMessage.success("用户" + localStorage.getItem("ms_username") + "登录");
                                let authorization = res.headers.authorization;
                                localStorage.setItem("token", authorization);
                                this.getMyInfo();
                                this.getAllDicts();
                                setTimeout(() => {
                                    this.$router.push("/dashboard");
                                }, 1.5*1000);
                            }
                        });
                    } else {
                        ElMessage.error("请正确填写账号密码");
                        return false;
                    }
                })
            },
            /**
             * 获取个人信息
             */
            getMyInfo() {
                axios.post('https://www.hiyang.top:8762/admin/base/myInfo', {}, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    console.log(res.data.data);
                    sessionStorage.setItem("myInfo", JSON.stringify(res.data.data));
                })
            },
            /**
             * 字典
             */
            getAllDicts() {
              axios.post('https://www.hiyang.top:8762/common/dicts',{},{
                  headers: {
                      authorization: localStorage.getItem("token")
                  }
              }).then(res=> {
                  // console.log(res.data.data);
                  sessionStorage.setItem("dicts", JSON.stringify(res.data.data));
              })
            },
        }

    };
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../assets/img/login-bg.jpg);
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }
</style>
