const pedidoModel = require("../models/pedidoModel");

// Criar pedido (Proprietário)
async function criarPedido(req, res) {
  try {
    const idProprietario = req.user.linkedProfile?.id;

    if (!req.user.linkedProfile || req.user.linkedProfile.role !== "proprietario") {
      return res.status(403).json({ error: "Only proprietarios can create pedidos" });
    }

    const { descricao, valor, comissao, servicos } = req.body;

    if (!Array.isArray(servicos) || servicos.length === 0) {
      return res.status(400).json({ error: "Serviços inválidos" });
    }

    const pedido = await pedidoModel.createPedido(
      idProprietario,
      descricao,
      valor,
      comissao
    );

    await pedidoModel.addServicosToPedido(pedido.id_solicitarservico, servicos);

    res.status(201).json({
      message: "Pedido criado com sucesso",
      pedido
    });

  } catch (error) {
    console.error("Error creating pedido:", error);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
}

// Listar pedidos do proprietário autenticado
async function listarPedidosProprietario(req, res) {
  try {
    const idProprietario = req.user.linkedProfile?.id;

    if (!idProprietario) {
      return res.status(403).json({ error: "Acesso negado: não é proprietário" });
    }

    const pedidos = await pedidoModel.getPedidosByProprietario(idProprietario);

    for (const pedido of pedidos) {
      pedido.servicos = await pedidoModel.getServicosDoPedido(
        pedido.id_solicitarservico
      );
    }

    res.json(pedidos);

  } catch (error) {
    console.error("Error listing pedidos:", error);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
}

// Listar todos os pedidos (Admin)
async function listarTodosPedidos(req, res) {
  try {
    if (req.user.tipoUser !== 1) {
      return res.status(403).json({ error: "Acesso restrito a administradores" });
    }

    const pedidos = await pedidoModel.getAllPedidos();

    for (const pedido of pedidos) {
      pedido.servicos = await pedidoModel.getServicosDoPedido(
        pedido.id_solicitarservico
      );
    }

    res.json(pedidos);

  } catch (error) {
    console.error("Erro ao listar pedidos (admin):", error);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
}

// Obter pedido por ID (Admin ou Proprietário)
async function obterPedidoPorId(req, res) {
  try {
    const idPedido = req.params.id;
    const pedido = await pedidoModel.getPedidoById(idPedido);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    if (
      req.user.tipoUser !== 1 &&
      req.user.linkedProfile?.id !== pedido.id_proprietario
    ) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    pedido.servicos = await pedidoModel.getServicosDoPedido(idPedido);
    res.json(pedido);

  } catch (error) {
    console.error("Erro ao obter pedido por ID:", error);
    res.status(500).json({ error: "Erro ao obter pedido" });
  }
}

// Atualizar estado do pedido (Admin)
async function atualizarEstadoPedido(req, res) {
  try {
    if (req.user.tipoUser !== 1) {
      return res.status(403).json({ error: "Acesso restrito a administradores" });
    }

    const idPedido = req.params.id;
    const { novoEstado } = req.body;

    const estadosPermitidos = [
      "pendente",
      "agendado",
      "andamento",
      "concluido",
      "cancelado"
    ];

    if (!estadosPermitidos.includes(novoEstado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const pedido = await pedidoModel.getPedidoById(idPedido);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    const transicoes = {
      pendente: ["agendado", "cancelado"],
      agendado: ["andamento", "cancelado"],
      andamento: ["concluido"],
      concluido: [],
      cancelado: []
    };

    if (!transicoes[pedido.status].includes(novoEstado)) {
      return res.status(400).json({
        error: `Transição inválida: ${pedido.status} → ${novoEstado}`
      });
    }

    const atualizado = await pedidoModel.updatePedidoStatus(idPedido, novoEstado);

    res.json({
      message: "Estado atualizado com sucesso",
      pedido: atualizado
    });

  } catch (error) {
    console.error("Erro ao atualizar estado do pedido:", error);
    res.status(500).json({ error: "Erro ao atualizar estado do pedido" });
  }
}

module.exports = {
  criarPedido,
  listarPedidosProprietario,
  listarTodosPedidos,
  obterPedidoPorId,
  atualizarEstadoPedido
};
