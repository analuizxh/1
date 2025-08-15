import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// LISTAR clientes
export async function listarClientes(req, res) {
  try {
    const clientes = await prisma.cliente.findMany({
      where: { empresaId: req.user.id },
      include: { enderecos: true }
    })
    res.json(clientes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// CADASTRAR cliente
export async function cadastrarCliente(req, res) {
  const { nome, telefone, endereco } = req.body

  if (!nome || !telefone || !endereco) {
    return res.status(400).json({ erro: "Preencha nome, telefone e endereço" })
  }

  try {
    const novoCliente = await prisma.cliente.create({
      data: {
        nome,
        telefone,
        empresa: { connect: { id: req.user.id } },
        enderecos: {
          create: [{
            logradouro: endereco.logradouro,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            cep: endereco.cep
          }]
        }
      },
      include: { enderecos: true }
    })
    res.status(201).json(novoCliente)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: err.message })
  }
}

// EDITAR cliente
export async function editarCliente(req, res) {
  const { id } = req.params
  const { nome, telefone, endereco, observacao } = req.body

  try {
    const cliente = await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        telefone,
        observacao,
        enderecos: {
          update: {
            where: { id: endereco.id },
            data: {
              logradouro: endereco.logradouro,
              bairro: endereco.bairro,
              cidade: endereco.cidade,
              cep: endereco.cep
            }
          }
        }
      },
      include: { enderecos: true }
    })
    res.json(cliente)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: error.message })
  }
}

// DELETAR cliente
export async function deletarCliente(req, res) {
  const { id } = req.params
  try {
    await prisma.cliente.delete({ where: { id: parseInt(id) } })
    res.json({ mensagem: 'Cliente deletado com sucesso' })
  } catch (err) {
    res.status(400).json({erro: "Erro ao excluir cliente"})
  }
}