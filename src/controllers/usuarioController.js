import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const register = async (req, res) => {
  // ... (mantido igual) ...
}

export const login = async (req, res) => {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' })
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' })
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: 'Erro interno ao fazer login' })
  }
}