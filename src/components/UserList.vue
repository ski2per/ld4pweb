<template>
<v-card>
    <v-card-title>
      LDAP Users
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
<v-data-table
  :headers="headers"
  :items="users"
  :search="search"
  show-select
>
  <template slot="items" slot-scope="props">
  </template>

</v-data-table>
</v-card>
</template>

<script>
export default {
  name: 'UserList',
  data () {
    return {
        users: [],
        search: '',
        headers: [
            {
                text: "UID",
                align: "left",
                sortable: false,
                value: "uid"
            },
            { text: "CN", value: "cn"},
            { text: "Email", value: "mail"},
        ]
    }
  },
  mounted: function() {
    console.log("[UserList.vue]")
    console.log("i am mounted")
    console.log(localStorage.getItem('token'))
    this.$http.get('http://172.16.66.6:8000/api/v1/users/')
    .then(response => {
      this.users = response.data
      console.log(this.users)
    })
    .catch(error => {
      console.log(error)
    })
  },
}
</script>