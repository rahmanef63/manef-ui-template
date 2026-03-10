import { auth } from "@/auth";
import { createPrivateKey, createPublicKey } from "crypto";
import {
  SignJWT,
  calculateJwkThumbprint,
  exportJWK,
  type JWK,
} from "jose";

const DEFAULT_AUDIENCE = "manef-ui";
const PRIVATE_KEY_PARSE_HINT =
  "Set CONVEX_AUTH_PRIVATE_KEY as a complete RSA private key in PEM, PEM with \\n escapes, base64 PEM, or base64 DER PKCS8.";
const DEV_ONLY_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHF6UUiujKzl4h
8zkIVtrfhFWqUNfSCcYxjyzO0vEc3eIu1qHweX5fW65gqAOcAe6kFE56r1sISROx
4XolX5MhFXg2s0fl1iT/FR0Xsfdo8QsLFmc+8+N3B2qvVuZfPUPz9jM9RtH4pORh
Xv30Zn0ahwdv5hQgwHY4BbBOmQeVvtxl+gKQnsDuWO0sqg5iX9YzD7Ccow5asjAG
Zh3BvFl4+7zTgHDnKUX78RPU71v+ox5q7mJNhHwPpYY3kLj4Q2A3J00DnWct+H7o
b8ydcAn7cPP0pBqGSmQJei9CFuS/4CF1bOiYDmuh88h5v5C1DulPkpa9qc88ZLOK
COx6w5J5AgMBAAECggEAEdV8D/5Ei46WCNcK0nH/jAp+37MX8wptgshMZAtOw9ew
p0FMGYwJJ1jbuPw9x4hmK2eD+Pv4L3mS7IFUfd8iz0nYMLjhKvwNoH4Ksgf25Zuy
8SHDTbZksqGl5kCw0x9ab8D3iwUODaQWtW7PPgR2WgcmLaV0w/hDx/tYqPh7BpfN
T0XIJRrrI8y8D4+iJgAt3g9qDl/4p8nKt3moIuvN2ZxBvP9/KLEoVcldmXTpV0XH
1SmBh8mPQiyTIY/NE22bg9zIQ3MMc3gwv4lnUwDS+ewhJw9V2QfAFrG4De6L2ey4
rmqVf2/p5CulMsGHSc7fR8xwBj9zMH7zfJ11heDq8QKBgQDzt0N/1U13tU1NfW2U
kP4Qmxwl9gDsf9I2Hj2g3erSWiIRxCVqUSpUJQm79UUW+rvs57Rm9xqjpxlfRffm
BA7YlSGP+Q8gWJkgGLGqwPcpz2IB9/iEEI8Op27aqc1VFSeKVsxwHTomIjfjc1ZH
qaDr9kM5tPt5azJ9cfP5W69v7QKBgQDRfWRQ5hAkx1Phr4yV0PDaL1gNQ+JqNCwi
bQLghSQ+ji6I2P7KNo1VzsxdJiySg+TH5neIwhBlsqG6fYXlAf+v8wRHlkNu7cAr
F6VN8HD7E5w4K8uJ6IQ4g4pP9pAK9SL5UmPj1B7uS8PYYF2JV0P/tosOL0QmsKIl
YNtGgeX8EwKBgQDUo8jnhw39c0c1TW09fuWQ9nDr8JB1mOK5T0e1BLq6svMOZC6q
gI1j2A5Mly3WEuq8p9HXGtdrW4rsyu76GthNnJrxb3tq0j2XP6eVnW2oGONtFeSm
Qh0hGcs8LqksRWoQZctBGVE1t8aM7SKC5P/MQ2X6O0UfTo4D+4zi3mxv7QKBgE4L
NLKcu0L6wTjCR1D0YQkhA8ijqVJ/FKtAmV/ZQQJ2I8K5jLwjtV3VZY2v9tLx9SFl
xJPjOfCr/7VMoGno9bwlnVbuJ09nXAM2AkCIf0q2t9xjeU3fPexR0NSxD7Cy/VSK
VQ7j7H0K8RBnUQn9/Pq2+LOt8vcMQdJ4FjwRAPpjAoGAB6ijc2OzA/gh2j84XoOx
6bJ1FVfDt8so9lBm0fkTbk9U95wZ0Wx2Sa3vyul5P0rAkR4I2sqWKRwaPCszJ3bT
52gP8ztJ2Pqj1EaO0txU/qE0FfYGV9UA3v6fX7pBsyk5m5nmTGK5A1QTw7XggRfs
NQAtGxd2hg4kUo0tOs3t8k4=
-----END PRIVATE KEY-----`;

function normalizePem(value: string) {
  let normalized = value.trim();
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1);
  }

  normalized = normalized.replace(/\\n/g, "\n").trim();
  return normalized;
}

function isBase64(value: string) {
  return /^[A-Za-z0-9+/=\s]+$/.test(value);
}

function decodeBase64(value: string) {
  if (!isBase64(value)) {
    return null;
  }

  try {
    return Buffer.from(value.replace(/\s+/g, ""), "base64");
  } catch {
    return null;
  }
}

function assertCompletePem(value: string) {
  if (!value.includes("BEGIN ")) {
    return;
  }

  if (!value.includes("END ")) {
    throw new Error(
      "CONVEX_AUTH_PRIVATE_KEY appears truncated after decoding. Re-copy the full key or use `base64 -w 0 private-key.pem`.",
    );
  }
}

function decodeWrappedPemBody(value: string) {
  const match = value.match(
    /^-----BEGIN ([^-]+)-----\s*([A-Za-z0-9+/=\s]+?)\s*-----END \1-----$/s,
  );
  if (!match) {
    return null;
  }

  const [, , body] = match;
  const decoded = decodeBase64(body);
  if (decoded === null) {
    return null;
  }

  const decodedText = decoded.toString("utf8").trim();
  if (decodedText.includes("BEGIN ")) {
    const normalizedDecoded = normalizePem(decodedText);
    assertCompletePem(normalizedDecoded);
    return { format: "pem" as const, key: normalizedDecoded };
  }

  return { format: "der" as const, key: decoded };
}

function parsePrivateKeyMaterial(value: string) {
  const normalized = normalizePem(value);
  assertCompletePem(normalized);

  if (normalized.includes("BEGIN ")) {
    const wrappedBody = decodeWrappedPemBody(normalized);
    if (wrappedBody !== null) {
      return wrappedBody;
    }
    return { format: "pem" as const, key: normalized };
  }

  const decoded = decodeBase64(normalized);
  if (decoded === null) {
    return { format: "pem" as const, key: normalized };
  }

  const decodedText = decoded.toString("utf8").trim();
  if (decodedText.includes("BEGIN ")) {
    const normalizedDecoded = normalizePem(decodedText);
    assertCompletePem(normalizedDecoded);
    return { format: "pem" as const, key: normalizedDecoded };
  }

  return { format: "der" as const, key: decoded };
}

export function getConvexJwtIssuer() {
  const baseUrl =
    process.env.CONVEX_AUTH_ISSUER ??
    process.env.NEXTAUTH_URL ??
    process.env.HOSTED_URL ??
    "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/api/convex-auth`;
}

export function getConvexJwtAudience() {
  return process.env.CONVEX_AUTH_AUDIENCE ?? DEFAULT_AUDIENCE;
}

function getPrivateKeyPem() {
  const configured = process.env.CONVEX_AUTH_PRIVATE_KEY;
  if (configured) {
    return configured;
  }

  if (process.env.NODE_ENV !== "production") {
    return normalizePem(DEV_ONLY_PRIVATE_KEY);
  }

  throw new Error(
    "Missing CONVEX_AUTH_PRIVATE_KEY. Set an RSA private key in manef-ui runtime before using Convex browser auth in production.",
  );
}

function getPrivateKey() {
  const material = parsePrivateKeyMaterial(getPrivateKeyPem());

  try {
    if (material.format === "pem") {
      return createPrivateKey({
        format: "pem",
        key: material.key,
      });
    }

    try {
      return createPrivateKey({
        format: "der",
        type: "pkcs8",
        key: material.key,
      });
    } catch {
      return createPrivateKey({
        format: "der",
        type: "pkcs1",
        key: material.key,
      });
    }
  } catch (error) {
    throw new Error(
      `Failed to parse CONVEX_AUTH_PRIVATE_KEY. ${PRIVATE_KEY_PARSE_HINT}`,
      { cause: error as Error },
    );
  }
}

export async function getConvexJwk() {
  const publicKey = createPublicKey(getPrivateKey());
  const jwk = (await exportJWK(publicKey)) as JWK;
  const kid = await calculateJwkThumbprint(jwk);
  return {
    ...jwk,
    alg: "RS256",
    kid,
    use: "sig",
  };
}

export async function issueConvexAccessToken() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  const issuer = getConvexJwtIssuer();
  const audience = getConvexJwtAudience();
  const subject = session.user.email.toLowerCase();
  const key = getPrivateKey();
  const jwk = await getConvexJwk();

  return await new SignJWT({
    email: session.user.email,
    name: session.user.name ?? session.user.email.split("@")[0],
  })
    .setProtectedHeader({ alg: "RS256", kid: jwk.kid, typ: "JWT" })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject(subject)
    .setExpirationTime("1h")
    .sign(key);
}
