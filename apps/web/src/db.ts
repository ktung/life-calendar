import Dexie, { Table } from 'dexie';

export interface JournalingItem {
  weekNumber: number;
  moodLevel: number;
  notes: string;
}

export class DexieDB extends Dexie {
  // Tables are added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  journalingItems!: Table<JournalingItem>

  constructor() {
    super('LifeCalendarDB');
    this.version(1).stores({
      journalingItems: '&weekNumber'
    });
  }
}

export const db = new DexieDB();
