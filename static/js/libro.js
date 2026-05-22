/* =============================================
   TUTA WAYTA — Libro de Reclamaciones
   libro.js — Con envío real a Flask/MySQL
   ============================================= */

'use strict';

/* ---------- UTILIDADES ---------- */

function $(id) { return document.getElementById(id); }

function showErr(id, msg) {
  const el = $(id);
  if (el) el.textContent = msg;
}
function clearErr(id) {
  const el = $(id);
  if (el) el.textContent = '';
}

function setInvalid(input) {
  if (!input) return;
  input.classList.add('invalid');
  input.classList.remove('valid');
}
function setValid(input) {
  if (!input) return;
  input.classList.remove('invalid');
  input.classList.add('valid');
}
function resetField(input) {
  if (!input) return;
  input.classList.remove('invalid', 'valid');
}

/* ---------- FECHA HOY ---------- */
const hoy = new Date();
$('fecha-hoy').textContent = hoy.toLocaleDateString('es-PE', {
  day: 'numeric', month: 'long', year: 'numeric'
});

/* ---------- NÚMERO DE HOJA ---------- */
function generarNumHoja(tipo) {
  const anio = hoy.getFullYear();
  const prefijo = tipo === 'queja' ? 'Q' : 'R';
  const rand = String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0');
  return `${prefijo}${rand}-${anio}`;
}

let numHojaActual = generarNumHoja('reclamacion');
$('numero-hoja').textContent = numHojaActual;

/* ---------- TIPO SELECTOR ---------- */
const radTipo      = document.querySelectorAll('input[name="tipo_sel"]');
const bannerIcon   = $('banner-icon');
const bannerTitle  = $('banner-title');
const bannerDesc   = $('banner-desc');
const tipoBanner   = $('tipo-banner');
const quejaExtra   = $('queja-extra');
const quejaInfo    = $('queja-info');
const btnEnviar    = $('btnEnviar');
const numDetalle   = $('num-detalle');
const numConfirm   = $('num-confirmacion');
const hiddenTipo   = $('tipo');

radTipo.forEach(r => r.addEventListener('change', actualizarTipo));

function actualizarTipo() {
  const val = document.querySelector('input[name="tipo_sel"]:checked')?.value || 'reclamacion';
  hiddenTipo.value = val;

  if (val === 'queja') {
    bannerIcon.textContent  = '📢';
    bannerTitle.textContent = 'Estás registrando una Queja';
    bannerDesc.textContent  = 'Disconformidad con la atención recibida.';
    tipoBanner.style.background  = '#fff0f7';
    tipoBanner.style.borderColor = '#e91e8c';
    quejaExtra.style.display = 'block';
    quejaInfo.style.display  = 'flex';
    btnEnviar.textContent    = 'Enviar Queja →';
    numDetalle.textContent   = '04';
    numConfirm.textContent   = '05';
  } else {
    bannerIcon.textContent  = '⚠️';
    bannerTitle.textContent = 'Estás registrando una Reclamación';
    bannerDesc.textContent  = 'Disconformidad con productos o servicios.';
    tipoBanner.style.background  = '#fff8e1';
    tipoBanner.style.borderColor = '#f59e0b';
    quejaExtra.style.display = 'none';
    quejaInfo.style.display  = 'none';
    btnEnviar.textContent    = 'Enviar Reclamación →';
    numDetalle.textContent   = '03';
    numConfirm.textContent   = '04';
    limpiarValidacionesQueja();
  }

  // Actualizar número de hoja en tiempo real
  numHojaActual = generarNumHoja(val);
  $('numero-hoja').textContent = numHojaActual;
}

/* ---------- ESTRELLAS ---------- */
const stars     = document.querySelectorAll('.star');
const calLabel  = $('cal-label');
const calHidden = $('calificacion');
const calLabels = ['Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente'];

stars.forEach(s => {
  s.addEventListener('mouseenter', () => hoverStars(parseInt(s.dataset.val)));
  s.addEventListener('mouseleave', () => resetHoverStars());
  s.addEventListener('click',      () => selectStar(parseInt(s.dataset.val)));
});

function hoverStars(val) {
  stars.forEach(s => s.classList.toggle('hover', parseInt(s.dataset.val) <= val));
}
function resetHoverStars() {
  stars.forEach(s => s.classList.remove('hover'));
}
function selectStar(val) {
  calHidden.value = val;
  calLabel.textContent = calLabels[val - 1];
  stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= val));
  clearErr('err-calificacion');
  document.querySelector('.stars').classList.remove('invalid-stars');
}

/* ---------- TOGGLE PRIMERA VEZ ---------- */
document.querySelectorAll('input[name="primera_vez"]').forEach(r => {
  r.addEventListener('change', () => {
    $('ref-anterior').style.display = r.value === 'no' ? 'block' : 'none';
  });
});

/* ---------- CONTADOR TEXTAREA ---------- */
const detalle = $('detalle');
const counter = $('char-counter');
if (detalle && counter) {
  detalle.addEventListener('input', () => {
    counter.textContent = `${detalle.value.length} / 1000 caracteres`;
  });
}

/* ---------- VALIDACIONES ---------- */

function validarComunes() {
  let ok = true;
  const soloLetras = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/;

  const nombres = $('nombres');
  if (!nombres.value.trim() || nombres.value.trim().length < 3) {
    showErr('err-nombres', 'Ingresa tu nombre (mínimo 3 caracteres).');
    setInvalid(nombres); ok = false;
  } else if (!soloLetras.test(nombres.value.trim())) {
    showErr('err-nombres', 'El nombre solo debe contener letras.');
    setInvalid(nombres); ok = false;
  } else { clearErr('err-nombres'); setValid(nombres); }

  const apellidos = $('apellidos');
  if (!apellidos.value.trim() || apellidos.value.trim().length < 3) {
    showErr('err-apellidos', 'Ingresa tus apellidos (mínimo 3 caracteres).');
    setInvalid(apellidos); ok = false;
  } else if (!soloLetras.test(apellidos.value.trim())) {
    showErr('err-apellidos', 'Los apellidos solo deben contener letras.');
    setInvalid(apellidos); ok = false;
  } else { clearErr('err-apellidos'); setValid(apellidos); }

  const docTipo = $('doc_tipo');
  if (!docTipo.value) {
    showErr('err-doc_tipo', 'Selecciona el tipo de documento.');
    setInvalid(docTipo); ok = false;
  } else { clearErr('err-doc_tipo'); setValid(docTipo); }

  const docNum   = $('doc_num');
  const soloNums = /^\d+$/;
  if (!docNum.value.trim()) {
    showErr('err-doc_num', 'Ingresa tu número de documento.');
    setInvalid(docNum); ok = false;
  } else if (!soloNums.test(docNum.value.trim())) {
    showErr('err-doc_num', 'Solo se permiten números.');
    setInvalid(docNum); ok = false;
  } else if (docTipo.value === 'DNI' && docNum.value.trim().length !== 8) {
    showErr('err-doc_num', 'El DNI debe tener 8 dígitos.');
    setInvalid(docNum); ok = false;
  } else if (docTipo.value === 'CE' && docNum.value.trim().length < 9) {
    showErr('err-doc_num', 'El CE debe tener al menos 9 dígitos.');
    setInvalid(docNum); ok = false;
  } else { clearErr('err-doc_num'); setValid(docNum); }

  const email   = $('email');
  const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !reEmail.test(email.value.trim())) {
    showErr('err-email', 'Ingresa un correo electrónico válido.');
    setInvalid(email); ok = false;
  } else { clearErr('err-email'); setValid(email); }

  const tel   = $('telefono');
  const reTel = /^9\d{8}$/;
  if (!tel.value.trim() || !reTel.test(tel.value.trim())) {
    showErr('err-telefono', 'Ingresa un celular válido (9 dígitos, empieza en 9).');
    setInvalid(tel); ok = false;
  } else { clearErr('err-telefono'); setValid(tel); }

  const fechaCompra = $('fecha_compra');
  if (!fechaCompra.value) {
    showErr('err-fecha_compra', 'Selecciona la fecha de compra.');
    setInvalid(fechaCompra); ok = false;
  } else if (new Date(fechaCompra.value) > hoy) {
    showErr('err-fecha_compra', 'La fecha de compra no puede ser futura.');
    setInvalid(fechaCompra); ok = false;
  } else { clearErr('err-fecha_compra'); setValid(fechaCompra); }

  const bien = $('bien');
  if (!bien.value.trim() || bien.value.trim().length < 5) {
    showErr('err-bien', 'Describe el bien o servicio (mínimo 5 caracteres).');
    setInvalid(bien); ok = false;
  } else { clearErr('err-bien'); setValid(bien); }

  const det = $('detalle');
  if (!det.value.trim() || det.value.trim().length < 20) {
    showErr('err-detalle', 'Describe lo ocurrido (mínimo 20 caracteres).');
    setInvalid(det); ok = false;
  } else { clearErr('err-detalle'); setValid(det); }

  const pedido = $('pedido');
  if (!pedido.value.trim() || pedido.value.trim().length < 10) {
    showErr('err-pedido', 'Indica tu pedido o solución esperada (mínimo 10 caracteres).');
    setInvalid(pedido); ok = false;
  } else { clearErr('err-pedido'); setValid(pedido); }

  const acepto = $('acepto');
  if (!acepto.checked) {
    showErr('err-acepto', 'Debes declarar que la información es verídica.');
    ok = false;
  } else { clearErr('err-acepto'); }

  return ok;
}

function validarQueja() {
  let ok = true;

  const tipoAtencionSel = document.querySelector('input[name="tipo_atencion"]:checked');
  const rgAtencion      = document.querySelector('#rg-tipo_atencion');
  if (!tipoAtencionSel) {
    showErr('err-tipo_atencion', 'Selecciona el tipo de atención recibida.');
    rgAtencion.classList.add('invalid-group'); ok = false;
  } else {
    clearErr('err-tipo_atencion');
    rgAtencion.classList.remove('invalid-group');
  }

  const fechaInc = $('fecha_incidente');
  if (!fechaInc.value) {
    showErr('err-fecha_incidente', 'Selecciona la fecha del incidente.');
    setInvalid(fechaInc); ok = false;
  } else if (new Date(fechaInc.value) > hoy) {
    showErr('err-fecha_incidente', 'La fecha del incidente no puede ser futura.');
    setInvalid(fechaInc); ok = false;
  } else { clearErr('err-fecha_incidente'); setValid(fechaInc); }

  const motivosSel = document.querySelectorAll('input[name="motivo[]"]:checked');
  const chkMotivos = $('chk-motivos');
  if (motivosSel.length === 0) {
    showErr('err-motivos', 'Selecciona al menos un motivo de la queja.');
    chkMotivos.classList.add('invalid-group'); ok = false;
  } else {
    clearErr('err-motivos');
    chkMotivos.classList.remove('invalid-group');
  }

  if (!calHidden.value) {
    showErr('err-calificacion', 'Por favor califica la atención recibida.');
    document.querySelector('.stars').classList.add('invalid-stars'); ok = false;
  } else {
    clearErr('err-calificacion');
    document.querySelector('.stars').classList.remove('invalid-stars');
  }

  const primeraVezSel = document.querySelector('input[name="primera_vez"]:checked');
  const rgPrimeraVez  = document.querySelector('#rg-primera_vez');
  if (!primeraVezSel) {
    showErr('err-primera_vez', 'Indica si es la primera vez que reportas este problema.');
    rgPrimeraVez.classList.add('invalid-group'); ok = false;
  } else {
    clearErr('err-primera_vez');
    rgPrimeraVez.classList.remove('invalid-group');
  }

  return ok;
}

function limpiarValidacionesQueja() {
  clearErr('err-tipo_atencion');
  clearErr('err-fecha_incidente');
  clearErr('err-motivos');
  clearErr('err-calificacion');
  clearErr('err-primera_vez');

  const fechaInc = $('fecha_incidente');
  if (fechaInc) resetField(fechaInc);

  document.querySelector('#rg-tipo_atencion')?.classList.remove('invalid-group');
  document.querySelector('#rg-primera_vez')?.classList.remove('invalid-group');
  document.querySelector('#chk-motivos')?.classList.remove('invalid-group');
  document.querySelector('.stars')?.classList.remove('invalid-stars');
}

/* ---------- SUBMIT — ENVÍO REAL A FLASK ---------- */
$('libroForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const tipoActual = hiddenTipo.value;
  let formValido   = validarComunes();

  if (tipoActual === 'queja') {
    const quejaValida = validarQueja();
    formValido = formValido && quejaValida;
  }

  if (!formValido) {
    const primerError = document.querySelector('.invalid, .invalid-group');
    if (primerError) primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Deshabilitar botón mientras se envía
  btnEnviar.disabled     = true;
  btnEnviar.textContent  = 'Enviando...';

  try {
    // Recoger todos los campos del formulario (incluye motivo[], etc.)
    const formData = new FormData(this);

    const response = await fetch('/guardar', {
      method: 'POST',
      body: formData
    });

    const resultado = await response.json();

    if (resultado.ok) {
      // Mostrar modal con el número de hoja que devuelve el servidor
      const numHoja = resultado.numero_hoja;

      $('numero-hoja').textContent = numHoja;
      $('modalNum').textContent    = numHoja;

      if (tipoActual === 'queja') {
        $('modal-icon').textContent   = '📢';
        $('modal-titulo').textContent = '¡Queja Registrada!';
        $('modal-plazo').textContent  = '15 días hábiles';
      } else {
        $('modal-icon').textContent   = '✅';
        $('modal-titulo').textContent = '¡Reclamación Registrada!';
        $('modal-plazo').textContent  = '15 días hábiles';
      }

      $('modal').classList.add('show');

    } else {
      // El servidor devolvió un error de validación
      mostrarFlash(resultado.mensaje, 'error');
    }

  } catch (err) {
    console.error('Error de red:', err);
    mostrarFlash('❌ Error de conexión. Intenta nuevamente.', 'error');
  } finally {
    btnEnviar.disabled    = false;
    btnEnviar.textContent = tipoActual === 'queja' ? 'Enviar Queja →' : 'Enviar Reclamación →';
  }
});

/* ---------- FLASH DINÁMICO (sin recargar página) ---------- */
function mostrarFlash(msg, tipo) {
  // Reusar el contenedor .flash-wrap si existe, o crear uno temporal
  let wrap = document.querySelector('.flash-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'flash-wrap';
    document.querySelector('.hero').insertAdjacentElement('afterend', wrap);
  }
  wrap.innerHTML = `<div class="flash flash--${tipo}">${msg}</div>`;
  wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Auto-ocultar en 5s
  setTimeout(() => { wrap.innerHTML = ''; }, 5000);
}

/* ---------- LIMPIAR FORM ---------- */
$('btnLimpiar').addEventListener('click', () => {
  $('libroForm').reset();

  document.querySelectorAll('.err').forEach(e => e.textContent = '');
  document.querySelectorAll('input, select, textarea').forEach(resetField);
  document.querySelectorAll('.invalid-group').forEach(g => g.classList.remove('invalid-group'));
  document.querySelectorAll('.star').forEach(s => s.classList.remove('active', 'hover'));
  if (calHidden) calHidden.value = '';
  if (calLabel)  calLabel.textContent = 'Haz clic para calificar';
  if (counter)   counter.textContent  = '0 / 1000 caracteres';
  $('ref-anterior').style.display = 'none';

  const radRec = document.querySelector('input[name="tipo_sel"][value="reclamacion"]');
  if (radRec) { radRec.checked = true; actualizarTipo(); }

  numHojaActual = generarNumHoja('reclamacion');
  $('numero-hoja').textContent = numHojaActual;
});

/* ---------- MODAL ---------- */
$('btnCerrar').addEventListener('click', () => {
  $('modal').classList.remove('show');
  $('libroForm').reset();
  document.querySelectorAll('.err').forEach(e => e.textContent = '');
  document.querySelectorAll('input, select, textarea').forEach(resetField);
  document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
  if (calHidden) calHidden.value = '';
  if (calLabel)  calLabel.textContent = 'Haz clic para calificar';
  if (counter)   counter.textContent  = '0 / 1000 caracteres';
  $('ref-anterior').style.display = 'none';

  const radRec = document.querySelector('input[name="tipo_sel"][value="reclamacion"]');
  if (radRec) { radRec.checked = true; actualizarTipo(); }

  numHojaActual = generarNumHoja('reclamacion');
  $('numero-hoja').textContent = numHojaActual;
});

$('btnImprimir').addEventListener('click', () => window.print());

$('modal').addEventListener('click', function (e) {
  if (e.target === this) this.classList.remove('show');
});

/* ---------- VALIDACIÓN EN TIEMPO REAL (blur) ---------- */
function addBlurValidation(id, errId, fn) {
  const el = $(id);
  if (!el) return;
  el.addEventListener('blur', fn);
}

addBlurValidation('nombres', 'err-nombres', () => {
  const v = $('nombres').value.trim();
  const soloLetras = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/;
  if (!v || v.length < 3) { showErr('err-nombres', 'Mínimo 3 caracteres.'); setInvalid($('nombres')); }
  else if (!soloLetras.test(v)) { showErr('err-nombres', 'Solo se permiten letras.'); setInvalid($('nombres')); }
  else { clearErr('err-nombres'); setValid($('nombres')); }
});

addBlurValidation('apellidos', 'err-apellidos', () => {
  const v = $('apellidos').value.trim();
  const soloLetras = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/;
  if (!v || v.length < 3) { showErr('err-apellidos', 'Mínimo 3 caracteres.'); setInvalid($('apellidos')); }
  else if (!soloLetras.test(v)) { showErr('err-apellidos', 'Solo se permiten letras.'); setInvalid($('apellidos')); }
  else { clearErr('err-apellidos'); setValid($('apellidos')); }
});

addBlurValidation('email', 'err-email', () => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test($('email').value.trim())) { showErr('err-email', 'Correo inválido.'); setInvalid($('email')); }
  else { clearErr('err-email'); setValid($('email')); }
});

addBlurValidation('telefono', 'err-telefono', () => {
  const re = /^9\d{8}$/;
  if (!re.test($('telefono').value.trim())) { showErr('err-telefono', '9 dígitos, comienza en 9.'); setInvalid($('telefono')); }
  else { clearErr('err-telefono'); setValid($('telefono')); }
});

addBlurValidation('doc_num', 'err-doc_num', () => {
  const v    = $('doc_num').value.trim();
  const tipo = $('doc_tipo').value;
  if (!/^\d+$/.test(v)) { showErr('err-doc_num', 'Solo números.'); setInvalid($('doc_num')); return; }
  if (tipo === 'DNI' && v.length !== 8) { showErr('err-doc_num', 'DNI debe tener 8 dígitos.'); setInvalid($('doc_num')); return; }
  clearErr('err-doc_num'); setValid($('doc_num'));
});

addBlurValidation('detalle', 'err-detalle', () => {
  const v = $('detalle').value.trim();
  if (v.length < 20) { showErr('err-detalle', 'Mínimo 20 caracteres.'); setInvalid($('detalle')); }
  else { clearErr('err-detalle'); setValid($('detalle')); }
});

addBlurValidation('pedido', 'err-pedido', () => {
  const v = $('pedido').value.trim();
  if (v.length < 10) { showErr('err-pedido', 'Mínimo 10 caracteres.'); setInvalid($('pedido')); }
  else { clearErr('err-pedido'); setValid($('pedido')); }
});

addBlurValidation('fecha_incidente', 'err-fecha_incidente', () => {
  const fi = $('fecha_incidente');
  if (!fi || !fi.value) return;
  if (new Date(fi.value) > hoy) { showErr('err-fecha_incidente', 'No puede ser fecha futura.'); setInvalid(fi); }
  else { clearErr('err-fecha_incidente'); setValid(fi); }
});

/* ---------- BLOQUEO EN TIEMPO REAL (keypress) ---------- */
['nombres', 'apellidos'].forEach(id => {
  const el = $(id);
  if (!el) return;
  el.addEventListener('keypress', (e) => {
    const permitido = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]$/.test(e.key);
    if (!permitido) e.preventDefault();
  });
  el.addEventListener('paste', (e) => {
    const texto      = (e.clipboardData || window.clipboardData).getData('text');
    const soloLetras = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/;
    if (!soloLetras.test(texto)) e.preventDefault();
  });
});