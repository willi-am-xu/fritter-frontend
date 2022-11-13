<template>
  <article
    class="freet"
  >
    
      <div
        class="actions"
      >
        <button
          v-if="!liked"
          @click="submitLike"
        >
          ❤️ Like
        </button>
        <button
          v-else
          @click="removeLike"
        >
          💔 Unlike
        </button>
        <button
          v-if="!refreeted"
          @click="submitRefreet"
        >
          🔁 Refreet
        </button>
        <button
          v-else
          @click="removeRefreet"
        >
          🔄 Unrefreet
        </button>
        <button
          v-if="!downvoted"
          @click="submitDownvote"
        >
          ⬇️ Personal Downvote
        </button>
        <button
          v-else
          @click="removeDownvote"
        >
          ⏫ Undo Personal Downvote
        </button>

        <!-- <button
          @click="submitBookmark"
        >
          🔖 Bookmark
        </button> -->
        <BundleDropdown :freet="freet"/>
      </div>
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
import BundleDropdown from '@/components/Bookmark/BundleDropdown.vue';
export default {
    name: "FreetActions",
    props: {
    freet: {
      type: Object,
      required: true
    }
    },
    components: {
        BundleDropdown
    },
    data() {
        return {
            liked: false,
            refreeted: false,
            downvoted: false,
            alerts: {}
        }
    },
    methods: {
        async submitLike() {
            this.liked = true;
            const url = `/api/freets/${this.freet._id}/like`;
            const params = {
                method: 'POST',
                message: 'Successfully liked freet!',
                callback: () => {
                this.$set(this.alerts, params.message, 'success');
                setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };
            try {
                const r = await fetch(url, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                this.$store.commit('refreshFreets');
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async removeLike() {
            this.liked = false;
            const url = `/api/freets/${this.freet._id}/like`;
            const params = {
                method: 'DELETE',
                message: 'Successfully removed like from freet!',
                callback: () => {
                this.$set(this.alerts, params.message, 'success');
                setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };
            try {
                const r = await fetch(url, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                this.$store.commit('refreshFreets');
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async submitRefreet() {
            this.refreeted = true;
            const url = `/api/freets/${this.freet._id}/refreet`;
            const params = {
                method: 'POST',
                message: 'Successfully refreeted freet!',
                callback: () => {
                this.$set(this.alerts, params.message, 'success');
                setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };
            try {
                const r = await fetch(url, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                this.$store.commit('refreshFreets');
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async removeRefreet() {
            this.refreeted = false;
            const url = `/api/freets/${this.freet._id}/refreet`;
            const params = {
                method: 'DELETE',
                message: 'Successfully removed refreet from freet!',
                callback: () => {
                this.$set(this.alerts, params.message, 'success');
                setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };
            try {
                const r = await fetch(url, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                this.$store.commit('refreshFreets');
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async submitDownvote() {
            this.downvoted = true;
            const url = `/api/freets/${this.freet._id}/downvote`;
            const params = {
                method: 'POST',
                message: 'Successfully personally downvoted freet!',
                callback: () => {
                this.$set(this.alerts, params.message, 'success');
                setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };
            try {
                const r = await fetch(url, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                this.$store.commit('refreshFreets');
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async removeDownvote() {
            this.downvoted = false;
            const url = `/api/freets/${this.freet._id}/downvote`;
            const params = {
                method: 'DELETE',
                message: 'Successfully removed personal downvote from freet!',
                callback: () => {
                this.$set(this.alerts, params.message, 'success');
                setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };
            try {
                const r = await fetch(url, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                this.$store.commit('refreshFreets');
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        submitBookmark() {

        }
    },
    async mounted() {
        const url = this.$store.state.username ? `/api/users/${this.$store.state.username}/profile` : '/api/freets';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        const id = res.user._id;
        this.liked = this.freet.likes.includes(id);
        this.refreeted = this.freet.reFreets.includes(id);
        this.downvoted = this.freet.personalDownvotes.includes(id);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
  }
}
</script>