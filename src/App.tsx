import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LineChart from './pages/LineChart';
import ScatterPlot from './pages/ScatterPlot';
import Product from './pages/Product';
import NotFound from './pages/NotFound';

export function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/product' element={<Product />} />
      <Route path='/line-chart' element={<LineChart />} />
      <Route path='/scatter-plot' element={<ScatterPlot />} />
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
