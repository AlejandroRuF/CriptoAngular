// src/app/utils/formatear-datos.util.ts

export function formatearDatos(prices: number[][], rango: string): { labels: string[], data: number[] } {
  const labels: string[] = [];
  const data: number[] = [];

  if (rango === '1') {
    for (let price of prices) {
      const fecha = new Date(price[0]);
      labels.push(`${fecha.getHours().toString().padStart(2, '0')}h`);
      data.push(price[1]);
    }
  } else if (rango === '7' || rango === '30' || rango === '365') {
    for (let price of prices) {
      const fecha = new Date(price[0]);
      labels.push(`${fecha.getDate()}/${fecha.getMonth() + 1}`);
      data.push(price[1]);
    }
  }

  return { labels, data };
}
