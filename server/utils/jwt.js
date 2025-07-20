const JWT_SECRET = 'my-secret-key-for-jwt-2023';

// Since we can't install jsonwebtoken, we'll simulate a simple JWT-like token
// In a real project, you should use the 'jsonwebtoken' library

const signToken = (payload) => {
  // This is a simplified simulation of JWT signing
  // In production, use a proper JWT library
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = Buffer.from(JWT_SECRET).toString('base64');
  return `${header}.${body}.${signature}`;
};

const verifyToken = (token) => {
  // Simplified verification (not secure, just for demonstration)
  if (!token) return null;
  const [header, payload, signature] = token.split('.');
  if (signature !== Buffer.from(JWT_SECRET).toString('base64')) {
    return null;
  }
  return JSON.parse(Buffer.from(payload, 'base64').toString());
};

module.exports = { signToken, verifyToken };
