import Dexie, { Table } from 'dexie';

interface DailyMission {
  playerAddress: string;
  mission: string;
  timestamp: number;
}

export class ByteBeastsDB extends Dexie {
  dailyMissions!: Table<DailyMission>;

  constructor() {
    super('bytebeasts_db');
    this.version(1).stores({
      dailyMissions: 'playerAddress, mission, timestamp'
    });
  }
}

export const db = new ByteBeastsDB(); 