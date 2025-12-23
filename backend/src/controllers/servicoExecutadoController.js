const servicoExecutadoModel = require("../models/servicoExecutadoModel");
const pedidoModel = require("../models/pedidoModel");


// ===============================
// Criar Serviço Executado
// ===============================
async function criarServicoExecutado(req, res) {
  try {
    // Apenas admin ou empresa
    if (![1, 3].includes(req.user.tipoUser)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const { idServico, idFuncionario, idPedido, descricao } = req.body;

    // Validação básica
    if (!idServico || !idFuncionario || !idPedido) {
      return res.status(400).json({
        error: "idServico, idFuncionario e idPedido são obrigatórios"
      });
    }

    // Criar serviço executado
    const servicoExecutado =
      await servicoExecutadoModel.createServicoExecutado(
        idServico,
        idFuncionario,
        descricao
      );

    // Atualizar estado do pedido
    await pedidoModel.atualizarStatusPedido(idPedido, "concluido");

    res.status(201).json({
      message: "Serviço executado registado com sucesso",
      servicoExecutado
    });

  } catch (error) {
    console.error("Erro ao criar serviço executado:", error);
    res.status(500).json({ error: "Erro ao criar serviço executado" });
  }
}


// Listar Serviços Executados
async function listarServicosExecutados(req, res) {
  try {
    //Apenas Admin ou Empresa
    if (![1, 3].includes(req.user.tipoUser)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const servicos = await servicoExecutadoModel.getServicosExecutados();
    res.json(servicos);

  } catch (error) {
    console.error("Erro ao listar serviços executados:", error);
    res.status(500).json({ error: "Erro ao listar serviços executados" });
  }
}

module.exports = {
  criarServicoExecutado,
  listarServicosExecutados
};
