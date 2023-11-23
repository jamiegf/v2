export type GameEngineNumber = number | string;

export function parseGameEngineNumber(geNumber: GameEngineNumber): number {
  const n = parseFloat(geNumber as string);
  if (isNaN(n)) throw new Error(`${geNumber} cannot be parsed to a number`);
  return n;
}
