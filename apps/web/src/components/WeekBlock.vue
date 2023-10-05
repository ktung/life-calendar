<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { differenceInWeeks, addWeeks } from 'date-fns'
import { db } from '../db';

const props = defineProps<{
  weekNumber: number,
  birthDate: Date,
  journalingEnabled: boolean
}>()

let moodLevel = ref(0);

onMounted(async () => {
  if (props.journalingEnabled) {
    const journalingItems = await db.journalingItems
    .where("weekNumber").equals(props.weekNumber).toArray();
    if (journalingItems.length != 1) {
      return;
    }
    moodLevel.value = journalingItems[0].moodLevel;
  }
});

const today = new Date();
const nbWeekLived = computed(() => differenceInWeeks(today, props.birthDate));

const title = computed(() => "Week " + props.weekNumber + " " + addWeeks(props.birthDate, props.weekNumber-1).toLocaleDateString() + " to " + addWeeks(props.birthDate, props.weekNumber).toLocaleDateString());

let moodClassName = computed(() => `mood-${moodLevel.value} `)
</script>

<template>
  <div class="square" :title=title :class="[moodClassName, weekNumber <= nbWeekLived ? 'checked' : '' ]"></div>
</template>

<style scoped>
.square {
  width: 10px;
  height: 10px;
  border: 2px solid rgb(50, 50, 50);
  border-radius: 10%;
  display: inline-block;
}

.square:hover, .checked {
  background-color: rgb(50, 50, 50);
}

.square.checked.mood-10 {
  border: 2px solid rgb(40, 175, 65);
  background-color: rgb(40, 175, 65);
}
</style>
