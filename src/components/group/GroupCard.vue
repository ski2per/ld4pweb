<template>
<!--Normal Card-->
<v-card v-if="!group.edited"
  class="mx-auto"
  min-width="360"
  max-width="360"
>
  <v-card-title>{{ group.ou }}</v-card-title>
  <v-card-subtitle>{{ group.description}}</v-card-subtitle>

  <v-card-actions>
    <v-tooltip bottom >
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="mx-0">
          mdi-square-edit-outline
        </v-icon>
      </template>
      <span>编辑</span>
    </v-tooltip>
  
    <v-tooltip bottom v-if="expand">
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="mx-2" color="green">
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
      <v-card-text>
        <v-list>
          <v-btn text color="red" v-if="!isSubgroup">删除</v-btn>
          <subgroup v-for="sg in this.group.subgroups" :subgroup="sg"></subgroup>
        </v-list>
      </v-card-text>
    </div>
  </v-expand-transition>
</v-card>

<!--New group card-->
<v-card v-else
  class="mx-auto"
  min-width="360"
  max-width="360"
>
  <v-container>
    <v-form ref="newGroupForm">
      <v-row>
        <v-col>
          <v-text-field v-model="group.ou" label=""
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field v-model="group.description" label=""
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row justify="end">
          <v-icon medium class="mr-2" color="green" :disabled="!btnValid" @click="validate">
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
      btnValid: true,
      expand: false,
      showDel: false,
      rules: {
        required: value => !!value || '不能为空',
      },
    }
  },
  components: {
    'subgroup': Subgroup
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
    validate: function(){
      this.valid = false
      if(this.$refs.newGroupForm.validate()) {
        this.save()
      }
      this.valid = true
    },
    save: function() {
      this.$store.dispatch('grp/createGroup', this.group)
    },
    showSubGroup: function(){
      this.expand = !this.expand

      // Only load subgroup when expanding,
      // and subgroups array is empty
      if(this.expand && !this.isSubgroup){
        console.log('[GroupCard]: Loading subgroup')
        this.$store.dispatch('grp/loadSubgroup', this.group.ou)
      }
    }
  },
}
</script>