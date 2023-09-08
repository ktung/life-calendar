<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { addDays, addYears, differenceInWeeks, differenceInYears } from 'date-fns'
import WeekBlock from './WeekBlock.vue';
import LifeSummary from './LifeSummary.vue';
import { getLifeExpectancy } from '../services/UNLifeExpectancyService';

onMounted(() => {
  const today = new Date();
  const maxLongevity = 130;
  document.querySelector<HTMLInputElement>("#birthDate")?.setAttribute("min", addYears(today, -maxLongevity).toLocaleDateString("fr-ca"));
  document.querySelector<HTMLInputElement>("#birthDate")?.setAttribute("max", today.toLocaleDateString("fr-ca"));

  const personalInfoJSON = localStorage.getItem("personalInfo");
  if (!!personalInfoJSON) {
    const personalInfo = JSON.parse(personalInfoJSON);
    birthDateInput.value = personalInfo.birthDate;
    sexInput.value = personalInfo.sex;
    countryInput.value = personalInfo.country;
  }
});

const birthDateInput = ref(new Date().toLocaleDateString("fr-ca"));
const sexInput = ref('M');
const countryInput = ref('Canada');
const lifeExpectancy = ref(0);

const lifeSummaryEnabled = ref(true);

let birthDate = computed(() => new Date(birthDateInput.value!));
const diffInYears = computed(() => differenceInYears(today, birthDate.value));

const today = new Date();
const deathDate = computed(() => {
  const birthDateAddYears = addYears(birthDate.value, diffInYears.value+lifeExpectancy.value);
  return addDays(birthDateAddYears, lifeExpectancy.value%1*365);
});
let lifeInWeeks = computed(() => differenceInWeeks(deathDate.value, birthDate.value));

async function calculate() {
  const response = await getLifeExpectancy(countryInput.value, sexInput.value, diffInYears.value);
  lifeExpectancy.value = response.value;
}

function onFormChange() {
  const personalInfo = {
    birthDate: birthDateInput.value,
    sex: sexInput.value,
    country: countryInput.value,
  }
  localStorage.setItem("personalInfo", JSON.stringify(personalInfo));
}
</script>

<template>
  <input type="date" v-model="birthDateInput" id="birthDate" @change="onFormChange()" />
  <input type="number" v-model="lifeExpectancy" />
  <select v-model="sexInput" @change="onFormChange()">
    <option value="M">Male</option>
    <option value="F">Female</option>
    <option value="X">Other</option>
  </select>

  <select v-model="countryInput" @change="onFormChange()">
    <option value="Canada">Canada</option>
    <option value="France">France</option>
  </select>

  <button @click="calculate()">Calculate</button>

  <div>
    <input type="checkbox" v-model="lifeSummaryEnabled" id="lifeSummaryEnabled" /><label for="lifeSummaryEnabled">Life Summary</label>
  </div>

  <LifeSummary
    v-if="lifeSummaryEnabled"
    :birthDate=birthDate
    :deathDate=deathDate
    />

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
