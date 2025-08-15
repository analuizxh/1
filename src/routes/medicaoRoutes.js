import { Router } from 'express'
import { 
  listarMedicoes, 
  cadastrarMedicao, 
  editarMedicao, 
  deletarMedicao 
} from '../controllers/medicaoController.js'
import auth from '../middlewares/authMiddleware.js'
import { atualizarStatus } from '../controllers/medicaoController.js'

const router = Router()

// LISTAR medições
router.get('/', auth, listarMedicoes)

// CADASTRAR medição
router.post('/', auth, cadastrarMedicao)

// EDITAR medição
router.put('/:id', auth, editarMedicao)

// DELETAR medição
router.delete('/:id', auth, deletarMedicao)

// Atualizar apenas status
router.patch("/:id/status", auth, atualizarStatus)

export default router