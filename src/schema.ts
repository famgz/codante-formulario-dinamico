import { z } from 'zod';

const requiredMessage = (field: string) =>
  `O campo ${field} precisa ser preenchido`;

export const userRegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, requiredMessage('nome'))
      .min(3, 'O nome deve ter no mínimo 3 caracteres')
      .max(255, 'O nome deve ter no máximo 255 caracteres'),
    email: z.string().min(1, requiredMessage('email')).email('Email inválido'), // min(1) stands for required
    password: z.string().min(8, 'A senha deve ter no minimo 8 caracteres'),
    password_confirmation: z
      .string()
      .min(8, 'A senha deve ter no minimo 8 caracteres'),
    phone: z
      .string()
      .min(1, requiredMessage('telefone'))
      .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
    cpf: z
      .string()
      .min(1, requiredMessage('CPF'))
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
    zipcode: z
      .string()
      .min(1, requiredMessage('CEP'))
      .regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
    city: z.string().min(1, requiredMessage('cidade')),
    address: z.string().min(1, requiredMessage('endereço')),
    terms: z.literal<boolean>(true, {
      errorMap: () => ({ message: 'Voce precisa aceitar os termos de uso' }),
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'As senhas devem coincidir',
    path: ['password_confirmation'],
  });

export type UserRegister = z.infer<typeof userRegisterSchema>;
