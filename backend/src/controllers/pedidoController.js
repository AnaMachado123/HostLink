const pedidoModel = require("../models/pedidoModel");

// Criar pedido (PROPRIETÁRIO)
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
      const servicos = await pedidoModel.getServicosDoPedido(pedido.id_solicitarservico);
      pedido.servicos = servicos;
    }

    res.json(pedidos);

  } catch (error) {
    console.error("Error listing pedidos:", error);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
}

// ADMIN - listar todos os pedidos
async function listarTodosPedidos(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Apenas administradores podem listar todos os pedidos" });
    }

    const pedidos = await pedidoModel.getAllPedidos();

    for (const pedido of pedidos) {
      const servicos = await pedidoModel.getServicosDoPedido(pedido.id_solicitarservico);
      pedido.servicos = servicos;
    }

    res.json(pedidos);

  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    res.status(500).json({ error: "Erro ao listar todos os pedidos" });
  }
}

// ADMIN ou PROPRIETÁRIO - buscar pedido por ID
async function listarPedidoPorId(req, res) {
  try {
    const idPedido = req.params.id;
    const pedido = await pedidoModel.getPedidoById(idPedido);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    if (
      req.user.role !== "admin" &&
      req.user.linkedProfile?.id !== pedido.id_proprietario
    ) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    pedido.servicos = await pedidoModel.getServicosDoPedido(idPedido);

    res.json(pedido);

  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    res.status(500).json({ error: "Erro ao buscar pedido" });
  }
}

// ADMIN - atualizar estado do pedido
async function atualizarEstadoPedido(req, res) {
  try {
    const idPedido = req.params.id;
    const { novoEstado } = req.body;

    const estadosPermitidos = ["pendente", "agendado", "andamento", "concluido", "cancelado"];

    if (!estadosPermitidos.includes(novoEstado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const pedido = await pedidoModel.getPedidoById(idPedido);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Apenas administradores podem alterar estado" });
    }

    const estadoAtual = pedido.status;

    const transicoes = {
      pendente: ["agendado", "cancelado"],
      agendado: ["andamento", "cancelado"],
      andamento: ["concluido"],
      concluido: [],
      cancelado: []
    };

    if (!transicoes[estadoAtual].includes(novoEstado)) {
      return res.status(400).json({
        error: `Transição inválida: ${estadoAtual} → ${novoEstado}`
      });
    }

    const atualizado = await pedidoModel.updatePedidoStatus(idPedido, novoEstado);

    res.json({
      message: "Estado atualizado com sucesso",
      pedido: atualizado
    });

  } catch (error) {
    console.error("Erro ao atualizar estado:", error);
    res.status(500).json({ error: "Erro ao atualizar estado do pedido" });
  }
}

module.exports = {
  criarPedido,
  listarPedidosProprietario,
  listarTodosPedidos,
  listarPedidoPorId,
  atualizarEstadoPedido
};
