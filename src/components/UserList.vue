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
                    <v-text-field v-model="editedItem.cn" label="Name"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.uid" label="UserID"></v-text-field>
                  </v-col>
                  <v-col cols="12" v-if="isEdited">
                    <v-text-field v-model="editedItem.mail" label="Email"></v-text-field>
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
      <v-btn color="primary" @click="initialize">Reset</v-btn>
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
        }
    }
  },
  computed: {
    formTitle() {
      return this.edited ? 'Edit User' : 'New User'
    },
    isNew() {
        return !this.edited
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
      // this.$http.get('http://localhost:8000/api/v1/users/')
      .then(response => {
        this.users = response.data
        console.log(this.users)
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
        console.log("saved")
        this.dialog = false
    }
  },
}
</script>
