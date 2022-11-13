<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <img v-if="hasImage" :src="imageLink"></img>
        <h2>Profile page for {{profile.name}}, @{{ profile.username }}</h2>
        <div
          v-if="$store.state.username === profile.username"
          class="actions"
        >
          <button
            v-if="editingBio"
            @click="submitBioEdit"
          >
            ✅ Save changes
          </button>
          <button
            v-if="editingBio"
            @click="stopEditingBio"
          >
            🚫 Discard changes
          </button>
          <button
            v-if="!editingBio"
            @click="startEditingBio"
          >
            ✏️ Edit
          </button>
        </div>
        <textarea
          v-if="editingBio"
          class="content"
          :value="draftBio"
          @input="draftBio = $event.target.value"
        />
        <h4
          v-else
        >
          {{profile.bio}}
        </h4>
        
      </header>
      <article>
      <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
    </article>
      <div>
        <button v-if="canFollow" @click="addFollow">
          ➕ Follow
        </button>
        <button v-if="canUnfollow" @click="addUnfollow">
          👋 Unfollow
        </button>
      </div>
      <section>
        <FreetComponent
          v-for="freet in $store.state.freets"
          v-if="(freet.author === profile.username || freet.reFreets.includes(profile._id))"
          :key="freet.id"
          :freet="freet"
        />
      </section>
        </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
  name: 'ProfilePage',
  components: {
    FreetComponent,
  },
  data() {
    return {
    profile: {
    _id: "",
    username: "",
    dateJoined: "",
    followers: [],
    following: [],
    name: "",
    bio: ""
    },
    canFollow: false,
    canUnfollow: false,
    hasImage: false,
    imageLink: "",
    alerts: {},

    editingBio: false,
    draftBio: ""
  }
  
},
methods: {
  async addFollow() {
    const url = this.$route.params.username ? `/api/users/follow/${this.$route.params.username}` : '/api/freets';
    try {
      const r = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}});
      const res = await r.json();
      if (!r.ok) {
          throw new Error(res.error);
      }
      this.canFollow = false;
      this.canUnfollow = true;
      this.$store.commit('refreshFollowing');
      this.$set(this.alerts, 'Successfully followed!', 'success');
      setTimeout(() => this.$delete(this.alerts, 'Successfully followed!'), 3000);
    }
    catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
  },
  async addUnfollow() {
    const url = this.$route.params.username ? `/api/users/follow/${this.$route.params.username}` : '/api/freets';
    try {
      const r = await fetch(url, {method: 'DELETE'});
      const res = await r.json();
      if (!r.ok) {
          throw new Error(res.error);
      }
      this.canFollow = true;
      this.canUnfollow = false;
      this.$set(this.alerts, 'Successfully unfollowed!', 'success');
      setTimeout(() => this.$delete(this.alerts, 'Successfully unfollowed!'), 3000);
    }
    catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
  },
  startEditingBio() {
      this.editingBio = true; // Keeps track of if a freet is being edited
      this.draftBio = this.profile.bio; // The content of our current "draft" while being edited
    },
    stopEditingBio() {
      this.editingBio = false;
      this.draftBio = this.profile.bio;
    },
    async submitBioEdit() {
      const params = {
        method: 'PATCH',
        message: 'Successfully edited bio!',
        body: JSON.stringify({bio: this.draftBio}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }
      try {
        const r = await fetch(`/api/users/my/profile`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.editingBio = false;
        this.profile.bio = this.draftBio;
        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    
},
async beforeRouteUpdate(to, from, next) {
  const url = to.params.username ? `/api/users/${to.params.username}/profile` : '/api/freets';
  try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.profile = res.user;
        this.canFollow = this.$store.state.username !== this.profile.username && !this.profile.followers.includes(this.$store.state.username);
        this.canUnfollow = this.$store.state.username !== this.profile.username && !this.canFollow;
      } catch (e) {
        this.$router.replace('/not-found');
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    next();
},
  async mounted() {
    const url = this.$route.params.username ? `/api/users/${this.$route.params.username}/profile` : '/api/freets';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        if (res.user?.picture) {
          if (/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(res.user.picture)) {
            this.imageLink = res.user.picture;
            this.hasImage = true;
          }
        }
        this.profile = res.user;
        this.canFollow = this.$store.state.username !== this.profile.username && !this.profile.followers.includes(this.$store.state.username);
        this.canUnfollow = this.$store.state.username !== this.profile.username && !this.canFollow;
      } catch (e) {
        this.$router.replace('/not-found');
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
  },
};
</script>


<style scoped>
.alert {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>