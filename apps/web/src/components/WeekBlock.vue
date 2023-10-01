<script setup lang="ts">
import { computed } from 'vue';
import { differenceInWeeks, addWeeks } from 'date-fns'


const props = defineProps<{
  weekNumber: number,
  birthDate: Date
}>()


const today = new Date();
const nbWeekLived = computed(() => differenceInWeeks(today, props.birthDate));

const title = computed(() => "Week " + props.weekNumber + " " + addWeeks(props.birthDate, props.weekNumber-1).toLocaleDateString() + " to " + addWeeks(props.birthDate, props.weekNumber).toLocaleDateString());
</script>

<template>
  <div class="square" :title=title :class="{ checked: weekNumber <= nbWeekLived }"></div>
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
</style>
