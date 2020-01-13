<template>
<!--Normal Subgroup-->
<v-list-item
  v-if="!subgroup.edited"
>
  <v-list-item-content>
    <v-list-item-title v-text="subgroup.cn"></v-list-item-title>
    <v-list-item-subtitle v-text="subgroup.description"></v-list-item-subtitle>
  </v-list-item-content>

  <v-list-item-action>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="mx-0">
          mdi-pencil
        </v-icon>
      </template>
      <span>编辑该组</span>
    </v-tooltip>
  </v-list-item-action>

  <v-list-item-action>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="mx-0" color="red">
          mdi-delete-outline
        </v-icon>
      </template>
      <span>删除该组</span>
    </v-tooltip>
  </v-list-item-action>
</v-list-item>

<!--
  新建子组的列表项，当'subgroup'对象中包含'edited: true'时渲染
-->
<v-list-item v-else>
  <v-list-item-content>
    <v-form ref="newSubgroupForm">
      <v-text-field v-model="subgroup.cn" label="子组名"
        :rules="[rules.required]"
      ></v-text-field>
      <v-text-field v-model="subgroup.description" label="子组描述"
        :rules="[rules.required]"
      ></v-text-field>
    </v-form>
  </v-list-item-content>
  <v-list-item-action>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="mx-0" color="green" :disabled="!valid" @click="validateForm">
          mdi-check-bold
        </v-icon>
      </template>
      <span>保存</span>
    </v-tooltip>
  </v-list-item-action>

</v-list-item>

</template>

<script>
export default {
  data () {
    return {
      valid: true,//防止重复提交?
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
      console.log("shit")
      this.valid = false
      if(this.$refs.newSubgroupForm.validate()) {
        // form valid, create subgroup
        console.log("valid")
        let payload = {
          cn: this.subgroup.cn,
          description: this.subgroup.description 
        }
        // 向父级(GroupCard.vue)发送'addsg'事件，
        // 并传递subgroup创建数据
        this.$emit('addsg', payload)
      }
      this.valid = true
    },

  },
}
</script>