// 1. Configuración del Sheet
const sheetId = "1M7dV2jRDWsh4A4PhbVlbpFmcEX4l-C-2ERUdG-F29ew";
const urlSheet = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=responseHandler:rellenarCuadros`;

// 2. Función que rellena los cuadros
function rellenarCuadros(data) {
    const rows = data.table.rows;
    rows.forEach(row => {
        const idPartido = row.c[0]?.v?.toString().toLowerCase().trim();
        if (idPartido) {
            const contenedor = document.getElementById(idPartido);
            if (contenedor) {
                const eq1 = row.c[1]?.v || "";
                const eq2 = row.c[2]?.v || "";
                const idaRaw = row.c[3]?.v?.toString() || "";
                const vueltaRaw = row.c[4]?.v?.toString() || "";

                const parsePuntos = (str) => {
                    if (!str || !str.includes('-')) return [0, 0];
                    return str.split('-').map(s => Number(s.trim()) || 0);
                };

                // --- LÓGICA ESPECIAL PARA LA FINAL (id: f1) ---
                if (idPartido === 'f1') {
                    const p = parsePuntos(idaRaw); // Usamos la columna de "Ida" como resultado único
                    const claseWin1 = (p[0] > p[1]) ? "ganador" : "";
                    const claseWin2 = (p[1] > p[0]) ? "ganador" : "";

                    contenedor.innerHTML = `
                        <div class="fila-equipo ${claseWin1}">
                            <span class="nombre">${eq1}</span>
                            <div class="puntos-wrapper">
                                <span class="total">${p[0]}</span>
                            </div>
                        </div>
                        <div class="fila-equipo ${claseWin2}">
                            <span class="nombre">${eq2}</span>
                            <div class="puntos-wrapper">
                                <span class="total">${p[1]}</span>
                            </div>
                        </div>
                    `;
                } 
                // --- LÓGICA NORMAL PARA EL RESTO DE PARTIDOS ---
                else {
                    const pIda = parsePuntos(idaRaw);
                    const pVuelta = parsePuntos(vueltaRaw);
                    const total1 = pIda[0] + pVuelta[0];
                    const total2 = pIda[1] + pVuelta[1];

                    const claseWin1 = (total1 > total2 && (idaRaw || vueltaRaw)) ? "ganador" : "";
                    const claseWin2 = (total2 > total1 && (idaRaw || vueltaRaw)) ? "ganador" : "";

                    contenedor.innerHTML = `
                        <div class="fila-equipo ${claseWin1}">
                            <span class="nombre">${eq1}</span>
                            <div class="puntos-wrapper">
                                <span class="pt">${idaRaw ? pIda[0] : '-'}</span>
                                <span class="separador">|</span>
                                <span class="pt">${vueltaRaw ? pVuelta[0] : '-'}</span>
                                <span class="total">${total1}</span>
                            </div>
                        </div>
                        <div class="fila-equipo ${claseWin2}">
                            <span class="nombre">${eq2}</span>
                            <div class="puntos-wrapper">
                                <span class="pt">${idaRaw ? pIda[1] : '-'}</span>
                                <span class="separador">|</span>
                                <span class="pt">${vueltaRaw ? pVuelta[1] : '-'}</span>
                                <span class="total">${total2}</span>
                            </div>
                        </div>
                    `;
                }
            }
        }
    });
}

// 3. Inyectar el script de Google
const scriptGoogle = document.createElement('script');
scriptGoogle.src = urlSheet;
document.body.appendChild(scriptGoogle);

// 4. LÓGICA DE NAVEGACIÓN
function siguienteRonda() {
    const urlActual = window.location.href;
    if (urlActual.includes('index.html') || !urlActual.includes('.html')) {
        window.location.href = 'cuartos.html';
    } else if (urlActual.includes('cuartos.html')) {
        window.location.href = 'semis.html';
    } else if (urlActual.includes('semis.html')) {
        window.location.href = 'final.html';
    } else if (urlActual.includes('final.html')) {
        window.location.href = 'index.html';
    }
}