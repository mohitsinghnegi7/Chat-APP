import {Route ,Routes} from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'


import './App.css'

function App() {
  

  return (
    <div className=' bg-fixed bg-[url("./assets/background.png")] bg-cover min-h-screen '>
     <div >
      
      <div >
      <Routes>
    <Route path='/' element={<HomePage/>}/>
    <Route path='/chats' element={<ChatPage/>} />
    </Routes>
    </div>
      </div>
      </div>
  )
}

export default App
