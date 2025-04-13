import CryptoJS from 'crypto-js';

export interface GameSeeds {
  serverSeed: string;
  clientSeed: string;
  nonce: string;
}

export function generateInitialSeeds(): GameSeeds {
  const serverSeed = CryptoJS.lib.WordArray.random(32).toString();
  const clientSeed = CryptoJS.lib.WordArray.random(32).toString();
  const nonce = '1';
  
  return {
    serverSeed,
    clientSeed,
    nonce
  };
}

export function getServerSeedHash(serverSeed: string): string {
  return CryptoJS.SHA256(serverSeed).toString(CryptoJS.enc.Hex);
}

export function generateSquarePosition(seeds: GameSeeds): number {
  const { serverSeed, clientSeed, nonce } = seeds;
  
  const string1 = `${nonce}:${serverSeed}:${nonce}`;
  const string2 = `${nonce}:${clientSeed}:${nonce}`;
  
  const hmac512 = CryptoJS.HmacSHA512(string1, string2).toString(CryptoJS.enc.Hex);
  const string3 = hmac512.substring(0, 8);
  const number = parseInt(string3, 16);
  
  // Adjust the divisor to get a number between 0 and 24 (for 25 squares)
  return Math.floor(number / (0xffffffff / 25));
}