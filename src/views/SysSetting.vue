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
                <el-form ref="formRef" label-width="130px">
                    <el-form-item label="禁止用户登录" prop="allowLogin">
                        <el-switch v-model="allowLogin"></el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">表单提交</el-button>
                        <el-button @click="onReset">重置表单</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {reactive, ref} from "vue";

    export default {
        name: "SysSetting",
        data() {
            return {
                allowLogin: false,
            }
        },
        mounted() {

        },
        methods: {}

    }
</script>

<style scoped>

</style>
