import { measureAsync, measureSync } from "./src/measure-func";
import { sha256 as nobleSHA256 } from "@noble/hashes/sha256";
import { hash as stableSHA256 } from "@stablelib/sha256";
import { sha512 as nobleSHA512 } from "@noble/hashes/sha512";
import { hash as stableSHA512 } from "@stablelib/sha512";

export async function main() {
  const crypto = await import("crypto");

  console.log("----- SHA256 -----");

  measureSync("noble.sha256", (bytes) => {
    return nobleSHA256(bytes);
  });
  measureSync("stable.sha256", (bytes) => {
    return stableSHA256(bytes);
  });
  measureSync("node-native.sha256", (bytes) => {
    return new Uint8Array(crypto.createHash("sha256").update(bytes).digest());
  });

  console.log("----- SHA512 -----");

  measureSync("noble.sha512", (bytes) => {
    return nobleSHA512(bytes);
  });
  measureSync("stable.sha512", (bytes) => {
    return stableSHA512(bytes);
  });
  measureSync("node-native.sha512", (bytes) => {
    return new Uint8Array(crypto.createHash("sha512").update(bytes).digest());
  });
}

main();
