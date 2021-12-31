<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="param.password"
                              @keyup.enter="login2()">
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="login2()">登录</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
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
        setup() {
            const router = useRouter();
            const param = reactive({
                username: "201810414427",
                password: "000000",
            });
            const rules = {
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
            };
            const userInfo = {
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
            const login = ref(null);

            const login2 = () => {
                axios.post('http://localhost:8762/admin/base/login', {
                    userNo: param.username,
                    password: param.password,
                }).then(res => {
                        submitForm(res);
                        getMyInfo();
                    }
                )
            };

            /**
             * 获取个人信息
             */
            const getMyInfo = () => {
                axios.post('http://localhost:8762/admin/base/myInfo', {}, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    // userInfo.id = res.data.data.id;
                    // userInfo.userNo = res.data.data.userNo;
                    // userInfo.userName = res.data.data.userName;
                    // userInfo.realName = res.data.data.realName;
                    // userInfo.phone = res.data.data.phone;
                    // userInfo.college = res.data.data.college;
                    // userInfo.discipline = res.data.data.discipline;
                    // userInfo.dorNo = res.data.data.dorNo;
                    // userInfo.email = res.data.data.email;
                    // userInfo.grade = res.data.data.grade;
                    // userInfo.identityType = res.data.data.identityType;
                    // userInfo.loginDate = res.data.data.loginDate;
                    console.log(res.data.data);
                    sessionStorage.setItem("myInfo", JSON.stringify(res.data.data));
                })
            }

            const submitForm = (res) => {
                login.value.validate((valid) => {
                    if (valid) {
                        if (res.data.code != 1000) {
                            ElMessage.error(res.data.message);
                            return false;
                        }
                        localStorage.setItem("ms_username", param.username);
                        ElMessage.success("用户" + localStorage.getItem("ms_username") + "登录");
                        let authorization = res.headers.authorization;
                        localStorage.setItem("token", authorization);
                        setTimeout(()=>{
                            router.push("/dashboard");
                        }, 1000);

                    } else {
                        ElMessage.error("请正确填写账号密码");
                        return false;
                    }
                });
            };

            const store = useStore();
            store.commit("clearTags");

            return {
                param,
                rules,
                login,
                submitForm,
                login2,
            };
        },
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
