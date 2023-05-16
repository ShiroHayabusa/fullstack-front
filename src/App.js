
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import AddMake from './makes/AddMake'
import EditMake from './makes/EditMake';
import ViewMake from './makes/ViewMake'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddUser from './users/AddUser';
import EditUser from './users/EditUser';
import ViewUser from './users/ViewUser';
import Makes from './pages/Makes';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Home />} />

          <Route exact path='/makes' element={<Makes/>} />
          <Route exact path='/addmake' element={<AddMake/>} />
          <Route exact path='/editmake/:id' element={<EditMake />} />
          <Route exact path='/viewmake/:id' element={<ViewMake />} />

          <Route exact path='/adduser' element={<AddUser />} />
          <Route exact path='/edituser/:id' element={<EditUser />} />
          <Route exact path='/viewuser/:id' element={<ViewUser />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
