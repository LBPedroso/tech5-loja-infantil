-- ============================================================
-- Tech 6 - Loja Infantil
-- Script SQL para criação do Banco de Dados
-- ============================================================

CREATE DATABASE IF NOT EXISTS tech6_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tech6_db;

-- ============================================================
-- Tabela: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  senha       VARCHAR(255) NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Tabela: categorias
-- ============================================================
CREATE TABLE IF NOT EXISTS categorias (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(255) NOT NULL,
  descricao   TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Tabela: produtos
-- ============================================================
CREATE TABLE IF NOT EXISTS produtos (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(255) NOT NULL,
  descricao    TEXT,
  preco        DECIMAL(10, 2) NOT NULL,
  custo        DECIMAL(10, 2) DEFAULT 0.00,
  estoque      INT DEFAULT 0,
  categoria_id INT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- ============================================================
-- Tabela: clientes
-- ============================================================
CREATE TABLE IF NOT EXISTS clientes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(255) NOT NULL,
  email       VARCHAR(255),
  telefone    VARCHAR(20),
  cpf         VARCHAR(14),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Tabela: pedidos
-- ============================================================
CREATE TABLE IF NOT EXISTS pedidos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id  INT,
  status      ENUM('pendente','processando','enviado','entregue','cancelado') DEFAULT 'pendente',
  total       DECIMAL(10, 2) DEFAULT 0.00,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
);

-- ============================================================
-- Tabela: pedido_itens
-- ============================================================
CREATE TABLE IF NOT EXISTS pedido_itens (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id   INT NOT NULL,
  produto_id  INT NOT NULL,
  quantidade  INT NOT NULL DEFAULT 1,
  preco_unit  DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- ============================================================
-- Tabela: transacoes
-- ============================================================
CREATE TABLE IF NOT EXISTS transacoes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  tipo        ENUM('entrada','saida') NOT NULL,
  descricao   VARCHAR(255) NOT NULL,
  valor       DECIMAL(10, 2) NOT NULL,
  data        DATE NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Dados iniciais
-- ============================================================
INSERT INTO categorias (nome, descricao) VALUES
  ('Brinquedos', 'Brinquedos educativos e recreativos'),
  ('Roupas', 'Roupas infantis 0-12 anos'),
  ('Calçados', 'Calçados infantis');

INSERT INTO usuarios (nome, email, senha) VALUES
  ('Admin', 'admin@liligustore.com', '$2b$10$placeholder_hash_change_in_production');
