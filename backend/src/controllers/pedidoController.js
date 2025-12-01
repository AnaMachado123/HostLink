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

module.exports = { 
  criarPedido,
  listarPedidosProprietario
};



