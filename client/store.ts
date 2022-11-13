import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    name: null, // name of the logged in user
    following: [],
    startDate: null,
    endDate: null,
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setName(state, name) {
      /**
       * Update the stored name to the specified one.
       * @param name - new name to set
       */
       state.name = name;
    },
    setFollowing(state, following) {
       state.following = following;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateStartDateFilter(state, filter) {
      state.startDate = filter;
    },
    updateEndDateFilter(state, filter) {
      state.endDate = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      let url = '/api/freets';
      if (state.filter) {
        url = url.concat(`?authorId=${state.filter}`);
      }
      if (state.startDate) {
        url = url.concat(`?startdate=${state.startDate}`);
      }
      if (state.endDate) {
        url = url.concat(`?enddate=${state.endDate}`);
      }
      const res = await fetch(url).then(async r => r.json());
      console.log(res);
      state.freets = res;
    },
    async refreshFollowing(state) {
      const url = state.username ? `/api/users/${state.username}/profile` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.following = res.user.following;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
