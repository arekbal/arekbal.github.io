
interface Socket
{
  on(event: string, callback: (data: any) => void)
  emit(event: string, data: any)
}

interface SocketIOStatic
{
  (namespace: string): Socket

  connect(url: string): Socket
}
  
declare var io: SocketIOStatic

declare module "socket.io-client" {
  export = io;
}

