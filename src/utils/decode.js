export function decode(token) {
  try {
    const [payloadBase64] = token.split(".");
    const json = atob(payloadBase64);
    return JSON.parse(json);
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}