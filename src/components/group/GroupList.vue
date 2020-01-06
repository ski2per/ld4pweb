<template>
<v-data-table
  :headers="headers"
  :items="this.$store.state.grp.groups"
>
  <template slot="items" slot-scope="props">
  </template>

</v-data-table>
</template>

<script>
export default {
  name: 'GroupList',
  data () {
    return {
        groups: [],
        headers: [
            {
                text: "GID",
                align: "left",
                sortable: false,
                value: "ou"
            },
            { text: "Description", value: "description"},
        ]
    }
  },
}
</script>
