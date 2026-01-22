const pedidoModel = require("../models/pedidoModel");
const faturaModel = require("../models/faturaModel");

/* =====================================================
   CRIAR PEDIDO (PROPRIETÁRIO)
===================================================== */
async function criarPedido(req, res) {


  try {
    const { role, id_utilizador } = req.user;

    if (role !== "proprietario") {
      return res.status(403).json({
        error: "Only proprietarios can create pedidos"
      });
    }

    const { descricao, data, servicos, id_imovel } = req.body;

    /* ================= VALIDAÇÕES ================= */
    if (!data) {
      return res.status(400).json({ error: "Date is required" });
    }

    if (!id_imovel) {
      return res.status(400).json({ error: "Property is required" });
    }

    if (!Array.isArray(servicos) || !servicos[0]) {
      return res.status(400).json({ error: "Service is required" });
    }

    const idServico = Number(servicos[0]);

    /* ================= PROPRIETARIO REAL ================= */
    const proprietario =
      await pedidoModel.getProprietarioByUserId(id_utilizador);

    if (!proprietario) {
      return res.status(400).json({
        error: "User is not registered as proprietario"
      });
    }

    const idProprietario = proprietario.id_proprietario;

    /* ================= CONFLITO ================= */
    const conflict = await pedidoModel.hasConflict({
      idProprietario,
      idServico,
      data
    });

    if (conflict) {
      return res.status(409).json({
        error: "You already requested this service for this date."
      });
    }

    /* ================= SERVIÇO ================= */
    const servico = await pedidoModel.getServicoById(idServico);
    if (!servico) {
      return res.status(404).json({ error: "Service not found" });
    }

    const valor = servico.valor;
    const comissao = valor * 0.1;

    /* ================= CRIAR PEDIDO ================= */
    const pedido = await pedidoModel.createPedido({
      idProprietario,
      idServico,
      idImovel: id_imovel,
      descricao,
      valor,
      comissao,
      data
    });

    return res.status(201).json(pedido);

  } catch (error) {
    console.error("CREATE PEDIDO ERROR:", error);
    return res.status(500).json({ error: "Error creating pedido" });
  }
}

/* =====================================================
   LISTAR PEDIDOS DO PROPRIETÁRIO (MY REQUESTS)
===================================================== */
async function listarPedidosProprietario(req, res) {
  try {
    const { role, id_utilizador } = req.user;

    if (role !== "proprietario") {
      return res.status(403).json({ error: "Access denied" });
    }

    const proprietario =
      await pedidoModel.getProprietarioByUserId(id_utilizador);

    if (!proprietario) {
      return res.json([]);
    }

    const pedidos = await pedidoModel.getPedidosByProprietario(
      proprietario.id_proprietario
    );

    return res.json(pedidos);

  } catch (error) {
    console.error("LIST MY PEDIDOS ERROR:", error);
    return res.status(500).json({ error: "Error listing pedidos" });
  }
}

/* =====================================================
   LISTAR PEDIDOS DA EMPRESA (NOVO)
===================================================== */
async function listarPedidosEmpresa(req, res) {
  try {
    const { role, id_utilizador } = req.user;

    if (role !== "empresa") {
      return res.status(403).json({ error: "Access denied" });
    }

    const pedidos = await pedidoModel.getPedidosByEmpresa(id_utilizador);
    return res.json(pedidos);

  } catch (error) {
    console.error("LIST EMPRESA PEDIDOS ERROR:", error);
    return res.status(500).json({ error: "Error listing pedidos empresa" });
  }
}

/* =====================================================
   LISTAR TODOS OS PEDIDOS (ADMIN)
===================================================== */
async function listarTodosPedidos(req, res) {
  try {
    if (req.user.tipoUser !== 1) {
      return res.status(403).json({ error: "Admin only" });
    }

    const pedidos = await pedidoModel.getAllPedidos();
    return res.json(pedidos);

  } catch (error) {
    console.error("LIST ALL PEDIDOS ERROR:", error);
    return res.status(500).json({ error: "Error listing pedidos" });
  }
}

/* =====================================================
   OBTER PEDIDO POR ID
===================================================== */
async function obterPedidoPorId(req, res) {
  try {
    const idPedido = req.params.id;
    const pedido = await pedidoModel.getPedidoById(idPedido);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido not found" });
    }

    return res.json(pedido);

  } catch (error) {
    console.error("GET PEDIDO ERROR:", error);
    return res.status(500).json({ error: "Error fetching pedido" });
  }
}

/* =====================================================
   ATUALIZAR ESTADO (EMPRESA / ADMIN)
===================================================== */
async function atualizarEstadoPedido(req, res) {
  try {
    const { role } = req.user;
    const idPedido = req.params.id;
    const { novoEstado } = req.body;

    if (role !== "empresa" && role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const estadosPermitidos = [
      "pendente",
      "agendado",
      "andamento",
      "concluido",
      "cancelado"
    ];

    if (!estadosPermitidos.includes(novoEstado)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const atualizado = await pedidoModel.updatePedidoStatus(
      idPedido,
      novoEstado
    );

    return res.json(atualizado);

  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    return res.status(500).json({ error: "Error updating pedido status" });
  }
}

module.exports = {
  criarPedido,
  listarPedidosProprietario,
  listarPedidosEmpresa,     
  listarTodosPedidos,
  obterPedidoPorId,
  atualizarEstadoPedido
};
