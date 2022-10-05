import { randomBytes } from "@stablelib/random";

const ATTEMPTS = 100;

const bytes = Array.from({ length: 1024 }).map((_, index) =>
  randomBytes(index + 1)
);

export function measureSync(
  name: string,
  fn: (bytes: Uint8Array) => Uint8Array
) {
  const times: Array<number> = [];
  const digests: Array<Uint8Array> = [];
  for (let j = 0; j < ATTEMPTS; j++) {
    for (let i = 0; i < bytes.length; i++) {
      const before = performance.now();
      const digest = fn(bytes[i]);
      const after = performance.now();
      times.push(after - before);
      digests.push(digest);
    }
  }
  const sum = times.reduce((acc, t) => acc + t, 0);
  const average = sum / times.length;
  console.log(`${name}:`, average);
  return digests;
}

export async function measureAsync(
  name: string,
  fn: (bytes: Uint8Array) => Promise<Uint8Array> | Uint8Array
) {
  const times: Array<number> = [];
  const digests: Array<Uint8Array> = [];
  for (let j = 0; j < ATTEMPTS; j++) {
    for (let i = 0; i < bytes.length; i++) {
      const before = performance.now();
      const digest = await fn(bytes[i]);
      const after = performance.now();
      times.push(after - before);
      digests.push(digest);
    }
  }
  const sum = times.reduce((acc, t) => acc + t, 0);
  const average = sum / times.length;
  console.log(`${name}:`, average);
  return digests;
}
