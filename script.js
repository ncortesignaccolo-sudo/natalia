// =========================================================================
// 1. CONFIGURACIÓN PRINCIPAL (EDITA AQUÍ LA FECHA Y CONTENIDO DE LOS QR)
// =========================================================================

// Pon aquí la fecha del cumpleaños en formato 'AAAA-MM-DD'
// Por ejemplo: '2026-11-21'
const FECHA_EVENTO = '2026-11-21'; 

// Configuración de los 6 QR consecutivos (de 9:00 a 21:00 cada 3 horas)
const listaQRs = [
    {
        id: 1,
        hora: "09:00",
        titulo: "09:00 AM - ¡Buenos días, 50 años!",
        descripcion: "El día acaba de empezar. Escanea tu primer código para comenzar la aventura.",
        // Puede ser una URL (ej. un audio de Spotify, una foto en Google Drive) o un texto directo
        contenidoQR: "¡Feliz cumpleaños! Tu primera pista está en la cocina, junto al café.",
        esFinal: false
    },
    {
        id: 2,
        hora: "12:00",
        titulo: "12:00 PM - El Aperitivo",
        descripcion: "Mitad de la mañana. Es hora de brindar por estos primeros 50 años.",
        contenidoQR: "https://youtu.be/dQw4w9WgXcQ", // Cambia por el enlace que quieras
        esFinal: false
    },
    {
        id: 3,
        hora: "15:00",
        titulo: "03:00 PM - Hora de Celebrar",
        descripcion: "Después de comer toca un pequeño recuerdo de tus mejores momentos.",
        contenidoQR: "Mira debajo de tu silla o busca el sobre dorado con el número 3.",
        esFinal: false
    },
    {
        id: 4,
        hora: "18:00",
        titulo: "06:00 PM - La Tarde Dorada",
        descripcion: "Ya queda menos para la gran sorpresa de la noche. Aquí tienes tu cuarta clave.",
        contenidoQR: "https://tu-enlace-a-un-album-de-fotos.com", 
        esFinal: false
    },
    {
        id: 5,
        hora: "21:00",
        titulo: "09:00 PM - El Vídeo Final",
        descripcion: "Llegó la hora. Escanea este código para ver lo que hemos preparado para ti.",
        contenidoQR: "https://tu-enlace-al-video-final-50-anos.com", // Enlace al vídeo final
        esFinal: false
    },
    {
        id: 6,
        hora: "21:00", // Se desbloquea junto al vídeo final a las 9 de la noche
        titulo: "09:00 PM - Gran Final y Dedicatoria",
        descripcion: "El último código de hoy. Escanéalo o lee nuestro mensaje para ti.",
        contenidoQR: "¡Felices 50 años! Gracias por ser el pilar de nuestras vidas. ¡Te queremos muchísimo!",
        esFinal: true,
        // Este texto aparecerá en pantalla automáticamente al desbloquearse el QR #6
        mensajeEspecialFinal: `
            <strong>¡FELICES 50 AÑOS! 🥂✨</strong><br><br>
            Hoy celebramos medio siglo de tu vida, tus risas, tus consejos y todo el amor que nos das cada día. 
            Este vídeo y cada pista de hoy son solo un pequeño reflejo de lo importante que eres para todos nosotros. 
            ¡Por otros 50 años más llenos de salud y felicidad!
        `
    }
];

// =========================================================================
// 2. LÓGICA DEL SISTEMA (NO ES NECESARIO TOCAR ESTO)
// =========================================================================

let modoPruebaActivo = false;
const contenedor = document.getElementById('qr-container');

// Crear la estructura HTML de cada tarjeta
function inicializarTarjetas() {
    contenedor.innerHTML = '';

    listaQRs.forEach(item => {
        const card = document.createElement('div');
        card.className = `qr-card locked ${item.esFinal ? 'final-card' : ''}`;
        card.id = `card-${item.id}`;

        // Detectar si el contenido del QR es un enlace web para ofrecer también un botón directo
        const esURL = item.contenidoQR.startsWith('http://') || item.contenidoQR.startsWith('https://');

        card.innerHTML = `
            <span class="step-badge">Pista #${item.id} • ${item.hora} hrs</span>
            <h2>${item.titulo}</h2>
            <p class="qr-desc">${item.descripcion}</p>
            
            <div class="qr-wrapper">
                <div id="qrcode-${item.id}" class="qr-code-box"></div>
                <div class="lock-overlay" id="overlay-${item.id}">
                    <span class="lock-icon">🔒</span>
                    <span style="font-size: 0.8rem;">Se desbloquea en:</span>
                    <div class="countdown-timer" id="timer-${item.id}">--:--:--</div>
                </div>
            </div>

            <!-- Botón directo opcional por si lo abre desde el mismo móvil y no puede escanear su propia pantalla -->
            <div id="extra-${item.id}" style="display: none;">
                ${esURL ? `<a href="${item.contenidoQR}" target="_blank" class="btn-link">Abrir enlace directamente ↗</a>` : ''}
                ${item.esFinal ? `<div class="final-message-box">${item.mensajeEspecialFinal}</div>` : ''}
            </div>
        `;

        contenedor.appendChild(card);

        // Generar el código QR real dentro del div
        new QRCode(document.getElementById(`qrcode-${item.id}`), {
            text: item.contenidoQR,
            width: 180,
            height: 180,
            colorDark : "#0f1115",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    });
}

// Actualizar los contadores cada segundo
function actualizarRelojes() {
    const ahora = new Date();

    listaQRs.forEach(item => {
        const fechaObjetivo = new Date(`${FECHA_EVENTO}T${item.hora}:00`);
        const diferencia = fechaObjetivo - ahora;

        const card = document.getElementById(`card-${item.id}`);
        const overlay = document.getElementById(`overlay-${item.id}`);
        const timer = document.getElementById(`timer-${item.id}`);
        const extra = document.getElementById(`extra-${item.id}`);

        if (diferencia <= 0 || modoPruebaActivo) {
            // DESBLOQUEADO
            card.classList.remove('locked');
            card.classList.add('unlocked');
            overlay.style.display = 'none';
            extra.style.display = 'block';
        } else {
            // BLOQUEADO (Calcular horas, minutos y segundos restantes)
            card.classList.add('locked');
            card.classList.remove('unlocked');
            overlay.style.display = 'flex';
            extra.style.display = 'none';

            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
            const minutos = Math.floor((diferencia / 1000 / 60) % 60);
            const segundos = Math.floor((diferencia / 1000) % 60);

            const hStr = String(horas).padStart(2, '0');
            const mStr = String(minutos).padStart(2, '0');
            const sStr = String(segundos).padStart(2, '0');

            if (dias > 0) {
                timer.textContent = `${dias}d ${hStr}:${mStr}:${sStr}`;
            } else {
                timer.textContent = `${hStr}:${mStr}:${sStr}`;
            }
        }
    });
}

// Botón para probar antes de la fecha
document.getElementById('btn-modo-prueba').addEventListener('click', function() {
    modoPruebaActivo = !modoPruebaActivo;
    this.textContent = modoPruebaActivo ? '🔒 Volver al modo reloj real' : '👁️ Modo Prueba (Desbloquear todo)';
    actualizarRelojes();
});

// Arrancar la aplicación
inicializarTarjetas();
actualizarRelojes();
setInterval(actualizarRelojes, 1000);
