import { Route, Routes,  } from 'react-router-dom';

import './App.css';
import LogIn from './pages/LogIn';
import Dashboard from './pages/Dashboard';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardManager from './pages/DashboardManager';

const App = () => {
    let token = sessionStorage.getItem( 'token' ),
        role = sessionStorage.getItem( 'role' );
    return (
       <Routes>
            {
                !token 
                    ? <Route path='/' element={<LogIn />} />
                    : role === 'user'
                        ? <Route path='/' element={<Dashboard />} />
                        : role === 'admin'
                            ? <Route path='/' element={<DashboardAdmin />} />
                            : role === 'manager'
                                ? <Route path='/' element={<DashboardManager />} />
                                : null
            } 
       </Routes>
    );
}

export default App;