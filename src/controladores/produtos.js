const conexao = require('../conexao')

const cadastrarProduto = async (req, res) => {
    const {nome, quantidade, categoria, preco, descricao, imagem} = req.body;
    const { usuario } = req;

    if (!usuario) {
        return res.status(401).json({ mensagem: "Para cadastrar um produto, o usuário deve estar autenticado."});
    }
    if (quantidade <= 0) {
        return  res.status(404).json({ mensagem: `A quantidade do produto precisa ser maior que zero.` });
    }
    if (!nome) {
        return  res.status(404).json({ mensagem: `O nome do produto deve ser informado.` });
    }
    if (!quantidade) {
        return res.status(404).json({ mensagem: `A quantidade do produto deve ser informada.` });
    }
    if (!preco) {
        return res.status(404).json({ mensagem: `O preço do produto deve ser informado.` });
    }
    if (!descricao) {
        return  res.status(404).json({ mensagem: `A descrição do produto deve ser informada.` });
    }
   

    try {

        const query = 'insert into produtos (nome, usuario_id, quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)';
        const { rowCount } = await conexao.query(query,[nome, usuario.id, quantidade, categoria, preco, descricao, imagem]);

        if(rowCount === 0){
            return   res.status(400).json({ mensagem: `Produto não cadastrado.` });
        }

        return res.status(201).json()

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const listarProdutosDoUsuario = async (req, res) => {
    const { usuario } = req;
    //const categoria = req.query.categoria;

    if (!usuario) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }

    try {
        const query = 'select * from produtos where usuario_id = $1';
        const { rows } = await conexao.query(query,[usuario.id]);

        return res.status(200).json(rows);

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }

};

const detalharProdutoDoUsuario = async (req, res) => {
    const { usuario } = req;
    const  { id } = req.params;
    
    if (!usuario) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }

    try {
        const query = 'select * from produtos where id = $1';
        const { rows, rowCount } = await conexao.query(query,[Number(id)]);
 
        if (rowCount === 0) {
            return res.status(400).json({mensagem: `Não existe produto cadastrado com ID ${id}.`});
        }

        if (rows[0].usuario_id !== usuario.id) {
            return res.status(403).json({mensagem: "O usuário logado não tem permissão para acessar este produto."})
        }
        return res.status(200).json(rows[0])

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const atualizarProdutoDoUsuario = async (req, res) => {
    const {nome, quantidade, categoria, preco, descricao, imagem} = req.body;
    const { usuario } = req;
    const  { id } = req.params;
   
    if (!usuario) {
        return res.status(401).json({ mensagem: "Para Atualizar um produto, o usuário deve estar autenticado."});
    }

    try {
        const query = 'select * from produtos where id = $1';
        const { rows, rowCount } = await conexao.query(query,[Number(id)]);
    
        if (rowCount === 0) {
            return res.status(400).json({mensagem: `Não existe produto cadastrado com ID ${id}.`});
        }

        if (rows[0].usuario_id !== usuario.id) {
            return res.status(403).json({mensagem: "O usuário autenticado não tem permissão para alterar este produto."})
        }

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }

    if (quantidade <= 0) {
        return  res.status(404).json({ mensagem: `A quantidade do produto precisa ser maior que zero.` });
    }
    if (!nome) {
        return  res.status(404).json({ mensagem: `O nome do produto deve ser informado.` });
    }
    if (!quantidade) {
        return res.status(404).json({ mensagem: `A quantidade do produto deve ser informada.` });
    }
    if (!preco) {
        return res.status(404).json({ mensagem: `O preço do produto deve ser informado.` });
    }
    if (!descricao) {
        return  res.status(404).json({ mensagem: `A descrição do produto deve ser informada.` });
    }

    try {
        const query = `
          update produtos set 
          nome = $1, 
          quantidade = $2, 
          categoria = $3,
          preco = $4, 
          descricao = $5,
          imagem = $6
          where id = $7`;

          const { rowCount } = await conexao.query(query,[nome, quantidade, categoria, preco, descricao, imagem, id]);

          if (rowCount === 0) {
              return res.status(400).json({mensagem: "Não foi possível atualizar o produto." })
          }

          return res.status(200).json();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    } 
};

const excluirProdutoDoUsuario = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    if (!usuario) {
        return res.status(401).json({ mensagem: "Para excluir um produto, o usuário deve estar autenticado."});
    }

    try {
        const query = 'select * from produtos where id = $1';
        const { rows, rowCount } = await conexao.query(query,[Number(id)]);
    
        if (rowCount === 0) {
            return res.status(400).json({mensagem: `Não existe produto para o ID ${id}.`});
        }

        if (rows[0].usuario_id !== usuario.id) {
            return res.status(403).json({mensagem: "O usuário autenticado não tem permissão para excluir este produto."})
        }

        const queryProdutoExcruido = 'delete from produtos where id = $1'
        const { rowCount: produtoExcluido } = await conexao.query(queryProdutoExcruido, [id]);

        if (produtoExcluido === 0) {
            return res.status(400).json({ mensagem: "Não foi possível excluir o produto." });
        }
        return res.status(200).json();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }

}

module.exports = {
    cadastrarProduto,
    listarProdutosDoUsuario,
    detalharProdutoDoUsuario,
    atualizarProdutoDoUsuario,
    excluirProdutoDoUsuario
}