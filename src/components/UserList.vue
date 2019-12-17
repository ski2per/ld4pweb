<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :search="search"
    sort-by="uid"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>LDAP Users</v-toolbar-title>

        <v-divider class="mx-4" inset vertical ></v-divider>

        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          append-icon="mdi-search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn small color="green" fab dark v-on="on">
              <v-icon>mdi-account-plus </v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.cn" label="Name"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.uid" label="UserID" :disabled="edited"></v-text-field>
                  </v-col>
                  <v-col cols="12" v-if="isEdited">
                    <v-text-field v-model="editedItem.mail" label="Email" disabled></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.sn" label="Family Name"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.givenName" label="Given Name"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon medium class="mr-2"
        @click="editItem(item)"
      >
       mdi-account-edit
      </v-icon>
      <v-icon medium 
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reload</v-btn>
    </template>
  </v-data-table>
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
              text: "User ID",
              align: "left",
              sortable: true,
              value: "uid"
          },
          { text: "Name", value: "cn"},
          { text: "Email", value: "mail", sortable: false},
          { text: "Actions", value: "action", sortable: false},
        ],
        dialog: false,
        edited: false,
        editedItem: {
            uid: '',
            cn: '',
            mail: '',
        },
        defaultItem: {
            uid: '',
            cn: '',
            mail: '',
        },
        rules: {
          required: value => !!value || 'Required.',
        },
    }
  }, //data()
  computed: {
    formTitle() {
      return this.edited ? 'Edit User' : 'New User'
    },
    isEdited() {
        return this.edited
    }
  },
  created() {
    this.initialize()
  },
  mounted: function() {
  },
  methods: {
    initialize() {
      console.log("[UserList.vue]")
      console.log(localStorage.getItem('token'))
      this.$http.get('http://172.16.66.6:8000/api/v1/users/')
    //   this.$http.get('http://localhost:8000/api/v1/users/')
      .then(response => {
        this.users = response.data
      })
      .catch(error => {
        console.log(error)
      })
    },// initialize()

    editItem (item) {
      this.edited = true
      this.editedItem = item
      this.dialog = true
      console.log(item)
    },

    deleteItem (item) {
      console.log("Delete TBD")
    },

    close () {
      this.dialog = false
      this.editedItem = this.defaultItem
      this.edited = false
    },
    save () {
      console.log(this.editedItem)
      const params = new FormData()

      const data = {
        'chinese_name': this.editedItem.cn,
        'surname': this.editedItem.sn,
        'given_name': this.editedItem.givenName,
      }

    //   this.$http.post(`http://localhost:8000/api/v1/users/${this.editedItem.uid}`, data)
      this.$http.post(`http://172.16.66.6:8000/api/v1/users/${this.editedItem.uid}`, data)
      .then(response => {
        const info = {"msg": "", "color": ""} 
        if(response && response.status == 200){
          info.msg = response.data.detail
          info.color = "success"
        } else {
          info.msg = "Unknown error"
          info.color = "error"
        }
        console.log(info)
        this.$store.dispatch('showInfo', info)

      })
      .catch(error => {
        const info = {"msg": "", "color": "error"} 
        if (error.response) {
          info.msg = response.data.detail
        } else {
          info.msg = "Unknown server error"
        }
        console.log(info)
        this.$store.dispatch('showInfo', info)
        console.log(error)
      })
      this.dialog = false
      this.editedItem = this.defaultItem
    },

  }, //method()
}
</script>
