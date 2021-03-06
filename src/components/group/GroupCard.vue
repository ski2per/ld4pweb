<template>
<!--Normal Card-->
<v-card v-if="!group.edited"
  class="mx-auto"
  :min-width="cardWidth"
  :max-width="cardWidth"
>
  <v-card-title
    style="color:green;"
  >{{ group.ou }}</v-card-title>
  <v-card-subtitle v-if="groupEdited">
    <v-text-field
      solo
      autofocus
      v-model="group.description"
      @keydown.enter="updateGroup"
      @blur="updateGroup"
      ></v-text-field>
    </v-card-subtitle>
  <v-card-subtitle
    @click="editGroup"
    class="py-0"
    v-else>{{ group.description}}</v-card-subtitle>

  <v-card-actions>
  <!--暂时注释
    <v-tooltip bottom >
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="mx-0" @click="editGroup">
          mdi-square-edit-outline
        </v-icon>
      </template>
      <span>编辑</span>
    </v-tooltip>
  -->
  
    <v-tooltip bottom v-if="expand">
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="mx-2" color="warning" :disabled="!addSubgroupBtnValid" @click="preCreateSubgroup">
          mdi-folder-plus
        </v-icon>
      </template>
      <span>添加子组</span>
    </v-tooltip>

    <v-spacer></v-spacer>
    <v-btn icon @click="showSubGroup()" >
        <v-icon>{{ expand? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
    </v-btn>
  </v-card-actions>

  <v-expand-transition>
    <div v-show="expand">
      <v-divider></v-divider>
      <v-card-text class="pa-0">
        <!--加载提示-->
        <v-list v-if="loading">
          <v-row justify="center">
            <v-progress-circular
              width="2"
              color="green darken-2"
              indeterminate
            >
            </v-progress-circular>
          </v-row>
        </v-list>

        <v-list v-else>
          <!-- 删除按钮 -->
          <v-row justify="center" v-if="!isSubgroup">
            <v-btn icon color="red" @click="deleteGroup">
              <v-tooltip bottom >
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" large>mdi-delete-empty</v-icon>
                </template>
                <span>删除该组</span>
              </v-tooltip>
            </v-btn>
          </v-row>
          <subgroup v-for="(sg, index) in group.subgroups" :subgroup="sg" :key="index"
            v-on:addsg="handleAddSubgroup($event)"
            v-on:delsg="handleDelSubgroup($event)"
            v-on:editsg="handleEditSubgroup($event)"
            v-on:editdesc="handleEditSubgroupDesc($event)"
          ></subgroup>
        </v-list>
      </v-card-text>
    </div>
  </v-expand-transition>
</v-card>

<!--
  新建组的卡片，当'group'对象中包含'edited: true'时渲染
-->
<v-card v-else
  class="mx-auto"
  :min-width="cardWidth"
  :max-width="cardWidth"
>
  <v-container>
    <v-form ref="newGroupForm">
      <v-row>
        <v-col>
          <v-text-field v-model="group.ou" label="组名"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field v-model="group.description" label="组描述"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row justify="end">
        <v-icon medium class="mr-2" color="green" :disabled="!newGroupFormBtnValid" @click="validateForm">
          mdi-content-save
        </v-icon>
      </v-row>
    </v-form>
  </v-container>
</v-card>

</template>

<script>
import Vue from 'vue'
import Subgroup from '@/components/group/Subgroup.vue'

export default {
  data () {
    return {
      cardWidth: 260,
      newGroupFormBtnValid: true,
      addSubgroupBtnValid: true,
      expand: false,
      showDel: false,
      groupEdited: false,
      loading: false,
      lastDesc: "",
      rules: {
        required: value => !!value || '不能为空',
      },
    }
  },
  components: {
    'subgroup': Subgroup,
  },
  props: {
    group: Object,
  },
  computed: {
    isSubgroup: function(){
      if(this.group.subgroups) {
        if(this.group.subgroups.length) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    validateForm: function(){
      this.newGroupFormBtnValid = false
      if(this.$refs.newGroupForm.validate()) {
        // valid, create group
        this.$store.dispatch('grp/createGroup', this.group)
      }
      this.newGroupFormBtnValid = true
    },
    // ====================================
    //处理子组件传递的创建子组事件
    // ====================================
    handleAddSubgroup(data) {
      let payload = {
        group: this.group.ou,
        ...data
      };
      this.$store.dispatch('grp/createSubgroup', payload);
      this.addSubgroupBtnValid = true;
    },
    handleDelSubgroup(subgroup) {
      let data = {
        group: this.group.ou,
        subgroup: subgroup
      }
      this.$store.dispatch('grp/deleteSubgroup', data)
    },
    // 继续向上一级（GroupContent.vue）发送事件
    handleEditSubgroup(subgroup) {
      this.$emit('editSubgroup', {group: this.group, subgroup: subgroup})
    },
    handleEditSubgroupDesc(subgroup) {
      let payload = {
        group: this.group,
        subgroup: subgroup
      }
      this.$store.dispatch('grp/updateSubgroupDesc', payload)
    },

    // ====================================
    // Methods for group
    // ====================================
    editGroup: function() {
      this.groupEdited = true
      this.lastDesc = this.group.description
    },
    updateGroup: function() {
      this.groupEdited = false
      if(this.lastDesc != this.group.description){
        this.$store.dispatch('grp/updateGroup', this.group)
      }
    },
    deleteGroup: function(){
      this.$store.dispatch('grp/deleteGroup', this.group)
      this.expand = false
    },

    // ====================================
    // Methods for subgroup
    // ====================================
    showSubGroup: function(){
      this.expand = !this.expand

      // Only load subgroup when expanding,
      // and subgroups array is empty
      if(this.expand && !this.isSubgroup){
        this.loading = true
        console.log('[GroupCard]: Loading subgroup')
        this.$store.dispatch('grp/loadSubgroup', this.group.ou)
        .then(response => {
          this.loading = false
        })
      }
    },
    preCreateSubgroup: function() {
      // 防止多次添加子组
      this.addSubgroupBtnValid = false
      this.$store.dispatch('grp/preCreateSubgroup', this.group.ou)
    }
  }//methods
}
</script>