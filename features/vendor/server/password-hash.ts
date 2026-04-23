import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const passwordHashPrefix = "scrypt";
const passwordSaltBytes = 16;
const passwordKeyLength = 64;

export function hashVendorPassword(password: string, saltHex = createSalt()) {
  const normalizedPassword = normalizePassword(password);
  const derivedKeyHex = scryptSync(normalizedPassword, saltHex, passwordKeyLength).toString("hex");

  return `${passwordHashPrefix}$${saltHex}$${derivedKeyHex}`;
}

export function verifyVendorPassword(password: string, storedHash: string) {
  const parsed = parseVendorPasswordHash(storedHash);
  if (!parsed) {
    return false;
  }

  const actualHash = Buffer.from(parsed.hashHex, "hex");
  const expectedHash = Buffer.from(
    scryptSync(normalizePassword(password), parsed.saltHex, passwordKeyLength).toString("hex"),
    "hex",
  );

  if (actualHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(actualHash, expectedHash);
}

function parseVendorPasswordHash(value: string) {
  const parts = value.split("$");
  if (parts.length !== 3) {
    return null;
  }

  const [prefix, saltHex, hashHex] = parts;
  if (
    prefix !== passwordHashPrefix ||
    !saltHex ||
    !hashHex ||
    !isHexString(saltHex) ||
    !isHexString(hashHex)
  ) {
    return null;
  }

  return {
    saltHex,
    hashHex,
  };
}

function normalizePassword(password: string) {
  return password.normalize("NFKC");
}

function createSalt() {
  return randomBytes(passwordSaltBytes).toString("hex");
}

function isHexString(value: string) {
  return /^[a-f0-9]+$/i.test(value);
}
