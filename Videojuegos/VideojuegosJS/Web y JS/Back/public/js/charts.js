//STATS DE JUEGO
//GRAFICAS
//Para todos los valores de las opciones en los graficos https://www.chartjs.org/docs/latest/charts/line.html
/**
 * @param {number} alpha Indicated the transparency of the color
 * @returns {string} A string of the form 'rgba(240, 50, 123, 1.0)' that represents a color
 */
function random_color(alpha = 1.0) {
    const r_c = () => Math.round(Math.random() * 255)
    return `rgba(${r_c()}, ${r_c()}, ${r_c()}, ${alpha}`
}
document.addEventListener("DOMContentLoaded", async () => { //Cuando el DOM se haya cargado completamente, se ejecuta la funcion
    try {
        // VISTA TOP_5 JEFES DERROTADOS
        const top5_response = await fetch('http://localhost:3000/api/views/top5', { method: 'GET' });

        if (top5_response.ok) {
            // Si la respuesta es correcta, se procesa la respuesta JSON
            const top5_data = await top5_response.json();
            // Se obtienen los nombres y los jefes derrotados de los datos
            const nombres = top5_data.map(e => e['Nombre']);
            // Se obtienen los jefes derrotados de los datos
            const jefes = top5_data.map(e => e['Jefes_Derrotados']);
           
            // Crear el gráfico tipo DOUGHNUT
            const ctxTop5 = document.getElementById('apiChart1').getContext('2d');
            new Chart(ctxTop5, {
                type: 'doughnut',
                data: {
                    labels: nombres,
                    datasets: [{
                        label: 'Jefes Derrotados',
                        data: jefes,
                        backgroundColor: nombres.map(() => random_color(0.7)),
                        borderColor: 'black',
                        borderWidth: 1,
                        hoverOffset: 5,
                        hoverBorderColor: 'black',
                        hoverBorderWidth: 4
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Top 5 Jugadores con Más Jefes Derrotados'
                        }
                    }
                }
            });
        } else {
            console.error("Error al obtener datos de /api/views/top5:", top5_response.status);
        }

        // VISTA EDADES
        const edades_response = await fetch('http://localhost:3000/api/views/edades', { method: 'GET' });

        if (edades_response.ok) {
            // Si la respuesta es correcta, se procesa la respuesta JSON
            const edades_data = await edades_response.json();
            // Se obtienenn las edades de los jugadore
            const edades = edades_data.map(e => e['Edad']);
            const numeros = edades_data.map(e => e['Numero']);

            const ctxEdades = document.getElementById('apiChart2').getContext('2d');
            new Chart(ctxEdades, {
                type: 'line',
                data: {
                    labels: edades,
                    datasets: [{
                        label: 'Número de jugadores',
                        data: numeros,
                        fill: true,
                        borderCapStyle: 'round',
                        backgroundColor: random_color(0.5),
                        pointStyle: 'circle',
                        pointRadius: 5,
                        tension: 0.4,
                        pointborderColor: 'black'
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Edades de los Jugadores'
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Edad'
                            },
                            grid: { //Quitamos las lineas de la cuadrícula
                                display: false
                            }
                        },
                        y: {
                            grid: { //Quitamos las lineas de la cuadrícula
                                display: false
                            },
                            ticks: {
                                stepSize: 1 // Escala en y de 1 a 1. Porque el default era de 0.5 y no tenia sentido con los datos
                            }
                        }
                    }
                },
            });
        } else {
            console.error("Error al obtener datos de /api/views/edades:", edades_response.status);
        }

        //VISTA TOP_3 MENOR TIEMPO
        const tiempo_response = await fetch('http://localhost:3000/api/views/topMenorTiempo', { method: 'GET' });

        if (tiempo_response.ok) {
            const tiempo_data = await tiempo_response.json();

            // Obtener los nombres y los tiempos convertidos a segundos
            const nombres = tiempo_data.slice(0, 3).map(e => e['Nombre']);
            const tiemposSegundos = tiempo_data.slice(0, 3).map(e => {
                const [hh, mm, ss] = e['Mejor Tiempo'].split(':').map(Number);
                return hh * 3600 + mm * 60 + ss;
            });

            // Crear el gráfico tipo BAR
            const ctxTiempo = document.getElementById('apiChart3').getContext('2d');
            new Chart(ctxTiempo, {
                type: 'bar',
                data: {
                    labels: nombres,
                    datasets: [{
                        label: 'Mejor Tiempo (en segundos)',
                        data: tiemposSegundos,
                        backgroundColor: nombres.map(() => random_color(0.3)),
                        borderColor: 'black',
                        borderWidth: 1,
                        hoverOffset: 5,
                        hoverBorderColor: 'black',
                        hoverBorderWidth: 4
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Top 3 Jugadores con Menor Tiempo'
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Tiempo (en segundos)'
                            },
                            grid: { //Quitamos las lineas de la cuadrícula
                                display: false
                            }
                        },
                        x: {
                            grid: { //Quitamos las lineas de la cuadrícula
                                display: false
                            }
                        }

                    }
                }
            });
        } else {
            console.error("Error al obtener datos de /api/views/top_menortiempo:", tiempo_response.status);
        }
    
    } catch (error) {
        console.error("Error al cargar los gráficos:", error);
    }
});