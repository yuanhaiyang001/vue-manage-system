<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <template #header>
                        <div class="clearfix">
                            <span>基础信息</span>
                        </div>
                    </template>
                    <div class="info">
                        <div class="info-image" @click="showDialog">
                            <img :src="avatarImg"/>
                            <span class="info-edit">
                                <i class="el-icon-lx-camerafill"></i>
                            </span>
                        </div>
                        <div class="info-name">{{ form.realName }}</div>
                        <div class="info-desc">{{form.remark}}</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <template #header>
                        <div class="clearfix">
                            <span>账户编辑</span>
                        </div>
                    </template>
                    <el-form label-width="200px">
                        <el-form-item label="学号或职工号："> {{ form.stuNo }}</el-form-item>
                        <el-form-item label="昵称：">
                            <el-input v-model="form.userName" style="width: 40%"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名："> {{ form.realName }}</el-form-item>
                        <el-form-item label="学院："> {{ form.college }}</el-form-item>
                        <el-form-item label="专业："> {{ form.discipline }}</el-form-item>
                        <el-form-item label="电话：">
                            <el-input v-model="form.phone" style="width: 40%"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱：">
                            <el-input v-model="form.email" style="width: 40%"></el-input>
                        </el-form-item>
                        <el-form-item label="备注：">
                            <el-input v-model="form.remark"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">保存</el-button>
                            <el-button type="primary" @click="addVisible = true">修改密码</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
            <vue-cropper ref="cropper" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage"
                         style="width: 100%; height: 400px"></vue-cropper>

            <template #footer>
                <span class="dialog-footer">
                    <el-button class="crop-demo-btn" type="primary">选择图片
                        <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                    </el-button>
                    <el-button type="primary" @click="saveAvatar">上传并保存</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 弹出框 -->
        <el-dialog title="修改密码" v-model="addVisible" width="30%">
            <el-form label-width="30%" :model="param" :rules="rules" ref="formRef">
                <el-form-item label="旧密码：" prop="oldPassword">
                    <el-input type="password" v-model="param.oldPassword" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newPassword">
                    <el-input type="password" v-model="param.newPassword" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="confirmPassword">
                    <el-input type="password" v-model="param.confirmPassword" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmPassword">确认修改</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {reactive, ref} from "vue";
    import VueCropper from "vue-cropperjs";
    import "cropperjs/dist/cropper.css";
    import avatar from "../assets/img/img.jpg";
    import axios from "axios";
    import {ElMessage} from "element-plus";
    import {useRouter} from "vue-router";

    export default {
        name: "user",
        components: {
            VueCropper,
        },
        data(){
          return{
              rules:{
                  oldPassword: [
                      {required: true,  message: '请输入密码', trigger: 'blur'},
                      {min: 1, message: '请输入密码', trigger: 'blur'},
                      {max: 16, message: '密码最长16个字符', trigger: 'blur'}
                  ],
                  newPassword: [
                      {required: true,  message: '请输入新密码', trigger: 'blur'},
                      {min: 8, message: '密码最短8个字符', trigger: 'blur'},
                      {max: 16, message: '密码最长16个字符', trigger: 'blur'}
                  ],
                  confirmPassword: [
                      {required: true, message: '再次输入新密码', trigger: 'blur'},
                      {min: 8, message: '密码最短8个字符', trigger: 'blur'},
                      {max: 16, message: '密码最长16个字符', trigger: 'blur'}
                  ]
              },
              param:{
                  oldPassword:"",
                  newPassword:"",
                  confirmPassword:""
              },
              addVisible:false,
          }
        },
        methods:{
            logout(){
                axios.post('http://localhost:8762/admin/base/logout',{
                },{
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then( res =>{
                        if (res.data.code != 1000){
                            ElMessage.error(res.data.message);
                        }else {
                            ElMessage.success("修改密码后需重新登录");
                        }
                    }
                )
            },
            confirmPassword(){
                let checked = false;
                this.$refs['formRef'].validate((valid) => {
                    checked = valid;
                });
                if (checked === false){
                    return;
                }
                axios.post('http://localhost:8762/admin/base/updatePassword', {
                    oldPassword:this.param.oldPassword,
                    newPassword:this.param.newPassword,
                    confirmPassword:this.param.confirmPassword
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
                        ElMessage.success(res.data.message);
                        this.addVisible = false;
                        this.logout();
                        this.$router.push("/login");
                    }
                })
            }
        },
        setup() {
            const form = reactive({
                id: JSON.parse(sessionStorage.getItem("myInfo")).id,
                stuNo: localStorage.getItem("ms_username"),
                realName: JSON.parse(sessionStorage.getItem("myInfo")).realName,
                college: JSON.parse(sessionStorage.getItem("myInfo")).college,
                discipline: JSON.parse(sessionStorage.getItem("myInfo")).discipline,
                userName: JSON.parse(sessionStorage.getItem("myInfo")).userName,
                phone: JSON.parse(sessionStorage.getItem("myInfo")).phone,
                email: JSON.parse(sessionStorage.getItem("myInfo")).email,
                remark: JSON.parse(sessionStorage.getItem("myInfo")).remark,
            });
            const onSubmit = () => {
                console.log(JSON.stringify(form));
                axios.post('http://localhost:8762/admin/base/updateMyInfo', {
                    userName: form.userName,
                    phone: form.phone,
                    email: form.email,
                    remark: form.remark,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.code != 1000){
                        if (res.data.code === 999){
                            ElMessage.error(res.data.message);
                            router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    }else{
                        sessionStorage.setItem("myInfo", JSON.stringify(form));
                        ElMessage.success(res.data.message)
                    }
                })
            };

            const avatarImg = ref(avatar);
            const imgSrc = ref("");
            const cropImg = ref("");
            const dialogVisible = ref(false);
            const cropper = ref(null);

            const showDialog = () => {
                dialogVisible.value = true;
                imgSrc.value = avatarImg.value;
            };

            const setImage = (e) => {
                const file = e.target.files[0];
                if (!file.type.includes("image/")) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    dialogVisible.value = true;
                    imgSrc.value = event.target.result;
                    cropper.value && cropper.value.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            };

            const cropImage = () => {
                cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
            };

            const saveAvatar = () => {
                avatarImg.value = cropImg.value;
                dialogVisible.value = false;
            };

            return {
                name,
                form,
                onSubmit,
                cropper,
                avatarImg,
                imgSrc,
                cropImg,
                showDialog,
                dialogVisible,
                setImage,
                cropImage,
                saveAvatar,
            };
        },
    };
</script>

<style scoped>
    .info {
        text-align: center;
        padding: 35px 0;
    }

    .info-image {
        position: relative;
        margin: auto;
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 50px;
        overflow: hidden;
    }

    .info-image img {
        width: 100%;
        height: 100%;
    }

    .info-edit {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .info-edit i {
        color: #eee;
        font-size: 25px;
    }

    .info-image:hover .info-edit {
        opacity: 1;
    }

    .info-name {
        margin: 15px 0 10px;
        font-size: 24px;
        font-weight: 500;
        color: #262626;
    }

    .crop-demo-btn {
        position: relative;
    }

    .crop-input {
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>
