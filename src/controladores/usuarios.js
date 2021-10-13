const conexao = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome) {
        return  res.status(404).json({ mensagem: `O campo nome é obrigatório` });
    }
    if (!email) {
        return  res.status(404).json({ mensagem: `O campo email é obrigatório` });
    }
    if (!senha) {
        return  res.status(404).json({ mensagem: `O campo senha é obrigatório` });
    }
    if (!nome_loja) {
        return  res.status(404).json({ mensagem: `O campo nome_loja é obrigatório` });
    }

    try {

        const queryEmail = `select * from usuarios where email = $1`;
        const { rowCount: emailCadastrado } = await conexao.query(queryEmail, [email]);

        if (emailCadastrado > 0) {
            return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado."});
        }


        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)';

        const { rowCount } = await conexao.query(query, [nome, email, senhaCriptografada, nome_loja]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o usuário." });
        }

        return res.status(200).json();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const detalharUsuario = async (req, res) => {
    const { usuario } = req;
    
    if (!usuario) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }

    try {
        return res.status(200).json(usuario);

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const atualizarUsuario = async (req, res) => {
    const { usuario } = req;

    const { nome, email, senha, nome_loja } = req.body;

    if (!usuario) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }

    if (!nome) {
        return  res.status(404).json({ mensagem: `O campo nome é obrigatório` });
    }
    if (!email) {
        return  res.status(404).json({ mensagem: `O campo email é obrigatório` });
    }
    if (!senha) {
        return  res.status(404).json({ mensagem: `O campo senha é obrigatório` });
    }
    if (!nome_loja) {
        return  res.status(404).json({ mensagem: `O campo nome_loja é obrigatório` });
    }

    try {
        const queryEmail = `select * from usuarios where email = $1`;
        const { rowCount } = await conexao.query(queryEmail, [email]);

        if ( rowCount > 0 ) {
            return res.status(401).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário."});
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'update usuarios set nome = $1, email = $2, senha = $3, nome_loja = $4 where id = $5';
        const { rowCount: usuarioAtualizado } = await conexao.query(query,[nome, email, senhaCriptografada, nome_loja, usuario.id]);

        if (usuarioAtualizado === 0) {
            return res.status(400).json({ mensagem: "Não foi possível atualizar o usuário." });
        }
        return res.status(200).json()

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
}