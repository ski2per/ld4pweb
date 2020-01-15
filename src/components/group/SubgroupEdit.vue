<template>
<v-dialog v-model="dialog" persistent max-width="800px">

  <v-card>
    <v-card-title>
      <span class="headline">编辑 {{group.ou}}/{{subgroup.cn}} 成员</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <!--User Addition-->
        <v-row>
          <v-col>
            <userlist-mini ref="userMini"
              v-on:selected="handleSelectedEvent($event)"
            ></userlist-mini>
          </v-col>
          <v-col>
            <template v-if="!selected.length">
              <h4><- 选择要加入的用户</h4>
            </template>
            <template v-else>
              <div v-for="item in selected" :key="item.uid">
                {{ item.cn}}
              </div>
            </template>
          </v-col>
          <v-col>
          <subgroup-members ref="sgMembers" v-bind="{group: this.group.ou, subgroup: this.subgroup.cn}"></subgroup-members>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="reset" :disabled="!valid">Cancel</v-btn>
      <v-btn color="green darken-1" text @click="validate">OK</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>

<script>
import UserListMini from '@/components/user/UserListMini.vue'
import SubgroupMembers from '@/components/group/SubgroupMembers.vue'

export default {
  components: {
    'userlist-mini': UserListMini,
    'subgroup-members': SubgroupMembers,
  },
  data () {
    return {
      group: Object,
      subgroup: Object,

      notification: {
        msg: '',
        color: '',
      },
      dialog: false,
      valid: true,
      edited: false,
      selected: [],
      //Record last cn，invoke maillist update API when value changing
      lastCN: "",
      editedItem: {
        cn: '',
        mail: '',
      },
      defaultItem: {
        cn: '',
        mail: '',
      },
      rules: {
        required: value => !!value || '不能为空',
      },
    }
  },
  mounted() {
    console.log('[SubgroupEdit.vue: mounted()]')
  },
  created() {
    console.log('[SubgroupEdit.vue: created()]')
  },
  methods: {
    handleSelectedEvent(data) {
      this.selected = data
    },
    filterList(li) {
      // Create a new
      let newArr = []
      li.forEach((item, index) => {
        newArr[index] = item.cn
      })
      return newArr
    },
    reset () {
      this.dialog = false
      this.edited = false
      this.editedItem = this.defaultItem
      this.selected = []
      this.$refs.userMini.selectedUsers = []
      this.notification= {msg: "", color: ""}
    },
    validate () {
      this.valid = false
      if(this.$refs.maillistForm.validate()) {
        if (this.edited) {
          this.modify()
        } else {
          this.create()
        }
      }
      this.valid = true
    },
    modify () {
      const mlMember = this.filterList(this.$refs.userMicro.members)
      const maillistName = this.editedItem.mail.split('@')[0]

      // NEED optimize later
      if((this.lastCN == this.editedItem.cn) && (! this.selected.length)) {
        this.reset()
      } else {
        // Detect whether cn value changed
        if(this.lastCN != this.editedItem.cn) {
          this.$store.dispatch('mlst/updateMaillist', {maillist: maillistName, cn: this.editedItem.cn})
          this.reset()
        }

        if (this.selected.length) {
          // Update maillist member
          let members = []
          this.selected.forEach((item, index) => {
            // 过滤掉重复选择的用户
            if (mlMember.indexOf(item.cn) == -1) {
              members.push(item)
            }
          })//forEach
          this.$store.dispatch('mlst/addUser2Maillist', {maillist: maillistName, members: members})
          this.reset()
        }
      }
    },
    create () {
      const data = {
        cn: this.editedItem.cn,
        mail: this.editedItem.mail,
        members: this.selected,
      }
      // Add new maillist
      this.$store.dispatch('mlst/createMaillist', data)
      this.reset()
    }, 
  }//methods(),
}
</script>