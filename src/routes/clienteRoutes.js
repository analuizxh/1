import { Router } from 'express'
import { 
  listarClientes, 
  cadastrarCliente, 
  editarCliente, 
  deletarCliente 
} from '../controllers/clienteController.js'
import auth from '../middlewares/authMiddleware.js'

const router = Router()

// LISTAR clientes
router.get("/", auth, listarClientes)

// CADASTRAR cliente
router.post("/", auth, cadastrarCliente)

// EDITAR cliente
router.put("/:id", auth, editarCliente)

// DELETAR cliente
router.delete("/:id", auth, deletarCliente)

export default router