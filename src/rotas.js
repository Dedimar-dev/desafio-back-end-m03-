const express = require('express');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const produto = require('./controladores/produtos');
const verificaLogin = require('./filtros/verificaLogin');

const rotas = express();

//usuário
rotas.post('/usuario', usuarios.cadastrarUsuario);

//login
rotas.post('/login', login.login);

//autenticação
rotas.use(verificaLogin);

//usuário com autenticação
rotas.get('/usuario', usuarios.detalharUsuario);
rotas.put('/usuario', usuarios.atualizarUsuario);

//produtos com autenticação
rotas.post('/produtos', produto.cadastrarProduto);
rotas.get('/produtos', produto.listarProdutosDoUsuario);
rotas.get('/produtos/:id', produto.detalharProdutoDoUsuario);
rotas.put('/produtos/:id', produto.atualizarProdutoDoUsuario);
rotas.delete('/produtos/:id', produto.excluirProdutoDoUsuario);


module.exports = rotas;