<template>
  <div id="bg">
    <div id="card">
      <el-card class="box-card">
        <div class="card-layout">
          <div id="card-right">
            <div class="right-top">
              <span style="color: aliceblue; font-size: 26px;font-weight:bold">智能无人机巡检</span>&nbsp;
              <span style="color: aliceblue; font-size: 20px" @click="uploadFiles({ fileType: 'orthoimg' , id : 0,reqUrl:'efapi/pointcloud/media/orthoimg/uploads' })">系统</span>
            </div>
            <div class="right-bouttom">
              <div style="text-align:center">
                <h2 @click="downimg">用户登陆</h2>
              </div>
              <div id="login-form">
                <el-form ref="loginForm" :model="loginForm" label-width="100px" :rules="loginRules">
                  <el-form-item prop="username">
                    <el-input ref="username" v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="请输入用户名" name="username" type="text" tabindex="1" auto-complete="on" @change="changeUsername" @keyup.enter.native="handelTab('password',$event)" />
                  </el-form-item>
                  <el-form-item prop="password" style="margin-bottom: 5px">
                    <!-- ref<< @paste.native.capture.prevent="handlePaste" -->
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model="loginForm.password"
                      style="width: 300px"
                      prefix-icon="el-icon-lock"
                      :type="passwordType"
                      placeholder="请输入密码"
                      name="password"
                      tabindex="2"
                      auto-complete="off"
                      @keyup.enter.native="beforeLogin()"
                      @click.native="clearPwd()"
                    />
                  </el-form-item>
                  <div style="margin-bottom: 25px;margin-top:20px;text-align:right">
                    <el-checkbox v-model="isRememberMe">记住用户名与密码</el-checkbox>
                  </div>
                  <el-form-item>
                    <el-button id="submitbutton" :loading="loading" type="primary" @click.native.prevent="beforeLogin()">登录</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div>
      <div id="copy">
        <a :underline="false" target="_blank" href="https://beian.miit.gov.cn/">
          鄂ICP备xxxx5
        </a>
        v1.0 版权所有 © 2025
      </div>
    </div>
  </div>
</template>
<script>
import { validUsername } from '@/utils/validate'
import Cookies from 'js-cookie'
import md5 from 'js-md5'
// import * as animationData from '../../../public/hive_flying.json'
import * as hiveFlyingData from '@/assets/lotties/hive_flying.json'
import * as uavFlyingData from '@/assets/lotties/uav_flying.json'
// import efdentify from '@/views/components/efidentify.vue'
import currencyMinins from '@/utils/currencyMinins'
var checkNameReg = (rule, value, callback) => { // 用户名限制
    if (!value) {
        return callback();
    }
    if (value) {
        setTimeout(() => {
            //var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{4,20}$/; // 中英文、数字、下划线!
            var reg = /^[a-z0-9_]{3,15}$/;
            if (!reg.test(value)) {
                callback(new Error('仅可为英文、数字、下划线!'));
            } else {
                callback();
            }
        }, 500);
    }
};
const checkPhone = (rule, value, callback) => {
    const reg = /^1[345789]\d{9}$/
    if (!reg.test(value)) {
        callback(new Error('请输入11位手机号'))
    } else {
        callback()
    }
}
const checkEmail = (rule, value, callback) => {
    const reg = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]/
    // let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (!reg.test(value)) {
        callback(new Error('请输入有效的邮箱'))
    } else {
        callback()
    }
}
export default {
    name: 'Login',
    components: {
        // efdentify
    },
    mixins: [currencyMinins],
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!validUsername(value)) {
                callback(new Error('请输入正确的用户名！'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码不能少于6个字符！'))
            } else {
                callback()
            }
        }
        return {
            flogo: require('../../assets/images/fiylogo.gif'),
            imagesrc: require('../../assets/images/bggrassland.jpg'),
            //
            isNeedMd5: true,
            isRememberMe: true,
            isRegisting: false,
            isUpdatePassword: false,
            loadingAuto: false,
            dialogVisible: false,
            dialogVisibleForgetPwd: false,
            isEnabledSendPhoneCode: false,
            timerSendPhoneCode: null,
            sendPhoneCodeText: '发送验证码',
            sendPhoneCodeTime: 60,
            identifyCode: '',
            webSocket: null,
            identifyCodes: '0123456789abcdwerwshdjeJKDHRJHKOOPLMKQ', //随便
            formRegist: {
                userid: '',
                username: '',
                userpwd1: '',
                userpwd2: '',
                userphone: '',
                phonecaptcha: '',
                email: '',
                imgcaptcha: ''
            },
            formGetPwd: {
                username: '',
                userpwd1: '',
                userpwd2: '',
                userphone: '',
                phonecaptcha: '',
                imgcaptcha: ''
            },
            hiveFlyingOptions: { animationData: hiveFlyingData.default },
            uavFlyingDataOptions: { animationData: uavFlyingData.default },
            loginForm: {
                username: '',
                password: ''
            },
            loginRules: {
                username:
          [{ required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 3, max: 20, message: '长度在 3 到 20 个字符' },
              { pattern: /^(\w){3,20}$/, message: '只能输入3-20个字符(字母、数字、下划线)' }],
                password:
          [{ required: true, message: '请输入密码', trigger: 'blur' },
              { min: 3, max: 50, message: '长度在 3 到 20 个字符' },
              { pattern: /^(\w){3,50}$/, message: '只能输入3-20个字符(字母、数字、下划线)' }]
                // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
                // password: [{ required: true, trigger: 'blur', validator: validatePassword }]
            },
            rulesformRegist: {
                userid: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },
                    // { pattern: /^(\w){3,20}$/, message: '请输入3-20个字母、数字、下划线' },
                    { validator: checkNameReg }
                ],
                username: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                userpwd1: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 5, max: 25, message: '长度在 5 到 25 个字符', trigger: 'blur' },
                    { pattern: /^(\w){5,25}$/, message: '请输入5-25个字母、数字、下划线' }
                ],
                userphone: [
                    { required: true, type: 'number', validator: checkPhone, message: '请填写正确的手机号码', trigger: 'blur' }
                ],
                phonecaptcha: [
                    { required: true, message: '请输入手机动态验证码', trigger: 'blur' },
                    { min: 2, max: 10, message: '手机动态验证码错误', trigger: 'blur' }
                ],
                email: [
                    { required: true, validator: checkEmail, message: '请填写正确的邮箱地址', trigger: 'blur' }
                ],
                imgcaptcha: [
                    { required: true, message: '请输入人机验证码', trigger: 'blur' },
                    { min: 1, max: 5, message: '人机验证码错误', trigger: 'blur' }
                ]
            },
            rulesformForget: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },
                    // { pattern: /^(\w){3,20}$/, message: '请输入3-20个字母、数字、下划线' },
                    { validator: checkNameReg }
                ],
                userpwd1: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 5, max: 25, message: '长度在 5 到 25 个字符', trigger: 'blur' },
                    { pattern: /^(\w){5,25}$/, message: '请输入5-25个字母、数字、下划线' }
                ],
                userphone: [
                    { required: true, type: 'number', validator: checkPhone, message: '请填写正确的手机号码', trigger: 'blur' }
                ],
                phonecaptcha: [
                    { required: true, message: '请输入手机动态验证码', trigger: 'blur' },
                    { min: 2, max: 10, message: '手机动态验证码错误', trigger: 'blur' }
                ],
                imgcaptcha: [
                    { required: true, message: '请输入人机验证码', trigger: 'blur' },
                    { min: 1, max: 5, message: '人机验证码错误', trigger: 'blur' }
                ]
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined
        }
    },
    watch: {
        $route: {
            handler: function(route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        if (this.webSocket !== null) {
            console.log('断开与服务器的连接！')
            try {
                this.webSocket.destroy()
            } catch (error) {
                console.log('断开与服务器的连接失败！');
            }
            this.webSocket = null
        }
        if (this.timerSendPhoneCode && this.timerSendPhoneCode !== null) {
            clearInterval(this.timerSendPhoneCode);
        }
    },
    methods: {
        downimg() {
            this.$store.dispatch('media/downimg').then(res => {
            }).catch(error => {
                console.log('sss', error);
            })
        },
        async init() {
            this.isrememberMe = this.getCookieBool('efuav_remember', true)
            this.loginForm.username = this.getCookieString('efuav_uavname', '')
            this.loginForm.password = this.getCookieString('efuav_password', '')
            if (this.isrememberMe) {
                if (this.loginForm.username !== '' && this.loginForm.password !== '') {
                    this.isNeedMd5 = false
                }
            } else {
                this.loginForm.password = ''
            }
            const from = this.getUrlKey('from')
            const userencryption = this.getUrlKey('user')
            if (from && userencryption) {
                // console.log('from = ', from)
                // console.log('user =', decodeURIComponent(userencryption))
                await this.handleLoginAuth(from, decodeURIComponent(userencryption))
            }
            if (navigator && navigator.onLine === false) {
                this.showToast('未连接网络！')
            }
            // if (!TcAdapter.isSupported()) {
            //   this.showMessage('请注意，当前浏览器不支持零延时实时视频播放！')
            // }
        },
        // 说明：lottie初始化时，需要指定一个options配置项，因为lottie是没有宽高的，所以宽高必须设置，animCreated方法用于创建lottie动画，它的方法返回一个anim对象，里面包含这个动画的所有属性。我们可以根据它返回的这个对象，来对lottie动画做一系列的控制
        handleAnimation(anim) {
            // this.anim = anim
            // console.log(anim); // 这里可以看到 lottie 对象的全部属性
        },
        showToast(msg) {
            this.$layer.msg(msg)
        },
        showMessage(msg, type) {
            this.$message({ message: msg, type: type })
        },
        getUrlKey(name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
        },
        getUrlParms(name) {
            const href = location.href
            const parmsIndex = href.indexOf('?')
            const parms = href.substring(parmsIndex, href.length)
        },
        getCookieString(key, defaultStr) {
            const temp = Cookies.get(key)
            if (temp) {
                defaultStr = temp
            }
            return defaultStr
        },
        getCookieBool(key, defaultBool) {
            const temp = Cookies.get(key)
            if (temp) {
                if (temp.toLowerCase() === 'true') {
                    defaultBool = true
                } else {
                    defaultBool = false
                }
            }
            return defaultBool
        },
        changeUsername() {
            this.clearPwd()
        },
        clearPwd() {
            this.isNeedMd5 = true
            this.loginForm.password = ''
        },
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        beforeLogin() {
            // setToken("logined")
            // this.$router.push({ path: this.redirect || '/index' })

            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.handleLogin()
                } else {
                    return false
                }
            })
        },
        async handleLogin() {
            this.loading = true
            const userinfo = new FormData();
            userinfo.append('userId', this.loginForm.username);
            // this.isNeedMd5 =false;
            if (this.isNeedMd5) {
                userinfo.append('userPwd', md5(this.loginForm.password)); // f5d1278e8109edd94e1e4197e04873b9
            } else {
                userinfo.append('userPwd', this.loginForm.password);
            }
            // console.log( this.loginForm.password); /// e605cbddb5b1d43b6e0529608179ec6d
            // 调用的是src/store/modules中的login方法
            await this.$store.dispatch('user/login', userinfo).then(() => {
                if (this.isRememberMe) {
                    Cookies.set('efuav_uavname', userinfo.get('userId'))
                    Cookies.set('efuav_password', userinfo.get('userPwd'))
                }
                Cookies.set('efuav_remember', this.isRememberMe)
                this.$router.push({ path: this.redirect || '/index' })
                console.log('登录成功');
                const data = { id: '101', token: this.$store.getters.token }
                this.$store.dispatch('ws/onopenWebSocket', data)
                this.loading = false
                this.clearRoute()
            }).catch((message) => {
                Cookies.set('efuav_password', '')
                this.showToast(message);
                // this.$message({ message: message, type: 'warning' })
                this.loading = false
            })
        },
        clearRoute() {
            this.$store.dispatch('routeData/setRouteData', { mid: null, geoCoordinates: [], unifiedHeight: null }); // 存储store
        },
        async handleLoginAuth(from, userencryption) {
            this.loading = true
            this.loadingAuto = true
            try {
                await this.$store.dispatch('user/login', { UserId: userencryption, type: from }).then(() => {
                    this.$router.push({ path: this.redirect || '/index' })
                    this.loading = false
                    this.loadingAuto = false
                }).catch((message) => {
                    this.$message({ message: message, type: 'warning' })
                    this.loading = false
                    this.loadingAuto = false
                })
            } catch (message) {
                this.loading = false
                this.loadingAuto = false
                this.$message({ message: message, type: 'error' })
            }
        },

        handelTab(i, e) {
            const that = this
            if (that.$refs[i]) {
                that.$nextTick(() => {
                    e.target.blur()
                    that.$refs[i].focus()
                })
            }
        },

        submitRegistForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.registUser()
                } else {
                    return false;
                }
            });
        },
        submitForgetForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.forgetPassword()
                } else {
                    return false;
                }
            });
        },
        async registUser() {
            if (this.identifyCode.toLowerCase() !== this.formRegist.imgcaptcha.toLowerCase()) {
                this.showMessage('图像验证码错误!', 'warning')
                return
            }
            if (this.formRegist.userpwd1 !== this.formRegist.userpwd2) {
                this.showMessage('输入密码不一致，请重新输入!', 'warning')
                return
            }
            const user = {
                loginName: this.formRegist.userid,
                userName: this.formRegist.username,
                loginPwd: md5(this.formRegist.userpwd1),
                confirmPwd: md5(this.formRegist.userpwd2),
                phone: this.formRegist.userphone,
                phoneCode: this.formRegist.phonecaptcha,
                email: this.formRegist.email
            };
            this.isRegisting = true;
            await this.$store.dispatch('user/register', user).then((response) => {
                this.isRegisting = false;
                const { code, message } = response
                if (code == 1) {
                    this.dialogVisible = false;
                    this.showToast(message)
                } else {
                    this.showMessage(message, 'warning');
                }
            }).catch((message) => {
                this.isRegisting = false;
                this.$message({ message: message, type: 'warning' })
            })
        },
        resetRegistForm(formName) {
            try {
                this.$refs[formName].resetFields();
            } catch (error) {
            }
        },
        refreshCode() { //
            this.identifyCode = '';
            this.makeCode(this.identifyCodes, 4);
        },
        randomNum(min, max) {
            max = max + 1
            return Math.floor(Math.random() * (max - min) + min)
        },
        // 随机生成验证码字符串
        makeCode(data, len) {
            this.identifyCode = '';
            for (let i = 0; i < len; i++) {
                this.identifyCode += data[this.randomNum(0, data.length - 1)]
            }
        }
    }
}
</script>

  <!-- //css -->
  <style scoped>
#bg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  /* background-image: url(https://img.zcool.cn/community/01b97655683aa40000012b205d0020.jpg@2o.jpg); */
  /* background-image: url("../../assets/images/bgwater.jpg"); */
  background: url("../../assets/images/bggrassland.jpg") no-repeat center center
    fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  /* background-size: 100%; */
}

#logo {
  z-index: 9999;
  /* color: aliceblue; */
  font-size: 25px;
  font-weight: 800;
  text-transform: uppercase;
  position: absolute;
  left: 15%;
  width: 15%;
  top: 20%;
  /*top: 20%;*/
}

#card {
  width: 60%;
  /* height: 75%; */
  bottom: 10%;
  position: absolute;
  left: 20%;
}

.card-layout {
  display: flex;
  height: 650px;
  justify-content: center;
  align-content: center;
}

#card-left {
  width: 60%;
}

#card-right {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}

.right-top {
  /* margin-top: 50px; */
  /* mix-blend-mode: difference; */
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
}

.right-bouttom {
  background-color: rgb(255, 255, 255);
  padding: 50px 40px 50px 40px;
  margin-top: 20px;
  border-radius: 10px;
}

#login-form {
  position: relative;
  right: 45px;
}

.botton-first {
  margin-top: 200px;
}

.botton {
  margin: 10px;
  width: 85%;
}

.el-card {
  border-radius: 3%;
  width: 100%;
  /* width: 373px; */
  /* height: 210px; */
  /* background-color: rgba(0.1, 204, 255, 255); */
  background-color: transparent;
  border: 0px;
}

#form {
  padding-bottom: 15px;
  line-height: 60px;
}

#copy {
  color: rgb(61, 87, 152);
  position: absolute;
  bottom: 5%;
  left: 800px;
  /* left: 0;
    right: 0; */
}

#submitbutton {
  width: 100%;
}
</style>
