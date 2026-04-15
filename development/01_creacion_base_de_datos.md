# 🗄️ Sistema de Base de Datos - Tuta Wayta

## 📌 1. Descripción General
El sistema **Tuta Wayta** permite gestionar la venta de productos derivados de la **pitahaya**, incluyendo la administración de:
* **Usuarios:** Clientes y administradores.
* **Productos:** Catálogo de derivados y fruta.
* **Pedidos:** Gestión de ventas y transacciones.
* **Mensajes:** Contacto y soporte.

---

## ⚙️ 2. Base de Datos en MySQL
**MySQL** es un sistema de gestión de bases de datos (DBMS) que permite crear, administrar y manipular información de forma estructurada mediante tablas relacionadas. Es la pieza central para almacenar datos críticos de aplicaciones web.

### 📁 Archivos Físicos de la Base de Datos
Cuando se crea una base de datos, el sistema genera archivos físicos en el servidor donde se almacenan las tablas, índices y datos. 
> [!IMPORTANT]
> Estos archivos **no se manipulan directamente**, ya que MySQL gestiona su estructura internamente para evitar la corrupción de datos.

---

## 🟢 3. Gestión y Creación

La gestión incluye operaciones fundamentales como crear, seleccionar, listar y eliminar.

### 3.1 Crear Base de Datos
Define el contenedor principal del proyecto.
* **Sintaxis:** `CREATE DATABASE nombre_base_datos;`
* **Ejemplo:**
    ```sql
    CREATE DATABASE tuta_wayta_db;
    ```

### 3.2 Poner en Uso (Seleccionar)
Indica al sistema con qué base de datos se desea trabajar.
* **Sintaxis:** `USE nombre_base_datos;`
* **Ejemplo:**
    ```sql
    USE tuta_wayta_db;
    ```

### 3.3 Inventario (Listar)
Permite visualizar todas las bases de datos existentes en el servidor.
* **Sintaxis / Ejemplo:**
    ```sql
    SHOW DATABASES;
    ```

---

## 🔴 4. Eliminación de Base de Datos
La eliminación borra permanentemente toda la información contenida.

### ⚠️ Consideraciones previas
Antes de ejecutar un `DROP`, se debe verificar:
1.  Que no se esté utilizando actualmente.
2.  Que no contenga información crítica.
3.  Haber realizado una copia de seguridad (**backup**).

* **Sintaxis:** `DROP DATABASE nombre_base_datos;`
* **Ejemplo:**
    ```sql
    DROP DATABASE tuta_wayta_db;
    ```

---

## 🧠 Notas Finales y Buenas Prácticas
* **Prevención de errores:** Es recomendable usar:  
    `CREATE DATABASE IF NOT EXISTS nombre_base_datos;`  
    Esto evita fallos en scripts de automatización si la base de datos ya existe.
* **Integridad:** La correcta gestión de estos comandos asegura la disponibilidad de la información para el negocio.