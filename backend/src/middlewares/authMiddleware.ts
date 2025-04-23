import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // Verificando se o token JWT foi passado
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Verificando se o token é válido
  if (!token) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token não fornecido." });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      // Adicionando o usuário decodificado ao objeto de requisição
      req.user = decoded;

      next();
    } catch (error) {
      // Se o token for inválido, retorna um erro e rejeita a requisição
      res.status(400).json({ message: "Token inválido." });
    }
  }
};
