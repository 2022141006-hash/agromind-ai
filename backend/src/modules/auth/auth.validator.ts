import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Ingrese un correo electrónico válido',
    'any.required': 'El correo electrónico es requerido',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es requerida',
  }),
});

export const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'any.required': 'El nombre es requerido',
  }),
  apellido: Joi.string().max(100).optional().allow('', null),
  email: Joi.string().email().required().messages({
    'string.email': 'Ingrese un correo electrónico válido',
    'any.required': 'El correo electrónico es requerido',
  }),
  password: Joi.string().min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
      'any.required': 'La contraseña es requerida',
    }),
  rol_id: Joi.number().integer().min(1).max(3).optional().default(3),
  organizacion: Joi.string().max(150).optional().allow('', null),
  cargo: Joi.string().max(100).optional().allow('', null),
  telefono: Joi.string().max(20).optional().allow('', null),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Ingrese un correo electrónico válido',
    'any.required': 'El correo electrónico es requerido',
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required(),
});
