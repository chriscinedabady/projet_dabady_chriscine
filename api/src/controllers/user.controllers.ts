import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Op, UniqueConstraintError, where, fn, col } from "sequelize";
import db from "../models";
import { handleNotFound, handleServerError } from "../utils/response";
import { validateIdParam } from "../validators/pollution.validator";

const Users = db.users;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Récupère la liste de tous les utilisateurs (GET /api/users).
 */
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Users.findAll({
      attributes: ["id", "username", "email"],
      order: [["id", "ASC"]]
    });
    res.status(200).json(data);
  } catch (err: unknown) {
    handleServerError(res, "la récupération des utilisateurs", err);
  }
};

/**
 * Crée un nouvel utilisateur (POST /api/users).
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        message: "Les champs username, email et password sont obligatoires."
      });
      return;
    }
    
    // Normalisation et validation des formats
    const cleanUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (cleanUsername.length < 2 || cleanUsername.length > 50) {
      res.status(400).json({
        message: "Le nom d'utilisateur doit contenir entre 2 et 50 caractères."
      });
      return;
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      res.status(400).json({
        message: "Le format de l'adresse email est invalide."
      });
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule et un chiffre."
      });
      return;
    }

    // 1. Vérification des doublons (username ou email déjà utilisé)
    const existingUser = await Users.findOne({
      where: {
        [Op.or]: [
          where(fn("LOWER", col("email")), normalizedEmail),
          where(fn("LOWER", col("username")), cleanUsername.toLowerCase())
        ]
      }
    });

    if (existingUser) {
      const isEmailTaken = existingUser.email.toLowerCase() === normalizedEmail;
      res.status(409).json({
        message: isEmailTaken
          ? "Cette adresse email est déjà associée à un compte."
          : "Ce nom d'utilisateur est déjà pris."
      });
      return;
    }

    // 2. Hachage sécurisé du mot de passe avec bcrypt (salt cost = 10)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Création de l'utilisateur avec le mot de passe haché
    const nouvelUtilisateur = await Users.create({
      username : cleanUsername,
      email : normalizedEmail,
      password: hashedPassword
    });

    // 4. Réponse sans jamais exposer le mot de passe
    res.status(201).json({
      id: nouvelUtilisateur.id,
      username: nouvelUtilisateur.username,
      email: nouvelUtilisateur.email
    });
  } catch (err: unknown) {
    if (err instanceof UniqueConstraintError) {
      const conflictField = err.errors?.[0]?.path;
      res.status(409).json({
        message:
          conflictField === "email"
            ? "Cette adresse email est déjà associée à un compte."
            : "Ce nom d'utilisateur ou cette adresse email est déjà utilisé."
      });
      return;
    }
    handleServerError(res, "la création de l'utilisateur", err);
  }
};

/**
 * Authentifie un utilisateur (POST /api/users/login).
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, email, username, password } = req.body;
    const rawLogin = identifier ?? email ?? username;

    if (
      typeof rawLogin !== "string" ||
      typeof password !== "string" ||
      !rawLogin.trim() ||
      !password
    ) {
      res.status(400).json({
        message: "L'identifiant (email ou nom d'utilisateur) et le mot de passe sont obligatoires."
      });
      return;
    }

    const cleanLogin = rawLogin.trim().toLowerCase();

    const user = await Users.findOne({
      where: {
        [Op.or]: [
          where(fn("LOWER", col("email")), cleanLogin),
          where(fn("LOWER", col("username")), cleanLogin)
        ]
      }
    });

    if (!user || !user.password) {
      res.status(401).json({
        message: "Identifiant ou mot de passe incorrect."
      });
      return;
    }

    const isHashed = user.password.startsWith("$2");
    const isPasswordValid = isHashed
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!isPasswordValid) {
      res.status(401).json({
        message: "Identifiant ou mot de passe incorrect."
      });
      return;
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (err: unknown) {
    handleServerError(res, "la connexion de l'utilisateur", err);
  }
};

/**
 * Supprime un utilisateur par son identifiant (DELETE /api/users/:id).
 */
export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = validateIdParam(req.params.id);
  if (id === null) {
    res.status(400).json({
      message: "L'identifiant fourni est invalide."
    });
    return;
  }

  try {
    const deletedCount = await Users.destroy({
      where: { id }
    });
    if (deletedCount === 0) {
      handleNotFound(res, "utilisateur", id);
      return;
    }
    res.status(200).json({
      message: "Utilisateur supprimé avec succès."
    });
  } catch (err: unknown) {
    handleServerError(res, `la suppression de l'utilisateur id=${id}`, err);
  }
};

export default { getAll, create, login, remove };

