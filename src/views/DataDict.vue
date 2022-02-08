<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-read"></i> 数据字典
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <span>新增数据字典</span><br><br>
            <div class="form-box">
                <el-form ref="formRef" label-width="130px">
                    <el-form-item label="类型：" prop="allowLogin">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="code：" prop="allowLogin">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="键值" prop="allowLogin">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="allowLogin">
                        <el-input type="textarea" rows="4"></el-input>
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
    export default {
        name: "DataDict"
    }
</script>

<style scoped>

</style>
