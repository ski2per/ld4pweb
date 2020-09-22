<template>
<!--
  新建子组的列表项，当'subgroup'对象中包含'state: create'时渲染
  state:create在group.js的mutation: PRE_CREATE_SUBGROUP中修改
-->
<v-list-item v-if="subgroup.state === 'create'">
  <v-list-item-content>
    <v-form ref="newSubgroupForm">
      <v-text-field v-model="subgroup.cn" label="子组名"
        :rules="[rules.required]"
      ></v-text-field>
      <v-text-field v-model="subgroup.description" label="子组描述"
      ></v-text-field>
    </v-form>
  </v-list-item-content>
  <v-list-item-action>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="mx-0" color="green" :disabled="!createValid" @click="validateForm">
          mdi-check-bold
        </v-icon>
      </template>
      <span>保存</span>
    </v-tooltip>
  </v-list-item-action>
</v-list-item>
<!--正常的子组条目，包含点击编辑描述功能-->
<v-list-item v-else >
  <v-list-item-content>
    <v-list-item-title @click="editDesc">{{subgroup.cn}}</v-list-item-title>
    <!--单击子组描述修改-->
    <v-list-item-subtitle v-if="subgroupEdited">
      <v-text-field
        solo
        autofocus
        v-model="subgroup.description"
        @keydown.enter="updateDesc"
        @blur="updateDesc"
        ></v-text-field>
      </v-list-item-subtitle>
    <v-list-item-subtitle
      @click="editDesc"
      v-else>{{subgroup.description}}</v-list-item-subtitle>
  </v-list-item-content>

  <v-list-item-action>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="mx-0" @click="editSubgroup">
          mdi-account-edit
        </v-icon>
      </template>
      <span>修改成员</span>
    </v-tooltip>
  </v-list-item-action>

  <v-list-item-action>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="ml-2" :disabled="!deleteValid" @click="overlay = true">
          mdi-delete-outline
        </v-icon>
      </template>
      <span>删除该组</span>
    </v-tooltip>
  </v-list-item-action>
  <!--使用overlay组件来进行子组删除确认-->
  <v-overlay
    absolute
    opacity="0.8"
    color="orange"
    :value="overlay"
  >
    <v-icon medium class="mr-6" color="white" @click="overlay = false">
      mdi-close-outline
    </v-icon>
    <v-icon medium class="ml-6" color="white" @click="deleteSubgroup">
      mdi-check-outline
    </v-icon>
  </v-overlay>
</v-list-item>



</template>

<script>
export default {
  data () {
    return {
      createValid: true,//防止重复提交?
      deleteValid: true,
      subgroupEdited: false,
      lastDesc: "",
      overlay: false,
      rules: {
        required: value => !!value || '不能为空',
      },
    }
  },
  props: {
    subgroup: Object,
  },
  methods: {
    validateForm: function() {
      this.valid = false
      if(this.$refs.newSubgroupForm.validate()) {
        // form valid, create subgroup
        let payload = {
          cn: this.subgroup.cn,
          description: this.subgroup.description 
        }
        // 向父级(GroupCard.vue)发送'addsg'事件，
        // 并传递创建subgroup的数据
        this.$emit('addsg', payload)
      }
      this.valid = true
    },
    editDesc: function() {
      this.subgroupEdited = true
      this.lastDesc = this.subgroup.description
    },
    updateDesc: function() {
      this.subgroupEdited = false
      if(this.lastDesc != this.subgroup.description){
        this.$emit('editdesc', this.subgroup)
      }
    },
    deleteSubgroup: function() {
      this.$emit('delsg', this.subgroup.cn)
      this.overlay = false
    },
    editSubgroup: function() {
      this.$emit('editsg', this.subgroup)
    }
  },
}
</script>