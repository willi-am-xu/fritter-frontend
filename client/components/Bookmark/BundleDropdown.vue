<template>
  <div>
    <b-dropdown id="dropdown-form" text="🔖 Bookmark" ref="dropdown" class="m-2">
      <b-dropdown-form>
        <b-form-group label="New Bundle" label-for="dropdown-form-bundle-name" @submit.stop.prevent>
          <b-form-input
            id="dropdown-form-bundle-name"
            size="sm"
            placeholder="My Bookmarks"
            v-model="newBundleName"
          ></b-form-input>
        </b-form-group>
        <b-button variant="primary" size="sm" @click="addNew">Create Bundle</b-button>
      </b-dropdown-form>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item-button disabled>Existing Bundle</b-dropdown-item-button>
      <b-dropdown-item-button v-for="bundle in bundles"
          :key="bundle._id" @click="addExisting">{{bundle.bundleName}}</b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
  export default {
    name: "BundleDropdown",
    props: {
        freet: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            bundles:[],
            newBundleName:""
        }
    },
    methods: {
      async addNew() {
        // Close the menu and (by passing true) return focus to the toggle button
        const url = `/api/bookmark/${this.newBundleName ? this.newBundleName: "My Bookmarks"}/${this.freet._id}`;
        try {
        const r = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}});
        const res = await r.json();
        if (!r.ok) {
            throw new Error(res.error);
        }
        this.bundles.push(res.bundle);
        }
        catch (e) {
            console.log(e);
            // this.$set(this.alerts, e, 'error');
            // setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
        this.$refs.dropdown.hide(true);
      },
      async addExisting(event) {
        const url = `/api/bookmark/${event.target.textContent}/${this.freet._id}`;
        try {
        const r = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}});
        const res = await r.json();
        if (!r.ok) {
            throw new Error(res.error);
        }
        this.bundles.push(res.bundle);
        }
        catch (e) {
            console.log(e);
            // this.$set(this.alerts, e, 'error');
            // setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
        this.$refs.dropdown.hide(true);
      }
    },
    async mounted() {
    let url = this.$store.state.username ? `/api/bookmark?authorId=${this.$store.state.username}` : '/api/freets';
        try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
            throw new Error(res.error);
        }
        this.bundles = res.filter((bundle)=> bundle.author === this.$store.state.username);
        }
        catch (e) {
            // this.$set(this.alerts, e, 'error');
            // setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    
  }
  }
</script>