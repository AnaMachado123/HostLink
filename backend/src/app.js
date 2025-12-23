const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", require("./routes/authRoutes"));
app.use("/proprietarios", require("./routes/proprietarioRoutes"));
app.use("/empresas", require("./routes/empresaRoutes"));
app.use("/imoveis", require("./routes/imovelRoutes"));
app.use("/tipos-servico", require("./routes/tipoServicoRoutes"));
app.use("/servicos", require("./routes/servicoRoutes"));
app.use("/empresa-servicos", require("./routes/empresaServicoRoutes"));
app.use("/pedidos", require("./routes/pedidosRoutes"));
app.use("/servicos-executados", require("./routes/servicosExecutadosRoutes"));



// Rota principal
app.get('/', (req, res) => {
    res.send("HostLink API is running");
});

// Rota para testar ligação à base de dados
app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            connected: true,
            time: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            connected: false,
            error: error.message
        });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
