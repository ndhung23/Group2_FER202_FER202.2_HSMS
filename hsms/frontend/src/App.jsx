import {Toaster} from 'sonner';
import {BrowserRouter,Routes,Route} from 'react-router';
import HomePage from './pages/HomePage.jsx';
import NotFound from './pages/NotFound.jsx';
// Thieu authentication 
function App() {
  return <>
    {/* Bat che do Routing cho react */}
    <Toaster richColors/>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  </>;
}

export default App;
