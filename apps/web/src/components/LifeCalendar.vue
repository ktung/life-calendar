<script setup lang="ts">
import { computed, ref, onMounted, Ref, watch } from 'vue';
import { addDays, addYears, differenceInWeeks, differenceInYears } from 'date-fns'
import WeekBlock from './WeekBlock.vue';
import LifeSummary from './LifeSummary.vue';
import JournalingComponent from './JournalingComponent.vue';
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
    lifeExpectancyInput.value = personalInfo.lifeExpectancy;
  }

  const viewsSettingsJSON = localStorage.getItem("viewsSettings");
  if (!!viewsSettingsJSON) {
    const viewsSettings = JSON.parse(viewsSettingsJSON);
    lifeEstimationEnabled.value = viewsSettings.lifeEstimationEnabled;
    lifeSummaryEnabled.value = viewsSettings.lifeSummaryEnabled;
    journalingEnabled.value = viewsSettings.journalingEnabled;
  }
});

const birthDateInput = ref(new Date().toLocaleDateString("fr-ca"));
const sexInput = ref('M');
const countryInput = ref('Canada');
const lifeExpectancyInput = ref(0);

const lifeEstimationEnabled = ref(true);
const lifeSummaryEnabled = ref(true);
const journalingEnabled = ref(true);
const lifeExpectancySourceUrl = ref('');

let selectedWeek: Ref<number | undefined> = ref(undefined);

let birthDate = computed(() => new Date(birthDateInput.value!));
const diffInYears = computed(() => differenceInYears(today, birthDate.value));

const today = new Date();
const deathDate = computed(() => {
  const birthDateAddYears = addYears(birthDate.value, lifeExpectancyInput.value);
  return addDays(birthDateAddYears, lifeExpectancyInput.value%1*365);
});
let lifeInWeeks = computed(() => differenceInWeeks(deathDate.value, birthDate.value));

async function estimateLifeExpectancy() {
  const response = await getLifeExpectancy(countryInput.value, sexInput.value, diffInYears.value);
  lifeExpectancyInput.value = diffInYears.value+response.value;
  lifeExpectancySourceUrl.value = response.url;
}

function onFormChange() {
  const personalInfo = {
    birthDate: birthDateInput.value,
    sex: sexInput.value,
    country: countryInput.value,
    lifeExpectancy: lifeExpectancyInput.value,
  }
  localStorage.setItem("personalInfo", JSON.stringify(personalInfo));
}

function selectWeek(weekNumber: number) {
  selectedWeek.value = weekNumber;
}

function closeJournaling() {
  selectedWeek.value = undefined;
}
watch([lifeEstimationEnabled, lifeSummaryEnabled, journalingEnabled], () => {
  const viewsSettings = {
    lifeEstimationEnabled: lifeEstimationEnabled.value,
    lifeSummaryEnabled: lifeSummaryEnabled.value,
    journalingEnabled: journalingEnabled.value
  }
  localStorage.setItem("viewsSettings", JSON.stringify(viewsSettings));
});
</script>

<template>
  <label>Birthdate</label>
  <input type="date" v-model="birthDateInput" id="birthDate" @change="onFormChange()" />
  <label>Life Expectancy</label>
  <input type="number" v-model="lifeExpectancyInput" @change="onFormChange()" />

  <div v-if="lifeEstimationEnabled">
    <label>Estimation with</label>
    <select>
      <option>United Nations</option>
    </select>
    <label>Gender</label>
    <select v-model="sexInput" @change="onFormChange()">
      <option value="M">Male</option>
      <option value="F">Female</option>
      <option value="X">Other</option>
    </select>
    <label>Country</label>
    <select v-model="countryInput" @change="onFormChange()">
      <option value="Canada">Canada</option>
      <option value="France">France</option>
    </select>

    <button @click="estimateLifeExpectancy()">Estimate</button><br/>
    <span v-if="lifeExpectancySourceUrl">Based on <a :href="lifeExpectancySourceUrl" target="_blank">United Nations</a></span>
  </div>

  <div>
    <input type="checkbox" v-model="lifeEstimationEnabled" id="lifeEstimationEnabled" /><label for="lifeEstimationEnabled">Life Estimation</label>
    <input type="checkbox" v-model="lifeSummaryEnabled" id="lifeSummaryEnabled" /><label for="lifeSummaryEnabled">Life Summary</label>
    <input type="checkbox" v-model="journalingEnabled" id="journalingEnabled" /><label for="journalingEnabled">Journaling</label>
  </div>

  <LifeSummary
    v-if="lifeSummaryEnabled"
    :birthDate=birthDate
    :deathDate=deathDate
    />

  <button v-if="journalingEnabled && !!selectedWeek" @click="closeJournaling">Close journaling</button>
  <template v-for="i in lifeInWeeks" :key="i">
    <JournalingComponent
      v-if="journalingEnabled && selectedWeek === i"
      :birthDate=birthDate
      :weekNumber=selectedWeek
      />
  </template>

  <div class="life-calendar">
    <template v-for="i in lifeInWeeks" :key="i">
      <WeekBlock
        :birthDate=birthDate
        :weekNumber=i
        :journalingEnabled=journalingEnabled
        @click="selectWeek(i)"
        />
    </template>
  </div>
</template>

<style scoped>
.life-calendar {
  display: grid;
  grid-template-columns: repeat(52, 1fr);
  gap: 5px;
}
</style>
