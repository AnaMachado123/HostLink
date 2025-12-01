const EmpresaModel = require("../models/empresaModel");

const EmpresaController = {

    createProfile: async (req, res) => {
        try {
            const { id, tipoUser } = req.user;

            if (tipoUser !== 3) {
                return res.status(403).json({
                    error: "Only company accounts can create an Empresa profile"
                });
            }

            const {
                nome,
                email,
                telefone,
                nif,
                rua,
                nPorta,
                codPostal
            } = req.body;

            if (!nome) {
                return res.status(400).json({ 
                    error: "Nome is required" 
                });
            }

            const existing = await EmpresaModel.findByUserId(id);
            if (existing) {
                return res.status(400).json({
                    error: "This user already has a company profile"
                });
            }

            const novaEmpresa = await EmpresaModel.create({
                idUtilizador: id,
                nome,
                email,
                telefone,
                nif,
                rua,
                nPorta,
                codPostal
            });

            return res.status(201).json({
                message: "Company profile created successfully",
                empresa: novaEmpresa
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Error creating Empresa profile"
            });
        }
    },

    getMyProfile: async (req, res) => {
        try {
            const { id, tipoUser } = req.user;

            if (tipoUser !== 3) {
                return res.status(403).json({
                    error: "Only company accounts can access this resource"
                });
            }

            const empresa = await EmpresaModel.getByUserId(id);

            if (!empresa) {
                return res.status(404).json({
                    error: "Company profile not found"
                });
            }

            return res.json(empresa);

        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Error retrieving Empresa profile"
            });
        }
    },

    getAll: async (req, res) => {
        try {
            const { tipoUser } = req.user;

            if (tipoUser !== 1) {
                return res.status(403).json({
                    error: "Only admin can list all companies"
                });
            }

            const empresas = await EmpresaModel.getAll();
            return res.json(empresas);

        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Error retrieving Empresa list"
            });
        }
    }
};

module.exports = EmpresaController;
