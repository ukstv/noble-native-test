import { randomBytes } from "@stablelib/random";
import { sha256 as nobleSHA256 } from "@noble/hashes/sha256";
import { sha512 as nobleSHA512 } from "@noble/hashes/sha512";
import { hash as stableSHA256 } from "@stablelib/sha256";
import { hash as stableSHA512 } from "@stablelib/sha512";

const bytes = Array.from({ length: 1024 }).map((_, index) =>
  randomBytes(index + 1)
);

const ATTEMPTS = 100;

function measureSync(name: string, fn: (bytes: Uint8Array) => Uint8Array) {
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

async function measureAsync(
  name: string,
  fn: (bytes: Uint8Array) => Promise<Uint8Array>
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

async function main() {
  console.log("----- SHA256 -----");

  measureSync("noble.sha256", (bytes) => {
    return nobleSHA256(bytes);
  });
  measureSync("stable.sha256", (bytes) => {
    return stableSHA256(bytes);
  });
  await measureAsync("crypto.subtle.sha256", (bytes) => {
    return crypto.subtle
      .digest("SHA-256", bytes)
      .then((r) => new Uint8Array(r));
  });

  console.log("----- SHA512 -----");

  measureSync("noble.sha512", (bytes) => {
    return nobleSHA512(bytes);
  });
  measureSync("stable.sha512", (bytes) => {
    return stableSHA512(bytes);
  });
  await measureAsync("crypto.subtle.sha512", (bytes) => {
    return crypto.subtle
      .digest("SHA-512", bytes)
      .then((r) => new Uint8Array(r));
  });
}

setTimeout(() => {
  main().catch((e) => {
    console.error(e);
  });
}, 1000);
