<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetFreetsFormEndDate',
  mixins: [InlineForm],
  data() {
    return {value: this.$store.state.endDate};
  },
  methods: {
    async submit() {
      const url = this.value ? `/api/freets?enddate=${this.value}` : '/api/freets';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateEndDateFilter', this.value);
        this.$store.commit('updateFreets', res);
      } catch (e) {
        if (this.value === this.$store.state.endDate) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateEndDateFilter', null);
          this.value = ''; // Clear filter to show all users' freets
          this.$store.commit('refreshFreets');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.endDate;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
