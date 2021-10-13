
create database market_cubos;

create table if not exists usuarios (
    id serial primary key,
    nome text not null,
    nome_loja text not null,
    email text unique not null,
    senha text not null
);

create table if not exists produtos (
    id serial primary key,
    usuario_id integer references usuarios(id) not null,
    nome text not null,
    quantidade int not null,
    categoria text not null,
    preco int not null,
    descricao text,
    imagem text 
);