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
      编辑 {{group.ou}}/{{subgroup.cn}} 成员
      <v-spacer></v-spacer>
      <v-btn color="white" icon @click="reset" :disabled="!valid">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn color="white" icon @click="update">
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </v-app-bar>

    <v-card-text>
      <v-container>
        <!--User Addition-->
        <v-row>
          <v-col>
            <template v-if="!selected.length">
              <h4>选择要加入的用户</h4>
            </template>
            <template v-else>
              <div style="color: green;" v-for="item in selected" :key="item.uid">
                {{ item.cn}}
              </div>
            </template>
          </v-col>
          <!--
          !!! 通过v-if触发条件渲染，保证v-dialog每次打开时都对SubgroupMembers.vue进行创建，
          也就是能触发created() hook
              v-bind="{group: this.group.ou, subgroup: this.subgroup.cn}"
          -->
          <v-col v-if="dialog">
            <subgroup-members
              ref="sgMembers"
              :group="this.group.ou"
              :subgroup="this.subgroup.cn"
            ></subgroup-members>
          </v-col>
        </v-row>
        <v-row>
          <!-- Desktop -->
          <v-col cols="6" class="hidden-xs-only">
            <userlist-mini ref="userMini" :noPerPage="10"
              v-on:selected="handleSelectedEvent($event)"
            ></userlist-mini>
          </v-col>
          <!-- Mobile -->
          <v-col class="hidden-sm-and-up">
            <userlist-mini ref="userMini" :noPerPage="10"
              v-on:selected="handleSelectedEvent($event)"
            ></userlist-mini>
          </v-col>
        </v-row>

      </v-container>
    </v-card-text>

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
      this.valid = true
      this.selected = []
      this.$refs.userMini.selectedUsers = []
    },
    update() {
      this.valid = false
      const currentMembers = this.filterList(this.$refs.sgMembers.members)
      // const maillistName = this.editedItem.mail.split('@')[0]

      // NEED optimize later
      if (this.selected.length) {
        // Update maillist member
        let realMember2add = []
        this.selected.forEach((item, index) => {
          // 过滤掉重复选择的用户
          if (currentMembers.indexOf(item.cn) == -1) {
            realMember2add.push(item)
          }
        })//forEach
        let payload = {
          group: this.group.ou,
          subgroup: this.subgroup.cn,
          members: realMember2add
        }
        this.$store.dispatch('grp/addSubgroupMember', payload)
      }
      this.reset()
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

<style scoped>
.green-text {
  color: green;
}
</style>
