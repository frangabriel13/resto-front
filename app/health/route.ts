// Para el healthcheck de la imagen: responde sin consultar la API, así un
// problema de la API no hace que reinicien el front.
export function GET() {
  return new Response("ok");
}
