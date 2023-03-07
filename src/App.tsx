import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Error from './pages/Error';
import MainPage from './pages/MainPage';
import Room from './pages/Room';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
        errorElement: <Error />,
    },
    {
        path: 'room/:roomId',
        element: <Room />,
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
