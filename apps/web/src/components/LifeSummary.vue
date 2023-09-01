<script setup lang="ts">
import { computed } from 'vue';
import { differenceInYears, differenceInDays } from 'date-fns';

const props = defineProps<{
  birthDate: Date,
  deathDate: Date
}>();

const today = new Date();

const diffInYears = computed(() => differenceInYears(today, props.birthDate));
const diffInDays = computed(() => differenceInDays(today, props.birthDate));

const remainingYears = computed(() => differenceInYears(props.deathDate, today));
const remainingDays = computed(() => differenceInDays(props.deathDate, today));
</script>

<template>
  <section>
    <ul>
      <li>You lived {{ diffInYears }} years</li>
      <li>You lived {{ diffInDays }} days</li>
      <li>You will die on {{ deathDate.toLocaleDateString('fr-fr') }}</li>
      <li>You have {{ remainingYears }} years left</li>
      <li>You have {{ remainingDays }} days left</li>
    </ul>
  </section>
</template>

<style scoped>
</style>
