import { FastifyPluginAsync } from "fastify";
import { Type } from "@sinclair/typebox";
import {
  NuevoUsuarioSchema,
  NuevoUsuarioType,
  UsuarioSchema,
} from "../../types/usuario.js";
import * as usuarioService from "../../services/usuarios.js";

const descripcionPost =
  " ## Implementar y validar \n " +
  "- token \n " +
  "- Que coincidan ambas contraseñas antes del user handler. \n " +
  "- body. \n " +
  "- response. \n " +
  "- que el usuario que ejecuta es administrador.";

const usuariosRoutes: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", {
    schema: {
      tags: ["usuarios"],
      summary: "Obtener todos los usuarios",
      description:
        " ## Implementar y validar \n " +
        " - token \n " +
        " - que el usuario que ejecuta es administrador \n " +
        " - response. \n ",
      response: {
        200: {
          description: "Listado de usuarios. ",
          content: {
            "application/json": {
              schema: Type.Array(UsuarioSchema),
            },
          },
        },
      },
    },
    onRequest: [fastify.verifyJWT, fastify.verifyAdmin],
    handler: async function (request, reply) {
      return usuarioService.findAll();
    },
  });

  fastify.get("/verify", {
    onRequest: [fastify.verifyJWT, fastify.verifyAdmin],
    schema: {
      tags: ["usuarios"],
      summary: "Obtener usuario por token",
      description:
        "Es usado para traer un usuario por su token.",
      response: {
        200: {
          description: "Usuario.",
          content: {
            "application/json": {
              schema: Type.Omit(UsuarioSchema, ["username", "email", "is_admin"]),
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
        const user = request.user as {
            id_usuario: number;
        };
        return usuarioService.findById(user.id_usuario);
    },
  });

  fastify.post("/", {
    schema: {
      body: NuevoUsuarioSchema,
      tags: ["usuarios"],
      summary: "Crear usuario.",
      description: descripcionPost,
      response: {
        201: {
          description: "Usuario creado.",
          content: {
            "application/json": {
              schema: UsuarioSchema,
            },
          },
        },
      },
    },
    onRequest: [fastify.verifyJWT, fastify.verifyAdmin],
    handler: async function (request, reply) {
      const nuevoUsuario = request.body as NuevoUsuarioType;
      reply.code(201);
      return usuarioService.create(nuevoUsuario);
    },
  });
};

export default usuariosRoutes;
