import { GameProvider } from '../contexts/gamecontext'
import { SocketProvider } from '../contexts/socketcontex'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <SocketProvider><GameProvider><Component {...pageProps} /></GameProvider></SocketProvider>
}

export default MyApp
