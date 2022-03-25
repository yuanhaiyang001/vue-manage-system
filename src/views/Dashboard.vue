<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../assets/img/img.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ username }}</div>
                            <div class="user-info-name">{{ role }}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>{{loginDate}}</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>成都</span>
                    </div>
                </el-card>
<!--                <el-card shadow="hover" style="height:252px;">-->
<!--                    <template #header>-->
<!--                        <div class="clearfix">-->
<!--                            <span>语言详情</span>-->
<!--                        </div>-->
<!--                    </template>-->
<!--                    Vue-->
<!--                    <el-progress :percentage="71.3" color="#42b983"></el-progress>JavaScript-->
<!--                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>CSS-->
<!--                    <el-progress :percentage="13.7"></el-progress>HTML-->
<!--                    <el-progress :percentage="5.9" color="#f56c6c"></el-progress>-->
<!--                </el-card>-->
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-user-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{topData.userCount}}</div>
                                    <div>用户数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-s-order grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{topData.serviceCount}}</div>
                                    <div>服务消息</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-tickets grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{topData.annCount}}</div>
                                    <div>公告消息</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;">
                    <template #header>
                        <div class="clearfix">
                            <span>待办事项</span>
                            <el-button @click="addVisible = true" style="float: right; padding: 3px 0" type="text">添加</el-button>
                        </div>
                    </template>

                    <el-table :show-header="false" :data="todoList" style="width:100%;">
                        <el-table-column width="40">
                            <template #default="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template #default="scope">
                                <div class="todo-item" :class="{
                                        'todo-item-del': scope.row.status,
                                    }">{{ scope.row.title }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template>
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="添加" v-model="addVisible" width="50%">
            <el-form label-width="10%" :model="upcoming" :rules="rules" ref="formRef">
                <el-form-item label="待办：" prop="serviceName">
                    <el-input v-model="upcoming" style="width: 100%"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUpcoming">确 定</el-button>
                </span>
            </template>
        </el-dialog>
<!--        <el-row :gutter="20">-->
<!--            <el-col :span="12">-->
<!--                <el-card shadow="hover">-->
<!--                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>-->
<!--                </el-card>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--                <el-card shadow="hover">-->
<!--                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>-->
<!--                </el-card>-->
<!--            </el-col>-->
<!--        </el-row>-->
    </div>
</template>

<script>
import Schart from "vue-schart";
import { reactive } from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import axios from "axios";

export default {
    name: "dashboard",
    components: { Schart },

    setup() {
        const identityType = JSON.parse(sessionStorage.getItem("myInfo")).identityType;
        const role = identityType === "0" ? "超级管理员" : identityType === "1" ? "宿舍管理员" : identityType === "3" ? "第三方服务提供商":"其他";
        const username = JSON.parse(sessionStorage.getItem("myInfo")).userName;
        const loginDate = JSON.parse(sessionStorage.getItem("myInfo")).loginDate;
        const data = reactive([
            {
                name: "2018/09/04",
                value: 1083,
            },
            {
                name: "2018/09/05",
                value: 941,
            },
            {
                name: "2018/09/06",
                value: 1139,
            },
            {
                name: "2018/09/07",
                value: 816,
            },
            {
                name: "2018/09/08",
                value: 327,
            },
            {
                name: "2018/09/09",
                value: 228,
            },
            {
                name: "2018/09/10",
                value: 1065,
            },
        ]);
        const options = {
            type: "bar",
            title: {
                text: "最近一周各品类销售图",
            },
            xRorate: 25,
            labels: ["周一", "周二", "周三", "周四", "周五"],
            datasets: [
                {
                    label: "家电",
                    data: [234, 278, 270, 190, 230],
                },
                {
                    label: "百货",
                    data: [164, 178, 190, 135, 160],
                },
                {
                    label: "食品",
                    data: [144, 198, 150, 235, 120],
                },
            ],
        };
        const options2 = {
            type: "line",
            title: {
                text: "最近几个月各品类销售趋势图",
            },
            labels: ["6月", "7月", "8月", "9月", "10月"],
            datasets: [
                {
                    label: "家电",
                    data: [234, 278, 270, 190, 230],
                },
                {
                    label: "百货",
                    data: [164, 178, 150, 135, 160],
                },
                {
                    label: "食品",
                    data: [74, 118, 200, 235, 90],
                },
            ],
        };
        const todoList = reactive([
            {
                title: "处理新生信息",
                status: true,
            },
            {
                title: "处理毕业生信息",
                status: true,
            },
            {
                title: "审核事务",
                status: false,
            },
            {
                title: "反馈投诉",
                status: false,
            },
        ]);

        return {
            username,
            data,
            options,
            options2,
            todoList,
            role,
            loginDate,
        };
    },

    data() {
        return {
            rules: {
                upcoming: [
                    {required: true, message: '请输入待办事项', trigger: 'blur'},
                    {min: 1, message: '长度最短为2个字符', trigger: 'blur'},
                    {max: 40, message: '长度最长为40个字符', trigger: 'blur'}
                ],
            },
            upcoming:"",
            addVisible:false,
            topData: reactive({
                userCount: 0,
                serviceCount: 0,
                annCount: 0,
            })
        }
    },

    mounted() {
        this.getTopData();
    },

    methods: {
        addUpcoming(){
            let check = false;
            this.$refs["formRef"].validate((valid) => {
                check = valid;
            });
            if(check === false){
                return;
            }
            this.todoList.push({
                title: this.upcoming,
                status: false,
            });
            this.upcoming = "";
            this.addVisible = false;
        },
        //用户、服务消息、公告消息数量统计
        getTopData(){
            //用户数量
            axios.post('http://www.hiyang.top:8762/common/userCount', {
            }, {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            }).then(res => {
                if (res.data.code != 1000) {
                    if (res.data.code === 999) {
                        ElMessage.error(res.data.message);
                        router.push("/login");
                    }
                    ElMessage.error(res.data.message);
                    return false;
                } else {
                    this.topData.userCount = res.data.data
                }
            });
            //服务消息
            axios.post('http://www.hiyang.top:8762/common/serviceInfoCount', {
            }, {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            }).then(res => {
                if (res.data.code != 1000) {
                    if (res.data.code === 999) {
                        ElMessage.error(res.data.message);
                        router.push("/login");
                    }
                    ElMessage.error(res.data.message);
                    return false;
                } else {
                    this.topData.serviceCount = res.data.data
                }
            });
            //公告消息
            axios.post('http://www.hiyang.top:8762/common/annCount', {
            }, {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            }).then(res => {
                if (res.data.code != 1000) {
                    if (res.data.code === 999) {
                        ElMessage.error(res.data.message);
                        router.push("/login");
                    }
                    ElMessage.error(res.data.message);
                    return false;
                } else {
                    this.topData.annCount = res.data.data
                }
            });
        },


    },
};
</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
