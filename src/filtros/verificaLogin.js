const conexao = require('../conexao');
const segredo = require('../segredo')
const jwt = require('jsonwebtoken');


const verificaLogin = async (req, res, next) => {
    const { authorization } = req.headers;
    
    if (!authorization || authorization === 'Bearer') {
        return res.status(404).json({ mensagem: 'Token não informado.' });
    }
    
    try {
       const token = authorization.replace('Bearer', '').trim();
        const { id } = jwt.verify(token, segredo);

        const query = 'select * from usuarios where id = $1';
        const { rows, rowCount } = await conexao.query(query, [id]);
 
        if (rowCount === 0){
            req.usuario = undefined;
            next();
        }
        
        const { senha, ...usuario } = rows[0];
        
        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = verificaLogin
