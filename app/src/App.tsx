import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import Shell from './components/Shell'
import Home from './pages/Home'
import PathPage from './pages/PathPage'
import ModulePage from './pages/ModulePage'
import Catalog from './pages/Catalog'
import Programs from './pages/Programs'
import ProgressPage from './pages/ProgressPage'
import PathChooser from './components/PathChooser'

function Paths() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <h1 className="text-5xl font-semibold">Choose your pace</h1>
      <p className="mt-3 max-w-[62ch] text-lg text-ink-soft">
        The shorter paths are subsets of the full degree. Anything you finish counts in every path, so you can start short and keep going.
      </p>
      <div className="mt-10"><PathChooser /></div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="paths" element={<Paths />} />
          <Route path="path/:pathId" element={<PathPage />} />
          <Route path="path/:pathId/module/:moduleId" element={<ModulePage />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="programs" element={<Programs />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
