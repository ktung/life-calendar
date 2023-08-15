<script setup lang="ts">
import { computed } from 'vue';
import { addYears, differenceInYears, differenceInDays } from 'date-fns'

const props = defineProps<{
  birthDate: Date
}>()

const today = new Date();
const lifeExpectancy = 82.1;

const deathDate = computed(() => addYears(props.birthDate, lifeExpectancy)); // decimal not handled

const diffInYears = computed(() => differenceInYears(today, props.birthDate));
const diffInDays = computed(() => differenceInDays(today, props.birthDate));

const remainingYears = computed(() => differenceInYears(deathDate.value, today));
const remainingDays = computed(() => differenceInDays(deathDate.value, today));
</script>

<template>
  <div>
    <ul>
      <li>You lived {{ diffInYears }} years</li>
      <li>You lived {{ diffInDays }} days</li>
      <li>You will die on {{ deathDate.toLocaleDateString('fr-fr') }}</li>
      <li>You have {{ remainingYears }} years left</li>
      <li>You have {{ remainingDays }} days left</li>
    </ul>
  </div>
</template>

<style scoped>
</style>
