<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { addYears, differenceInWeeks } from 'date-fns'
import WeekBlock from './WeekBlock.vue';
import LifeSummary from './LifeSummary.vue';

onMounted(() => {
  const today = new Date();
  const maxLongevity = 130;
  document.querySelector<HTMLInputElement>("#birthDate")?.setAttribute("min", addYears(today, -maxLongevity).toLocaleDateString("fr-ca"));
  document.querySelector<HTMLInputElement>("#birthDate")?.setAttribute("max", today.toLocaleDateString("fr-ca"));
});

const birthDateInput = ref('1994-12-18');
// const birthDateInput = ref(new Date().toLocaleDateString("fr-ca"));
const lifeExpectancy = 82.1;

let birthDate = computed(() => new Date(birthDateInput.value!));
let deathDate = addYears(birthDate.value, lifeExpectancy); // decimal not handled
let lifeInWeeks = computed(() => differenceInWeeks(deathDate, birthDate.value));
</script>

<template>
  <input type="date" v-model="birthDateInput" id="birthDate" />

  <LifeSummary :birthDate=birthDate />

  <div class="life-calendar">
    <template v-for="i in lifeInWeeks" :key="i">
      <WeekBlock
        :birthDate=birthDate
        :weekNumber=i
        />
    </template>
  </div>
</template>

<style scoped>
.life-calendar {
  display: grid;
  grid-template-columns: repeat(53, 1fr);
  gap: 5px;
}
</style>
