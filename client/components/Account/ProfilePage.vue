<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Profile page for {{$store.state.name}}, @{{ $store.state.username }}</h2>
      </header>
      <section>
        <FreetComponent
          v-for="freet in $store.state.freets"
          v-if="freet.author === $store.state.username"
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
  }
};
</script>
