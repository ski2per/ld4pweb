<template>
<v-list-item
  @click=""
>
  <v-list-item-content>
    <v-list-item-title v-text="subgroup.cn"></v-list-item-title>
    <v-list-item-subtitle v-text="subgroup.description"></v-list-item-subtitle>
  </v-list-item-content>

  <v-list-item-action>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="mx-0" @click="">
          mdi-square-edit-outline
        </v-icon>
      </template>
      <span>编辑该组</span>
    </v-tooltip>
  </v-list-item-action>

  <v-list-item-action>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="mx-0" @click="">
          mdi-delete-outline
        </v-icon>
      </template>
      <span>删除该组</span>
    </v-tooltip>
  </v-list-item-action>

</v-list-item>
</template>

<script>
export default {
  props: {
    subgroup: Object,
  }
}
</script>