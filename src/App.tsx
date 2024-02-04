import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LineChart from './pages/LineChart';
import Product from './pages/Product';
import NotFound from './pages/NotFound';
import BarChart from './pages/BarChart';

export function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/product' element={<Product />} />
      <Route path='/line-chart' element={<LineChart />} />
      <Route path='/bar-chart' element={<BarChart />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export function WrappedApp() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}
