const EmpresaServicoModel = require("../models/empresaServicoModel");
const EmpresaModel = require("../models/empresaModel");

const EmpresaServicoController = {

    addServico: async (req, res) => {
        try {
            const { tipoUser, id } = req.user;

            // Só empresas podem associar serviços a si próprias
            if (tipoUser !== 3) {
                return res.status(403).json({ error: "Only companies can add services" });
            }

            const empresa = await EmpresaModel.findByUserId(id);
            if (!empresa) {
                return res.status(400).json({ error: "Empresa profile not found" });
            }

            const { idServico } = req.body;
            if (!idServico) {
                return res.status(400).json({ error: "idServico is required" });
            }

            const link = await EmpresaServicoModel.addServicoToEmpresa(
                empresa.id_empresa,
                idServico
            );

            return res.status(201).json({
                message: "Service associated with company (or already present)",
                link
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error associating service to company" });
        }
    },

    listMyServices: async (req, res) => {
        try {
            const { tipoUser, id } = req.user;

            if (tipoUser !== 3) {
                return res.status(403).json({ error: "Only companies can list their services" });
            }

            const empresa = await EmpresaModel.findByUserId(id);
            if (!empresa) {
                return res.status(400).json({ error: "Empresa profile not found" });
            }

            const servicos = await EmpresaServicoModel.getServicosDaEmpresa(
                empresa.id_empresa
            );

            return res.json(servicos);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error fetching company services" });
        }
    }
};

module.exports = EmpresaServicoController;
