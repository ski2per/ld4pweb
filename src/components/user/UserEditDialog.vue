<template>
<v-dialog v-model="dialog"
  fullscreen
  hide-overlay
  transition="dialog-bottom-transition"
>

  <v-card>
    <v-app-bar
      color="green"
      dark
    >
      {{title}}
      <v-spacer></v-spacer>
      <v-btn color="white" icon @click="reset" :disabled="!valid">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn color="white" icon @click="validate">
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </v-app-bar>

    <v-card-text class="pa-0">
      <v-container class="py-0">
        <v-row>
          <!--User info(left)-->
          <v-col>
            <v-form ref="userForm">
              <v-text-field v-model="editedItem.cn" label="Name(建议中文名)"
                :rules="[rules.required]"
              ></v-text-field>
              <v-text-field v-model="editedItem.uid" label="UserID(中文全拼)" :disabled="edited"
                :rules="[rules.required]"
              ></v-text-field>
              <v-text-field v-if="edited" v-model="editedItem.mail" label="Email" disabled></v-text-field>
              <v-text-field v-model="editedItem.sn" label="姓(Surname)"
                :rules="[rules.required]"
              ></v-text-field>
              <v-text-field v-model="editedItem.givenName" label="名(Given name)"></v-text-field>
              <v-select
                v-model="editedItem.accountType"
                :items='accountType'
                label="账号类型"
                :disabled="edited"
              ></v-select>
              <v-checkbox 
                label="管理员"
                v-model="editedItem.admin"
                :input-value="editedItem.admin"
              ></v-checkbox>
            </v-form>
          </v-col>

          <!--Group selectedGroup(right)-->
          <v-col v-if="!edited">
            加入用户组:
            <v-divider></v-divider>
            <v-treeview
              v-model="selectedGroup"
              selectedGroup-type="leaf"
              :items="this.$store.state.grp.groupTree"
              item-disabled="locked"
              selectable
              dense
              return-object
            ></v-treeview>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

  </v-card>
</v-dialog>

</template>

<script>
export default {
  data () {
    return {
      accountType: [
        {'text': '用户账号', 'value': 'user'},
        {'text': '功能账号', 'value': 'util'}
      ],
      dialog: false,
      valid: true,  
      groups: [],
      selectedGroup: [],
      edited: false,
      editedItem: {
          uid: '',
          cn: '',
          mail: '',
          sn: '',
          givenName: '',
          accountType: 'user',
          admin: false,
      },
      defaultItem: {
          uid: '',
          cn: '',
          mail: '',
          sn: '',
          givenName: '',
          accountType: 'user',
          admin: false,
      },
      rules: {
        required: value => !!value || '不能为空',
      },
    }
  },
  computed: {
    title() {
      return this.edited ? '编辑' : '创建用户'
    },
  },
  methods: {
    reset() {
      this.dialog = false
      this.edited = false
      this.editedItem = this.defaultItem
      this.selectedGroup = []
    },
    validate () {
      this.valid = false
      if(this.$refs.userForm.validate()) {
        this.save()
      }
      this.valid = true
    },
    save () {
      const data = {
        uid: this.editedItem.uid,
        cn: this.editedItem.cn,
        sn: this.editedItem.sn,
        givenName: this.editedItem.givenName,
        admin: this.editedItem.admin
      }

      if (this.edited) {
        // 后期增加: 如果未修改则不提交
        this.$store.dispatch('usr/updateUser', data)
      } else {
        // Add new user
        this.$store.dispatch('usr/createUser', data)
        // WILL refactor later~~~~
        this.massiveAddToGroup(this.selectedGroup)
      }
      this.reset()
    }, //save()
    massiveAddToGroup (groupData) {
      console.log("[massiveAddToGroup()] heavy operation")
      // Need refactor
      groupData.forEach((item, index) => {
        // Think I will put sleep or something here ;P
        // this.$store.dispatch('grp/add2Group', {pgroup: item.pgroup, group: item.name, uid: this.editedItem.uid})
        this.$store.dispatch('grp/add2Group', {pgroup: "xl", group: item.name, uid: this.editedItem.uid})
        .then(response => {
          if(response && response.status == 200) {
            // console.log(`Add ${this.editedItem.uid} to ${item.pgroup}/${item.name} success`)
            console.log(`Add ${this.editedItem.uid} to ${item.name} success`)

            // 新建用户添加到指定组成功之后同步邮件列表
            this.$store.dispatch('mlst/syncMaillist')
          }
        })
        .catch(error => { console.log(error) })
      })

    }
  }//methods(),
}
</script>

<style scoped>
.green-text {
  color: green;
}
</style>