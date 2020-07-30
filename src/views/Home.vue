<template>
  <div class="home">
    <CalendarVue />
  </div>
</template>

<script>
import CalendarVue from '../components/page/home/Calendar.vue';

export default {
  name: "Home",
  components: {
    CalendarVue
  },
  data() {
    return {
      
    };
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.home {
  padding: 10px;
}
</style>
