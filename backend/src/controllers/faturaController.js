const pedidoModel = require("../models/pedidoModel");
const faturaModel = require("../models/faturaModel");

/* =====================================================
   EMITIR FATURA A PARTIR DE UM PEDIDO
===================================================== */
async function emitirFaturaPorPedido(req, res) {
  try {
    const { role } = req.user;
    const { idPedido } = req.params;

    // 🔒 só empresa ou admin
    if (role !== "empresa" && role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    // 🔎 obter pedido
    const pedido = await pedidoModel.getPedidoById(idPedido);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido not found" });
    }

    // ✅ normalizar status (FIX DO BUG)
    const statusPedido = String(pedido.status).toLowerCase().trim();

    // 🔒 só pedidos aceites podem gerar fatura
    const estadosValidos = ["agendado", "andamento", "concluido"];

    if (!estadosValidos.includes(statusPedido)) {
      return res.status(400).json({
        error: "Invoice can only be issued for accepted requests"
      });
    }

    // 🔁 evitar faturas duplicadas
    const existente =
      await faturaModel.getFaturaByPedido(pedido.id_solicitarservico);

    if (existente) {
      return res.status(409).json({
        error: "Invoice already exists for this request"
      });
    }

    // 💰 total = serviço + comissão
    const total =
      Number(pedido.valor) + Number(pedido.comissao || 0);

    // 🧾 criar fatura ligada ao pedido
    const fatura = await faturaModel.createFatura({
      valor: total,
      observacoes:
        "Academic project only. This document has no fiscal validity.",
      id_solicitarservico: pedido.id_solicitarservico
    });

    return res.status(201).json({
      fatura,
      pedido: {
        id: pedido.id_solicitarservico,
        servico: pedido.servico_nome,
        descricao: pedido.descricao,
        valor: pedido.valor,
        comissao: pedido.comissao,
        status: statusPedido
      }
    });

  } catch (error) {
    console.error("EMITIR FATURA ERROR:", error);
    return res.status(500).json({
      error: "Error issuing invoice"
    });
  }
}

/* =====================================================
   LISTAR FATURAS DO PROPRIETÁRIO
===================================================== */
async function listarFaturasProprietario(req, res) {
  try {
    const { role, id_utilizador } = req.user;

    if (role !== "proprietario") {
      return res.status(403).json({ error: "Access denied" });
    }

    const faturas =
      await faturaModel.getFaturasByProprietario(id_utilizador);

    return res.json(faturas);
  } catch (error) {
    console.error("LIST FATURAS PROPRIETARIO ERROR:", error);
    return res.status(500).json({
      error: "Error listing invoices"
    });
  }
}

/* =====================================================
   LISTAR FATURAS DA EMPRESA
===================================================== */
async function listarFaturasEmpresa(req, res) {
  try {
    const { role, id_utilizador } = req.user;

    if (role !== "empresa") {
      return res.status(403).json({ error: "Access denied" });
    }

    const faturas =
      await faturaModel.getFaturasByEmpresa(id_utilizador);

    return res.json(faturas);
  } catch (error) {
    console.error("LIST FATURAS EMPRESA ERROR:", error);
    return res.status(500).json({
      error: "Error listing invoices"
    });
  }
}

module.exports = {
  emitirFaturaPorPedido,
  listarFaturasProprietario,
  listarFaturasEmpresa
};
