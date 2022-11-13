<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing your feed
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get freets"
          />
        </div>
      </header>
      <section
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.freets"
          v-if="following.includes(freet.author) && !(getDownvoteRemove(freet.author, probs))"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'Feed',
  components: {FreetComponent, GetFreetsForm, CreateFreetForm},
  data() {
    return {
        following: [],
        id: '',
        probs: {}
    }
  },
  methods: {
    async loadDownvoteChances() {
        let url = `/api/freets`;
        try {
            const r = await fetch(url);
            const res = await r.json();
            if (!r.ok) {
            throw new Error(res.error);
            }
            this.probs = {};
            for (let i = 0; i <  res.length; i++) {
                if (res[i].personalDownvotes.includes(this.id)) {
                    if (this.probs[res[i].author]) {
                        this.probs[res[i].author] += 0.2;
                    }
                    else {
                        this.probs[res[i].author] = 0.2;
                    }
                }
            }
            
        } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    },
    getDownvoteRemove(author, probs) {
        if (!probs[author]) {
            return false;
        }
        return probs[author] > Math.random();
    }
  },
  async beforeRouteUpdate(to, from, next) {
    this.$refs.getFreetsForm.submit();
    const url = this.$store.state.username ? `/api/users/${this.$store.state.username}/profile` : '/api/freets';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.following = res.user.following;
        this.id = res.user._id;
        await this.loadDownvoteChances();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    next();
  },
  async mounted() {
    this.$refs.getFreetsForm.submit();
    const url = this.$store.state.username ? `/api/users/${this.$store.state.username}/profile` : '/api/freets';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.following = res.user.following;
        this.id = res.user._id;
        await this.loadDownvoteChances();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
