<template>
  <main>
    <section>
      <header>
        <h2>Bookmark Bundles of @{{ $route.params.username }}</h2>
      </header>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all Bundles
          </h2>
        </div>
      </header>
      <section
        v-if="bundles.length"
      >
        <BundleComponent
          v-for="bundle in bundles"
          :key="bundle._id"
          :bundle="bundle"
        />
      </section>
      <article
        v-else
      >
        <h3>No bundles found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import BundleComponent from '@/components/Bookmark/BundleComponent.vue';

export default {
  name: 'BundlesPage',
  components: {BundleComponent},
  data() {
    return {
        bundles: []
    }
  },
  async beforeRouteUpdate(to, from, next) {
    let url = to.params.username ? `/api/users/${to.params.username}/profile` : '/api/freets';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        url = to.params.username ? `/api/bookmark?authorId=${to.params.username}` : '/api/freets';
        try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
            throw new Error(res.error);
        }
        this.bundles = res.filter((bundle)=> bundle.author === to.params.username);
        }
        catch (e) {
            // this.$set(this.alerts, e, 'error');
            // setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      } catch (e) {
        this.$router.replace('/not-found');
        // this.$set(this.alerts, e, 'error');
        // setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

    next();
  },
  async mounted() {
    let url = this.$route.params.username ? `/api/users/${this.$route.params.username}/profile` : '/api/freets';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        url = this.$route.params.username ? `/api/bookmark?authorId=${this.$route.params.username}` : '/api/freets';
        try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
            throw new Error(res.error);
        }
        this.bundles = res.filter((bundle)=> bundle.author === this.$route.params.username);
        }
        catch (e) {
            // this.$set(this.alerts, e, 'error');
            // setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      } catch (e) {
        this.$router.replace('/not-found');
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