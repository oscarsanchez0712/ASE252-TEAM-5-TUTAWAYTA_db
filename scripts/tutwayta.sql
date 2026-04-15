-- =========================
-- CREAR Y USAR BASE DE DATOS
-- =========================
CREATE DATABASE IF NOT EXISTS tuta_wayta_db;
USE tuta_wayta_db;

-- =========================
-- ELIMINAR TABLAS (por si ya existen)
-- =========================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS detalle_pedido;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS contacto;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================
-- CREAR TABLAS
-- =========================

-- USUARIOS
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100),
    contraseña VARCHAR(100)
);

-- PRODUCTOS
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10,2),
    stock INT,
    imagen VARCHAR(255)
);

-- PEDIDOS
CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha DATE,
    total DECIMAL(10,2),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- DETALLE PEDIDO
CREATE TABLE detalle_pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_producto INT,
    cantidad INT,
    subtotal DECIMAL(10,2),
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- CONTACTO
CREATE TABLE contacto (
    id_contacto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100),
    mensaje TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- INSERTAR DATOS (ORDEN CORRECTO)
-- =========================

-- USUARIOS
INSERT INTO usuarios (nombre, correo, contraseña)
VALUES 
('Oscar Sanchez', 'oscar@gmail.com', '123456'),
('Jorge Vilcapuma', 'jorge@gmail.com', '123456');

-- PRODUCTOS
INSERT INTO productos (nombre, descripcion, precio, stock, imagen)
VALUES 
('Pitahaya Roja', 'Fruta orgánica del valle de Cañete', 8.00, 50, 'pitahaya.jpg'),
('Mermelada de Pitahaya', 'Producto natural sin preservantes', 12.00, 30, 'mermelada.jpg'),
('Jugo de Pitahaya', 'Bebida refrescante natural', 6.50, 40, 'jugo.jpg');

-- PEDIDOS
INSERT INTO pedidos (id_usuario, fecha, total)
VALUES 
(1, '2026-04-14', 20.00),
(2, '2026-04-14', 12.00);

-- DETALLE PEDIDO
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, subtotal)
VALUES 
(1, 1, 2, 16.00),
(2, 2, 1, 12.00);

-- CONTACTO
INSERT INTO contacto (nombre, correo, mensaje)
VALUES 
('Cliente 1', 'cliente1@gmail.com', 'Quiero información'),
('Cliente 2', 'cliente2@gmail.com', 'Deseo comprar pitahaya');

-- =========================
-- CONSULTAS DE VERIFICACIÓN
-- =========================

SELECT * FROM usuarios;
SELECT * FROM productos;
SELECT * FROM pedidos;
SELECT * FROM detalle_pedido;
SELECT * FROM contacto;