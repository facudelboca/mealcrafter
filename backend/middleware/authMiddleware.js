import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mealcrafter_super_secret_jwt_key_2026';

export default function authMiddleware(req, res, next) {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: 'No autorizado. Sesión no encontrada.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    next();
  } catch (error) {
    console.error('Auth middleware verification error:', error);
    return res.status(401).json({ error: 'No autorizado. Sesión inválida o expirada.' });
  }
}
