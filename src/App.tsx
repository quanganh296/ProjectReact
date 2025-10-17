import { Routes,Route } from 'react-router-dom'
import Register from './pages/auth/Register'
function App() {
 

  return (
    <Routes>
      <Route path = "/" element = {<Register/>}/>
    </Routes>
  );
}

export default App
