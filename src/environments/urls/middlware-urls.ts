const prefix = '/api/middleware/';
export const middlewareUrls = {
  balance: prefix + 'Player/Balance',
  playerStats: prefix + 'Player/PlayerStats',
  playerTransactions: prefix + 'Player/Transactions',
  login: prefix + 'Player/Login',
  enterPool: prefix + 'Pools/EnterPool',
  enterPoolSurvivor: prefix + 'Pools/EnterPoolSurvivor',
  getPlayerDetails: prefix + 'Player/PlayerDetailsByJWT',
  getPublicPoolInfo: prefix + 'Pools/GetAllPools',
  getPlayerPoolInfo: prefix + 'Pools/GetPlayerPools',
  getPoolDetails: prefix + 'Pools/GetPoolDetails',
  regOne: prefix + 'Player/Reg1',
  validateRegistrationCode: prefix + 'Player/ValidateCode',
  regTwo: prefix + 'Player/Reg2',
};
