import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ChakraProvider} from '@chakra-ui/react'
import {BrowserRouter} from 'react-router-dom'
import ChatProvider from './context/ChatProvider.jsx'

createRoot(document.getElementById('root')).render(
  
   <ChakraProvider>
      <BrowserRouter>
      <ChatProvider>
    <App />
    </ChatProvider>
    </BrowserRouter>
    </ChakraProvider>
   
  
)
