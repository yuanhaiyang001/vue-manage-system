<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-read"></i> 添加字典
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <span>新增数据字典</span><br><br>
            <div class="form-box">
                <el-form ref="formRef" label-width="130px" :model="dictData" :rules="rules">
                    <el-form-item label="类型：" prop="type">
                        <el-input v-model="dictData.type"></el-input>
                    </el-form-item>
                    <el-form-item label="code：" prop="code">
                        <el-input v-model="dictData.code"></el-input>
                    </el-form-item>
                    <el-form-item label="键值" prop="value">
                        <el-input v-model="dictData.value"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="describe">
                        <el-input type="textarea" rows="4" v-model="dictData.describe"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <span style="font-size: small; color: #00a854">tips：添加字典后，退出重新登录方可生效</span>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import {ElMessage} from "element-plus";

    export default {
        name: "addDict",
        data() {
            return {
                valid : false,
                dictData: {
                    type: '',
                    code: '',
                    value: '',
                    describe: '',
                },
                rules: {
                    type: [
                        {required: true, message: '请输入字典类型', trigger: 'blur'},
                        {min: 2, message: '长度最短为2个字符', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入字典code', trigger: 'blur'},
                        {min: 2, message: '长度最短为2个字符', trigger: 'blur'}
                    ],
                    value: [
                        {required: true, message: '请输入键值', trigger: 'blur'},
                        {min: 2, message: '长度最短为2个字符', trigger: 'blur'}
                    ]
                }
            }

        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    this.valid = valid;
                });
            },
            onSubmit() {
                this.submitForm('formRef');
                if (this.valid === true){
                    console.log(this.dictData)
                }
                axios.post('http://localhost:8762/common/saveDict',{
                    code: this.dictData.code,
                    value: this.dictData.value,
                    type: this.dictData.type,
                    describe: this.dictData.describe
                },{
                    headers: {
                        authorization: localStorage.getItem("token"),
                    }
                }).then(res =>{
                    console.log(res.data);
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        ElMessage.success(res.data.message);
                        this.onReset();
                    }
                })
            },
            onReset() {
                this.dictData.code = '';
                this.dictData.type = '';
                this.dictData.value = '';
                this.dictData.describe = '';
            }
        }
    }
</script>

<style scoped>

</style>
