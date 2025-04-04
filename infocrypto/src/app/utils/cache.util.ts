const CACHE_TTL = 5*60*1000;

export function guardarEnCache(clave: string, data:any):void{
  const entrada = {
    timestamp: Date.now(),
    data
  };

  localStorage.setItem(clave, JSON.stringify(entrada));
}

export function cargarDesdeCache(clave: string): any | null {
  const item = localStorage.getItem(clave);
  if (!item) return null;

  try {
    const entrada = JSON.parse(item);
    if (Date.now() - entrada.timestamp < CACHE_TTL) {
      return entrada.data;
    }
  }catch {
    return null;
  }
  return null;
}
