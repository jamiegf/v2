export const PoolStatus = {
  available: 'available',
  upcoming: 'open',
  live: 'in_progress',
  completed: 'settled',
} as const;

export type PoolStatus = (typeof PoolStatus)[keyof typeof PoolStatus];
