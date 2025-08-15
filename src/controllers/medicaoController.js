import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Função para converter data string "dd/mm/yyyy hh:mm" para objeto Date
function parseDataAgendada(dataString) {
  const [data, hora] = dataString.split(' ')
  const [dia, mes, ano] = data.split('/')
  const [horaStr, minutoStr] = hora.split(':')
  return new Date(`${ano}-${mes}-${dia}T${horaStr}:${minutoStr}:00Z`)
}

// LISTAR medições
export async function listarMedicoes(req, res) {
  try {
    const medicoes = await prisma.medicao.findMany({
      include: { cliente: true, endereco: true }
    })
    res.json(medicoes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao listar medições" })
  }
}

// CADASTRAR medição
export async function cadastrarMedicao(req, res) {
  const { clienteId, enderecoId, descricao, status, dataAgendada } = req.body

  if (!clienteId || !enderecoId || !descricao || !dataAgendada) {
    return res.status(400).json({ erro: "Preencha clienteId, enderecoId, descricao e dataAgendada" })
  }

  try {
    const medicao = await prisma.medicao.create({
      data: { 
        clienteId: parseInt(clienteId),
        enderecoId: parseInt(enderecoId),
        dataAgendada: parseDataAgendada(dataAgendada),
        observacao: descricao,
        status: status || "pendente"
      }
    })
    res.status(201).json(medicao)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao cadastrar medição" })
  }
}

// EDITAR medição
export async function editarMedicao(req, res) {
  const { id } = req.params
  const { status, dataAgendada, largura, altura, observacao } = req.body

  try {
    const medicao = await prisma.medicao.update({
      where: { id: parseInt(id) },
      data: {
        status,
        dataAgendada: dataAgendada 
          ? (dataAgendada.includes('/') 
              ? parseDataAgendada(dataAgendada) 
              : new Date(dataAgendada))
          : undefined,
        largura: largura ? parseFloat(largura) : undefined,
        altura: altura ? parseFloat(altura) : undefined,
        observacao
      }
    })
    res.json(medicao)
  } catch (err) {
    console.error(err)
    res.status(400).json({ erro: "Erro ao atualizar medição" })
  }
}

// DELETAR medição
export async function deletarMedicao(req, res) {
  const { id } = req.params
  try {
    await prisma.medicao.delete({ where: { id: parseInt(id) } })
    res.json({ mensagem: 'Medição deletada com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao deletar medição" })
  }
}

// Atualizar status (PATCH)
export async function atualizarStatus(req, res) {
  const { id } = req.params
  const { status } = req.body

  try {
    const medicao = await prisma.medicao.update({
      where: { id: parseInt(id) },
      data: { status }
    })
    res.json(medicao)
  } catch (err) {
    console.error(err)
    res.status(400).json({ erro: "Erro ao atualizar status" })
  }
}