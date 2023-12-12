<script setup lang="ts">
import { addWeeks } from 'date-fns'
import { onMounted, ref } from 'vue';
import { db } from '../db';

const props = defineProps<{
  weekNumber: number,
  birthDate: Date
}>();

onMounted(async () => {
  const journalingItems = await db.journalingItems
    .where("weekNumber").equals(props.weekNumber).toArray();

  if (journalingItems.length != 1) {
    return;
  }

  moodLevelInput.value = journalingItems[0].moodLevel;
  notesTextarea.value = journalingItems[0].notes;
});

const moodLevelInput = ref(0);
const notesTextarea = ref('');

function save() {
  db.journalingItems.put({
    weekNumber: props.weekNumber,
    moodLevel: moodLevelInput.value,
    notes: notesTextarea.value,
  });
}
</script>

<template>
  <div>
    <h1>Week {{ props.weekNumber }} : {{ addWeeks(props.birthDate, props.weekNumber-1).toLocaleDateString() }} to {{ addWeeks(props.birthDate, props.weekNumber).toLocaleDateString() }}</h1>
    <label>Mood level</label><input v-model="moodLevelInput" type="range" min="0" max="3">
    <textarea v-model="notesTextarea">Journaling {{ props.weekNumber }}</textarea>
    <button @click="save">Save</button>
  </div>
</template>

<style scoped>
</style>
