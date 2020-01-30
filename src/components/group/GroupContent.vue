<template>
<v-container fluid>
  <!--公用subgroup编辑组件-->
  <subgroup-edit ref="subgroupEdit"></subgroup-edit>

  <!--创建组按钮-->
  <v-row col="12" justify="end">
    <v-btn small color="green" fab dark @click="handleCreateGroup">
      <v-icon>mdi-account-multiple-plus</v-icon>
    </v-btn>
  </v-row>

  <!--组卡片组件-->
  <v-row col="12" alignment="start" justify="start">
    <v-col v-for="(group, cardIdx) in groups" v-bind:key="cardIdx">
      <group-card
        v-bind:group="group"
        v-on:editSubgroup="handleEditSubgroupEvent($event)">
      </group-card>
    </v-col>
  </v-row>

  <!--空组提示-->
  <v-container v-if="!groups.length">
    <v-row justify="center">
      No Data ; /
    </v-row>
  </v-container>

</v-container>
</template>

<script>
import GroupCard from '@/components/group/GroupCard.vue'
import SubgroupEdit from '@/components/group/SubgroupEdit.vue'

export default {
  name: 'GroupCard',
  components: {
    "group-card": GroupCard,
    'subgroup-edit': SubgroupEdit
  },
  computed: {
    groups() {
      return this.$store.state.grp.groups
    }
  },
  methods: {
    handleCreateGroup: function(){
      this.$store.dispatch("grp/preCreateGroup")
    },
    handleEditSubgroupEvent(payload){
      // console.log('handleEditSubgroupEvent')
      // console.log(payload.group.ou)
      // console.log(payload.subgroup.cn)
      // 将当前的group跟subgroup对象传递给SubgroupEdit组件
      this.$refs.subgroupEdit.dialog = true
      this.$refs.subgroupEdit.group = payload.group
      this.$refs.subgroupEdit.subgroup = payload.subgroup
    }
  },
}
</script>
