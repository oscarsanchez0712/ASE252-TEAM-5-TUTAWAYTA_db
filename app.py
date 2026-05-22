import os
import re
import datetime

from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mysqldb import MySQL

app = Flask(__name__)
app.secret_key = "tutawayta-libro-secret"

# =====================================================
# CONFIG MYSQL
# =====================================================
app.config['MYSQL_HOST'] = os.environ.get('MYSQL_HOST', 'localhost')
app.config['MYSQL_PORT'] = int(os.environ.get('MYSQL_PORT', 3306))
app.config['MYSQL_DB'] = os.environ.get('MYSQL_DB', 'tutawayta')

app.config['MYSQL_USER'] = os.environ.get('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.environ.get('MYSQL_PASSWORD', 'Root1234!')

app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

# =====================================================
# GENERAR NÚMERO HOJA
# =====================================================
def generar_numero_hoja(tipo):

    anio = datetime.datetime.now().year

    # R = reclamación | Q = queja
    prefijo = "R" if tipo == "reclamacion" else "Q"

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT COUNT(*) as total
        FROM libro
        WHERE YEAR(fecha_registro) = %s
        AND tipo = %s
    """, (anio, tipo))

    row = cur.fetchone()

    cur.close()

    correlativo = (row['total'] if row else 0) + 1

    return f"{prefijo}{str(correlativo).zfill(4)}-{anio}"


# =====================================================
# LIBRO DE RECLAMACIONES
# =====================================================
@app.route("/", methods=["GET", "POST"])
def libro_reclamaciones():

    if request.method == "POST":

        tipo = request.form.get('tipo', 'reclamacion')

        datos = {

            'tipo': tipo,

            'nombres': request.form.get('nombres', '').strip(),
            'apellidos': request.form.get('apellidos', '').strip(),

            'doc_tipo': request.form.get('doc_tipo', '').strip(),
            'doc_num': request.form.get('doc_num', '').strip(),

            'email': request.form.get('email', '').strip(),
            'telefono': request.form.get('telefono', '').strip(),

            'direccion': request.form.get('direccion', '').strip(),

            'monto': request.form.get('monto') or None,

            'fecha_compra': request.form.get('fecha_compra', '').strip(),

            'bien': request.form.get('bien', '').strip(),

            'detalle': request.form.get('detalle', '').strip(),

            'pedido': request.form.get('pedido', '').strip(),

            'area_queja': request.form.get('area_queja', '').strip() or None,

            'personal_queja': request.form.get('personal_queja', '').strip() or None,

            'gravedad': request.form.get('gravedad') or None,
        }

        # =====================================================
        # LIMPIEZA DE DATOS
        # =====================================================
        datos['nombres'] = re.sub(r'\s+', ' ', datos['nombres']).title()
        datos['apellidos'] = re.sub(r'\s+', ' ', datos['apellidos']).title()

        datos['bien'] = re.sub(r'\s+', ' ', datos['bien'])
        datos['detalle'] = re.sub(r'\s+', ' ', datos['detalle'])
        datos['pedido'] = re.sub(r'\s+', ' ', datos['pedido'])

        # =====================================================
        # PROTECCIÓN BÁSICA
        # =====================================================
        caracteres_peligrosos = [
            '<script>',
            '</script>',
            '--',
            ';--'
        ]

        for valor in datos.values():

            if isinstance(valor, str):

                for peligro in caracteres_peligrosos:

                    if peligro.lower() in valor.lower():

                        flash(
                            '❌ Se detectaron caracteres no permitidos.',
                            'error'
                        )

                        return redirect(url_for('libro_reclamaciones'))

        # =====================================================
        # CAMPOS OBLIGATORIOS
        # =====================================================
        campos_base = [
            'nombres',
            'apellidos',
            'doc_tipo',
            'doc_num',
            'email',
            'telefono',
            'fecha_compra',
            'bien',
            'detalle',
            'pedido'
        ]

        errores = [c for c in campos_base if not datos.get(c)]

        if errores:

            flash(
                '❌ Completa todos los campos obligatorios.',
                'error'
            )

            return redirect(url_for('libro_reclamaciones'))

        # =====================================================
        # VALIDAR NOMBRES
        # =====================================================
        if not re.match(r'^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$', datos['nombres']):

            flash(
                '❌ Los nombres solo deben contener letras.',
                'error'
            )

            return redirect(url_for('libro_reclamaciones'))

        if len(datos['nombres']) < 3:

            flash(
                '❌ El nombre es demasiado corto.',
                'error'
            )

            return redirect(url_for('libro_reclamaciones'))

        # =====================================================
        # VALIDAR APELLIDOS
        # =====================================================
        if not re.match(r'^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$', datos['apellidos']):

            flash(
                '❌ Los apellidos solo deben contener letras.',
                'error'
            )

            return redirect(url_for('libro_reclamaciones'))

        # =====================================================
        # VALIDAR EMAIL
        # =====================================================
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', datos['email']):

            flash(
                '❌ Correo electrónico inválido.',
                'error'
            )

            return redirect(url_for('libro_reclamaciones'))

        # =====================================================
        # VALIDAR TELÉFONO
        # =====================================================
        if not re.match(r'^\d{9}$', datos['telefono']):

            flash(
                '❌ El teléfono debe tener 9 números.',
                'error'
            )

            return redirect(url_for('libro_reclamaciones'))

        # =====================================================
        # VALIDAR DOCUMENTO
        # =====================================================
        if datos['doc_tipo'] == 'DNI':

            if not re.match(r'^\d{8}$', datos['doc_num']):

                flash(
                    '❌ El DNI debe tener 8 números.',
                    'error'
                )

                return redirect(url_for('libro_reclamaciones'))

        elif datos['doc_tipo'] == 'RUC':

            if not re.match(r'^\d{11}$', datos['doc_num']):

                flash(
                    '❌ El RUC debe tener 11 números.',
                    'error'
                )

                return redirect(url_for('libro_reclamaciones'))

        elif datos['doc_tipo'] == 'CE':

            if len(datos['doc_num']) < 6:

                flash(
                    '❌ Carnet de extranjería inválido.',
                    'error'
                )

                return redirect(url_for('libro_reclamaciones'))

        elif datos['doc_tipo'] == 'Pasaporte':

            if len(datos['doc_num']) < 6:

                flash(
                    '❌ Pasaporte inválido.',
                    'error'
                )

                return redirect(url_for('libro_reclamaciones'))

        # =====================================================
        # VALIDAR FECHA
        # =====================================================
        fecha_actual = datetime.date.today()

        try:

            fecha_compra = datetime.datetime.strptime(
                datos['fecha_compra'],
                '%Y-%m-%d'
            ).date()

            if fecha_compra > fecha_actual:

                flash(
                    '❌ La fecha no puede ser futura.',
                    'error'
                )

                return redirect(url_for('libro_reclamaciones'))

        except:

            flash(
                '❌ Fecha inválida.',
                'error'
            )

            return redirect(url_for('libro_reclamaciones'))

        # =====================================================
        # VALIDAR DETALLE
        # =====================================================
        if len(datos['detalle']) < 20:

            flash(
                '❌ El detalle debe tener mínimo 20 caracteres.',
                'error'
            )

            return redirect(url_for('libro_reclamaciones'))

        # =====================================================
        # VALIDAR PEDIDO
        # =====================================================
        if len(datos['pedido']) < 10:

            flash(
                '❌ El pedido debe tener mínimo 10 caracteres.',
                'error'
            )

            return redirect(url_for('libro_reclamaciones'))

        # =====================================================
        # VALIDAR LONGITUD MÁXIMA
        # =====================================================
        if len(datos['detalle']) > 1000:

            flash(
                '❌ El detalle excede el máximo permitido.',
                'error'
            )

            return redirect(url_for('libro_reclamaciones'))

        if len(datos['pedido']) > 500:

            flash(
                '❌ El pedido excede el máximo permitido.',
                'error'
            )

            return redirect(url_for('libro_reclamaciones'))

        # =====================================================
        # VALIDAR MONTO
        # =====================================================
        if datos['monto']:

            try:

                monto = float(datos['monto'])

                if monto < 0:

                    flash(
                        '❌ El monto no puede ser negativo.',
                        'error'
                    )

                    return redirect(url_for('libro_reclamaciones'))

            except:

                flash(
                    '❌ Monto inválido.',
                    'error'
                )

                return redirect(url_for('libro_reclamaciones'))

        # =====================================================
        # VALIDAR QUEJA
        # =====================================================
        if datos['tipo'] == 'queja':

            if not datos['area_queja']:

                flash(
                    '❌ Selecciona el área de la queja.',
                    'error'
                )

                return redirect(url_for('libro_reclamaciones'))

            if not datos['gravedad']:

                flash(
                    '❌ Selecciona el nivel de gravedad.',
                    'error'
                )

                return redirect(url_for('libro_reclamaciones'))

        # =====================================================
        # INSERT MYSQL
        # =====================================================
        try:

            numero_hoja = generar_numero_hoja(tipo)

            cur = mysql.connection.cursor()

            cur.execute("""

                INSERT INTO libro (

                    numero_hoja,
                    tipo,

                    nombres,
                    apellidos,

                    doc_tipo,
                    doc_num,

                    email,
                    telefono,
                    direccion,

                    monto,
                    fecha_compra,

                    bien,

                    detalle,
                    pedido,

                    area_queja,
                    personal_queja,
                    gravedad

                )

                VALUES (

                    %s,
                    %s,

                    %s,
                    %s,

                    %s,
                    %s,

                    %s,
                    %s,
                    %s,

                    %s,
                    %s,

                    %s,

                    %s,
                    %s,

                    %s,
                    %s,
                    %s

                )

            """, (

                numero_hoja,
                datos['tipo'],

                datos['nombres'],
                datos['apellidos'],

                datos['doc_tipo'],
                datos['doc_num'],

                datos['email'],
                datos['telefono'],
                datos['direccion'],

                datos['monto'],
                datos['fecha_compra'],

                datos['bien'],

                datos['detalle'],
                datos['pedido'],

                datos['area_queja'],
                datos['personal_queja'],
                datos['gravedad']

            ))

            try:

                mysql.connection.commit()

            except Exception as db_error:

                mysql.connection.rollback()

                print(db_error)

                flash(
                    '❌ Error al guardar los datos.',
                    'error'
                )

                return redirect(url_for('libro_reclamaciones'))

            cur.close()

            flash(
                f"✅ {tipo.capitalize()} registrada con N° {numero_hoja}",
                "success"
            )

        except Exception as e:

            print(f"❌ Error DB: {e}")

            flash(
                "❌ Error al guardar en la base de datos.",
                "error"
            )

        return redirect(url_for('libro_reclamaciones'))

    return render_template('libro.html')


# =====================================================
# TEST DB
# =====================================================
@app.route("/test-db")
def test_db():

    try:

        cur = mysql.connection.cursor()

        cur.execute("SELECT DATABASE();")

        data = cur.fetchone()

        cur.close()

        return f"✅ Conectado a la base de datos: {data}"

    except Exception as e:

        return f"❌ Error de conexión: {e}"


# =====================================================
# RUN SERVER
# =====================================================
if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )