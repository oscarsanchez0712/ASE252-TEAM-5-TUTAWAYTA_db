# 📊 Gestión de Consultas - Tuta Wayta

## 📌 Registro de Gestión de Consultas
Este documento registra las operaciones realizadas sobre la base de datos del sistema Tuta Wayta, incluyendo inserciones, consultas, actualizaciones y eliminaciones de datos.

---

## 🧾 Descripción del Caso
El sistema Tuta Wayta está diseñado para gestionar la venta de productos derivados de la pitahaya, permitiendo administrar usuarios, productos, pedidos y mensajes de contacto de los clientes.

Se busca mantener un control eficiente de la información almacenada, facilitando la interacción entre el cliente y el sistema.

---

## 🎯 Alcance
Este módulo abarca las siguientes funcionalidades:

- Registro de usuarios
- Gestión de productos (crear, consultar, actualizar y eliminar)
- Registro de pedidos realizados por los usuarios
- Detalle de productos por pedido
- Recepción de mensajes desde el formulario de contacto

---

## ⚙️ Operaciones CRUD

### 🟢 INSERT (Insertar datos)

```sql
INSERT INTO usuarios (nombre, correo, contraseña)
VALUES ('Oscar Sanchez', 'oscar@gmail.com', '123456');

INSERT INTO productos (nombre, descripcion, precio, stock, imagen)
VALUES ('Pitahaya Roja', 'Fruta orgánica', 8.00, 50, 'pitahaya.jpg');