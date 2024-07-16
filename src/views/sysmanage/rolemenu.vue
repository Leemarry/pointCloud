<template>
  <el-container>
    <el-aside width="180px" v-loading="loadingAllRole">
      <div class="emptydata" v-if="roles===null || roles.length===0">
        <el-image :src="$toolUtil.getEmptyImage()" fit="fill"></el-image>
        <span style="margin-top:10px">暂无数据</span>
      </div>
      <el-scrollbar v-else wrap-style="overflow-x:hidden" style="width: 100%; height:100%;">
        <el-card v-for="(item) in roles" :key="item.roleId" shadow="hover" :gutter="3" :body-style=" { padding: '0px' }" class="cardBgGroup" @click.native="searchById(item)">
          <div class="itemRole">
            <!-- <svg-icon style="width:30px;height:30px;margin-top:5px" icon-class="uav_green" /> -->
            <!-- <h3>{{ item.roleId }}</h3> -->
            <h5>{{ item.roleName }}</h5>
            <svg-icon v-show="item.roleId==roleSelected" style="width:20px;height:20px;" icon-class="toright" />
          </div>
        </el-card>
      </el-scrollbar>
    </el-aside>
    <el-main :disabled="treeMenuEnbaled">
      <el-tree :check-strictly="checkStrictly" v-loading="loadingAllMenu" default-expand-all :data="menus" label="title" ref="treeMenu" show-checkbox node-key="menuId" :props="defaultProps" @check="checkChange" empty-text="未获取到菜单项，请刷新或重新进入！">
      </el-tree>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "Company",
  data() {
    return {
      loadingAllRole: false,
      loadingAllMenu: false,
      treeMenuEnbaled: false,
      checkStrictly: false, //父节点勾选后，子节点是否联动,false联动，true不联动
      roles: [],
      roleSelected: -1,
      defaultPropsRole: {
        children: 'children',
        label: 'roleName'
      },
      menus: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  computed: {
    message() {
      return "...";
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() { },
  onDestroy() { },
  methods: {
    async init() {
      // console.log('queryAllRole')
      await this.queryAllRole();
      // console.log('queryAllRole end')

      // console.log('queryMenus')
      await this.queryMenus();
      // console.log('queryMenus end')

      if (this.roles && this.roles.length > 0) {
        this.roleSelected = this.roles[0].roleId;
        this.queryMenusByRoleId()
      }
    },
    showToast(msg) {
      this.$layer.msg(msg);
    },
    showMessage(msg, type) {
      this.$message({ message: msg, type: type });
    },
    //查询角色
    async queryAllRole() {
      this.loadingAllRole = true;
      this.roleSelected = -1;
      await this.$store
        .dispatch("efUser/queryAllRole")
        .then((response) => {
          // console.log('queryAllRole response')
          this.loadingAllRole = false;
          const { code, message, data } = response
          if (code === 1) {
            if (data && data.length > 0) {
              this.roleSelected = data[0].roleId;
            }
            this.roles = data;
          } else {
            this.$message.error(message);
          }
        })
        .catch((error) => {
          this.loadingAllRole = false;
          this.$message.error(error);
        });
    },
    // 查看历史路径
    async searchById(item) {
      this.roleSelected = item.roleId;
      this.queryMenusByRoleId();
    },
    //查询所有菜单
    async queryMenus() {
      this.loadingAllMenu = true;
      this.roleSelected = -1;
      this.menus = [];
      await this.$store
        .dispatch("menu/queryAllMenu")
        .then((response) => {
          // console.log('queryMenus response')
          this.loadingAllMenu = false;
          const { code, message, data } = response
          if (code === 1) {
            this.menus = data;
          } else {
            this.$message.error(message);
          }
        })
        .catch((error) => {
          this.loadingAllMenu = false;
          this.$message.error(error);
        });
    },
    //根据角色查询菜单
    async queryMenusByRoleId() {
      this.loadingAllMenu = true;
      this.$refs.treeMenu.setCheckedKeys([]); // 全部不选中
      await this.$store
        .dispatch("menu/queryMenuByRoleId", { roleId: this.roleSelected })
        .then((response) => {
          this.loadingAllMenu = false;
          const { code, message, data } = response
          if (code === 1) {
            if (data && data.length > 0) {
              let checked = [];
              this.checkStrictly = true; // false联动，true不联动
              data.forEach(menu => {
                if (menu.menuId) {
                  checked.push(menu.menuId);
                }
              })
              // // console.log('需要选中的节点：' + checked.join(','))
              // this.$refs.treeMenu.setCheckedKeys(checked); //有值的选中
              // 
              // setTimeout(function () { that.checkStrictly = false; }, 1234);
              // // this.checkStrictly = false;  // false联动，true不联动
              let that = this;
              this.$nextTick(() => {
                that.$refs.treeMenu.setCheckedKeys(checked); //有值的选中
                setTimeout(function () {
                  that.checkStrictly = false // false联动，true不联动
                }, 2000)
              })
            }
          } else {
            this.$message.error(message);
          }
        })
        .catch((error) => {
          this.loadingAllMenu = false;
          this.$message.error(error);
        });
    },
    async checkChange(item, checkedNodesDes) {
      this.showToast("暂不支持修改！")
      // let checkedKeys = checkedNodesDes.checkedKeys;
      // let halfCheckedKeys = checkedNodesDes.halfCheckedKeys;
      // let menuIdArray = halfCheckedKeys.concat(checkedKeys).sort();
      // console.log('选中的菜单：', menuIdArray);
      // await this.updateMenuByRoleId(menuIdArray);
    },
    //修改角色菜单
    async updateMenuByRoleId(menuIdArray) {
      this.loadingAllMenu = true;
      try {
        await this.$store
          .dispatch("menu/updateMenuByRoleId", { roleId: this.roleSelected, checkList: menuIdArray })
          .then((response) => {
            this.loadingAllMenu = false;
            const { code, message, data } = response
            if (code === 1) {
              this.showToast(message)
            } else {
              this.$message.error(message);
            }
          })
          .catch((error) => {
            this.loadingAllMenu = false;
            this.$message.error(error);
          });
      } catch (error) {
        this.loadingAllMenu = false;
        this.$message.error("设置菜单权限失败！" + error);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.el-container {
  // background: blue;
  position: absolute;
  padding: 1px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.el-header {
  // background-color: #b3c0d1;
  color: #333;
  // text-align: center;
  // line-height: 20px;
  padding-top: 10px;
}

.el-main {
  // background:red;
  width: 100%;
  height: 100%;
  padding: 5px;
  flex: 1;
}
.emptydata {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: gray;
}
.itemRole {
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
