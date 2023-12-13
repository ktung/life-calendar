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
      moodLevel.value = -1;
      return;
    }
    moodLevel.value = journalingItems[0].moodLevel;
  }
});

const today = new Date();
const nbWeekLived = computed(() => differenceInWeeks(today, props.birthDate));

const title = computed(() => "Week " + props.weekNumber + " " + addWeeks(props.birthDate, props.weekNumber-1).toLocaleDateString() + " to " + addWeeks(props.birthDate, props.weekNumber).toLocaleDateString());

let moodClassName = computed(() => {
  if (moodLevel.value == -1) {
    return "";
  }

  return `mood-${moodLevel.value}`;
})
</script>

<template>
  <div class="square" :title=title :class="[moodClassName, weekNumber <= nbWeekLived ? 'checked' : '' ]"></div>
</template>

<style scoped>
@media print {
  * {
    print-color-adjust: exact;
  }
}

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

.square.checked.mood-0 {
  border: 2px solid hsl(131, 63%, 22%);
  background-color: hsl(131, 63%, 22%);
}
.square.checked.mood-1 {
  border: 2px solid hsl(131, 63%, 42%);
  background-color: hsl(131, 63%, 42%);
}
.square.checked.mood-2 {
  border: 2px solid hsl(131, 63%, 62%);
  background-color: hsl(131, 63%, 62%);
}
.square.checked.mood-3 {
  border: 2px solid hsl(131, 63%, 82%);
  background-color: hsl(131, 63%, 82%);
}
</style>
