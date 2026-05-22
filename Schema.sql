-- ============================================
--  TUTA WAYTA — Libro de Reclamaciones MySQL
-- ============================================

CREATE DATABASE IF NOT EXISTS tutawayta;
USE tutawayta;

-- Tabla principal
CREATE TABLE IF NOT EXISTS libro (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  numero_hoja   VARCHAR(20) NOT NULL UNIQUE,
  tipo          ENUM('reclamacion', 'queja') NOT NULL,

  -- Datos del consumidor
  nombres       VARCHAR(100) NOT NULL,
  apellidos     VARCHAR(100) NOT NULL,
  doc_tipo      VARCHAR(20)  NOT NULL,
  doc_num       VARCHAR(30)  NOT NULL,
  email         VARCHAR(150) NOT NULL,
  telefono      VARCHAR(20)  NOT NULL,
  direccion     VARCHAR(255),

  -- Bien / Servicio
  monto         DECIMAL(10,2),
  fecha_compra  DATE         NOT NULL,
  bien          VARCHAR(255) NOT NULL,

  -- Detalle reclamación
  detalle       TEXT         NOT NULL,
  pedido        TEXT         NOT NULL,

  -- Solo para QUEJAS
  area_queja    VARCHAR(100),
  personal_queja VARCHAR(100),
  gravedad      ENUM('leve','moderada','grave'),

  -- Metadata
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado        ENUM('pendiente','en_proceso','resuelto') DEFAULT 'pendiente'
);
