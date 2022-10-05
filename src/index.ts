import { sha256 as nobleSHA256 } from "@noble/hashes/sha256";
import { sha512 as nobleSHA512 } from "@noble/hashes/sha512";
import { hash as stableSHA256 } from "@stablelib/sha256";
import { hash as stableSHA512 } from "@stablelib/sha512";
import { measureAsync, measureSync } from "./measure-func";

async function main() {
  console.log("----- SHA256 -----");

  measureSync("noble.sha256", (bytes) => {
    return nobleSHA256(bytes);
  });
  measureSync("stable.sha256", (bytes) => {
    return stableSHA256(bytes);
  });
  await measureAsync("noble.sha256:async", (bytes) => {
    return nobleSHA256(bytes);
  });
  await measureAsync("stable.sha256:async", (bytes) => {
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
  await measureAsync("noble.sha512:async", (bytes) => {
    return nobleSHA512(bytes);
  });
  await measureAsync("stable.sha512:async", (bytes) => {
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
