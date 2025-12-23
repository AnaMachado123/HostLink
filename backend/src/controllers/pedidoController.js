const pedidoModel = require("../models/pedidoModel");

async function criarPedido(req, res) {
  try {
    // Obter ID do proprietário a partir do token
    const idProprietario = req.user.linkedProfile?.id; 
    
    // Verificar se é mesmo proprietário
    if (!req.user.linkedProfile || req.user.linkedProfile.role !== "proprietario") {
      return res.status(403).json({ error: "Only proprietarios can create pedidos" });
    }

    const { descricao, valor, comissao, servicos } = req.body;

    if (!Array.isArray(servicos) || servicos.length === 0) {
      return res.status(400).json({ error: "Serviços inválidos" });
    }

    // Criar pedido principal
    const pedido = await pedidoModel.createPedido(
      idProprietario,
      descricao,
      valor,
      comissao
    );

    // Associar serviços
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

async function listarPedidosProprietario(req, res) {
  try {
    const idProprietario = req.user.linkedProfile?.id;

    if (!idProprietario) {
      return res.status(403).json({ error: "Acesso negado: não é proprietário" });
    }

    const pedidos = await pedidoModel.getPedidosByProprietario(idProprietario);

    // Buscar serviços de cada pedido
    for (const pedido of pedidos) {
      const servicos = await pedidoModel.getServicosDoPedido(pedido.id_solicitarservico);
      pedido.servicos = servicos; // anexar no JSON
    }

    res.json(pedidos);

  } catch (error) {
    console.error("Error listing pedidos:", error);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
}

async function listarTodosPedidos(req, res) {
  try {
    // validar admin
    if (req.user.tipoUser !== 1) {
      return res.status(403).json({ error: "Acesso restrito a administradores" });
    }

    const pedidos = await pedidoModel.getAllPedidos();

    // anexar serviços a cada pedido
    for (const pedido of pedidos) {
      const servicos = await pedidoModel.getServicosDoPedido(
        pedido.id_solicitarservico
      );
      pedido.servicos = servicos;
    }

    res.json(pedidos);

  } catch (error) {
    console.error("Erro ao listar pedidos (admin):", error);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
}

async function obterPedidoPorId(req, res) {
  try {
    // validar admin
    if (req.user.tipoUser !== 1) {
      return res.status(403).json({ error: "Acesso restrito a administradores" });
    }

    const { id } = req.params;

    const pedido = await pedidoModel.getPedidoById(id);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    // buscar serviços do pedido
    const servicos = await pedidoModel.getServicosDoPedido(id);
    pedido.servicos = servicos;

    res.json(pedido);

  } catch (error) {
    console.error("Erro ao obter pedido por ID:", error);
    res.status(500).json({ error: "Erro ao obter pedido" });
  }
}

async function atualizarStatusPedido(req, res) {
  try {
    // validar admin
    if (req.user.tipoUser !== 1) {
      return res.status(403).json({ error: "Acesso restrito a administradores" });
    }

    const { id } = req.params;
    const { status } = req.body;

    const estadosValidos = [
      "pendente",
      "agendado",
      "andamento",
      "concluido",
      "cancelado"
    ];

    if (!estadosValidos.includes(status)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const pedidoAtualizado = await pedidoModel.updateStatusPedido(id, status);

    if (!pedidoAtualizado) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json({
      message: "Estado do pedido atualizado com sucesso",
      pedido: pedidoAtualizado
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
  atualizarStatusPedido
};



