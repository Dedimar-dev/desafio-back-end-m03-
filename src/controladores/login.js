const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const segredo = require('../segredo')
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return   res.status(404).json({ mensagem: `O campo email e senha são obrigatórios.` });
    }

    try {
        const queryEmail = `select * from usuarios where email = $1`;
        const { rows, rowCount } = await conexao.query(queryEmail, [email]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        const usuario = rows[0];

        const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

        if (!senhaVerificada) {
            return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." });
        }

        const token = jwt.sign({ id: usuario.id }, segredo, { expiresIn: '8d' });

        return res.status(200).json({ token: token })

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = {
    login
}