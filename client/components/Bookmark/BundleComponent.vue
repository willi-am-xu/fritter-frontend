<template>
  <article
    class="bundle"
  >
    <header @click="toggleShow">
      <h2 class="author">
        {{bundle.bundleName}} by @{{ bundle.author }}
      </h2>
      <div
        v-if="$store.state.username === bundle.author"
        class="actions"
      >
        <button @click="deleteBundle">
          🗑️ Delete Bundle
        </button>
      </div>
    </header>

    <section
        v-if="bundle.freets.length && show"
    >
        <FreetComponent
          v-for="freetId in bundle.freets"
          :key="freetId"
          :freet="getFreetFromId(freetId)"
        />
    </section>

    <p class="info">
      Created at {{ bundle.dateCreated }}. 
      Last modified at {{ bundle.dateModified}}.
    </p>
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
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
  name: 'BundleComponent',
  props: {bundle: {
      type: Object,
      required: true
    },
    // username: {
    //   type: Object,
    //   required: true
    // }
    },
  components: {FreetComponent},
  data() {
    return {
      show: false,
      alerts: {}
    }
  },
  methods: {
    async deleteBundle() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted bundle!', status: 'success'
          });
        }
      };
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/bookmark/${this.bundle.bundleName}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        // this.$store.commit('refreshFreets');
        this.show = false;

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    getFreetFromId(id) {
      return this.$store.state.freets.filter((freet)=> freet._id === id)[0];
    },
    toggleShow() {
      this.show = !this.show;
    }
  },
  mounted() {

  }
};
</script>

<style scoped>
.bundle {
    border: 2px solid #111;
    padding: 20px;
    position: relative;
}
</style>