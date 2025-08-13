export default function decodeJwtPayload(token) {
  const base64 = token.split('.')[1]
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(token.split('.')[1].length + (4 - token.split('.')[1].length % 4) % 4, '=');
  return JSON.parse(atob(base64));
}