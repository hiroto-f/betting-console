import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import EventOptionAddPage from './pages/EventOptionAddPage';
import EventAddPage from './pages/EventAddPage'; // ← 追加

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventListPage />} />
        <Route path="/events/new" element={<EventAddPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route
          path="/events/:id/options/new"
          element={<EventOptionAddPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
