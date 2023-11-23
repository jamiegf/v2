export type MiddlewareResponse<T> = {
  Data: T;
  DevMessage: null;
  ErrorCode: null;
  ErrorMessage: null;
  ErrorTitle: null;
  Method: null;
  Status: 0;
  Timestamp: string;
};
export const MiddlewareStatusCode = {
  /** success */
  // success: 0,
  /** operation failed */
  failure: 1,
  /** Invalid Credentials */
  invalidCredentials: 2,
  /** caught in a try catch */
  exceptionError: 3,
  /** auth denied for login or logout */
  authorizationDenied: 4,
  /** resurce not found */
  notFound: 5,
  /** error when getting MiPlatform token */
  miPlatformError: 6,
  /** error when getting GameEngine token, */
  gameEngineError: 7,
  /** error when validating identity through Trulioo, or no match found in admin/search */
  noMatch: 8,
  /** error when validating through Gamstop */
  excluded: 9,
  /** error when validating through Gamstop */
  previous: 10,
  /** error when validating through Gamstop */
  notExcluded: 11,
  /** when a response contain soemthing unexpected/undocumented from a 3rd party */
  unexpected: 12,
  /**  not registered with MiPlatform */
  notRegistered: 13,
  /**  not registered with GameEngine */
  notRegisteredGE: 14,
  /**  generic error for en Payments */
  opgenericError: 15,
  /**  transaction succesfully reversed for en Payments */
  opTransactionReversed: 16,
  /**  transaction not succesfully reversed for en Payments */
  opTransactionReversedFailed: 17,
  /**  debit not succesfully for MiPlatform */
  mipDebitError: 18,
  /**  credit not succesfully for MiPlatform */
  mipCreditError: 19,
  /**  invalid JWT token, most probably expired, so ask for a new one */
  invalidJWT: 20,
  /** player did not validate his email yet */
  emailNotValidated: 21,
  /** player is kyc1, aka Trulioo passed but not email validated */
  kyc1: 22,
  /** player is kyc1, aka Trulioo NOT passed */
  kyc15: 23,
  /** code for ForgotPwd/ValidateCode expired */
  codeExpired: 24,
  /** code for ForgotPwd/ValidateCode is invalid/wrong */
  codeInvalid: 25,
  /** code for ForgotPwd/ValidateCode is invalid/wrong */
  codeAlreadyUsed: 26,
  /** this should never happend, it is about DB inconsistency, should be dealt with asap */
  missionImpossible: 27,
  /** when only some kycs are allowed to do some actions, for example, resend ConfirmationEmail only for KYC1 */
  wrongKYC: 28,
  /** when email already registered in MiPools DB */
  emailRegistered: 29,
  /** when username already registered in MiPools DB */
  usernameRegistered: 30,
  /** when combination Firstname, Surname, Year of Birth and Postcode already registered in MiPools DB */
  combinationRegistered: 31,
  /** when player is blocked and tries to login */
  playerBlocked: 32,
  /** when a deposit greater than depositLimit is attempted */
  overDepositLimit: 33,
  /** nothing to withdraw */
  nothingToWithdraw: 34,
  /** when making a whitdrawal, there should be at least one matching succesful deposit for the same user */
  noMatchingDeposit: 35,
  /** when making a whitdrawal, there is a minimal Withdraw Amount and you cannot withdraw below that */
  belowMinWDAmount: 36,
  /** when making a whitdrawal, there is a minimal Withdraw Amount and you cannot withdraw below that */
  aboveMaxWDAmount: 37,
  /** one withdraw per day rule */
  alreadyWithdrawedToday: 38,
  /** invalid parameter supplied */
  invalidParameter: 39,
  /** geochecking failed */
  geocheckingFailed: 40,
  /** duplicate call detected */
  duplicateDetected: 41,
  /**  expired JWT token */
  expiredJwt: 42,
  /**  user verified by trulioo but failed validation */
  truliooFailed: 43,
  /**  user verified by trulioo but failed validation */
  truliooStillProcessing: 44,
  /** hash validation failed */
  hashFailed: 45,
  /** when player is blocked and tries to login */
  playerSuspended: 46,
  /**  user verified by trulioo */
  truliooSucceeded: 47,
  /** when user tried too many times to do something (like resending validation codes within a configurable interval of time) */
  tooManyAttemppts: 48,
  /** when user is approaching the limit of validation codes per interval (for both 1 or 2 attempts remaining) */
  validationCodesCloseToLimit: 49,
  /** succesfull login but player needs to approve new terms and tin/out for marketing */
  newTerms: 100,
} as const;

export type MiddlewareStatusCode =
  (typeof MiddlewareStatusCode)[keyof typeof MiddlewareStatusCode];
