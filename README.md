# 📋 Libro de Reclamaciones — Tuta Wayta
## Con Docker + MySQL

---

## 🚀 Ejecutar con Docker (recomendado)

### Requisitos
- Docker Desktop instalado y corriendo
- Docker Compose

### Pasos

```bash
# 1. Entra a la carpeta del proyecto
cd pitahaya-v2

# 2. Construye e inicia todo (Flask + MySQL)
docker-compose up --build

# 3. Abre en el navegador
http://localhost:5000
```

> La primera vez tarda ~1 minuto mientras descarga MySQL y construye la imagen.

---

## 🛑 Detener

```bash
docker-compose down
```

Para eliminar también los datos de MySQL:
```bash
docker-compose down -v
```

---

## 💻 Ejecutar sin Docker (solo Flask)

```bash
# 1. Instala dependencias
pip install flask

# 2. Necesitas tener MySQL corriendo en localhost:3306
#    con base de datos 'tutawayta' y usuario 'tutawayta'

# 3. Corre la app
python app.py

# 4. Abre
http://127.0.0.1:5000
```

---

## 🗄️ Base de datos

La tabla se crea automáticamente al iniciar Docker (`init.sql`).

Campos guardados:
- Datos del consumidor (nombres, apellidos, DNI, email, teléfono)
- Bien / Servicio (producto, fecha compra, monto)
- Detalle y pedido
- Para **Quejas**: área, personal, nivel de gravedad
- Número de hoja único, fecha y estado

---

## 📁 Estructura

```
pitahaya-v2/
├── app.py                  ← Flask + MySQL
├── docker-compose.yml      ← MySQL + Flask en Docker
├── Dockerfile              ← Imagen Flask
├── init.sql                ← Crea la tabla automáticamente
├── requirements.txt
├── templates/
│   └── libro.html
└── static/
    ├── css/libro.css
    └── js/libro.js
```
