
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Makes from './pages/Catalog';
import AddMake from './makes/AddMake'
import EditMake from './makes/EditMake';
import ViewMake from './makes/ViewMake'

import AddModel from './models/AddModel';
import EditModel from './models/EditModel';
import ViewModel from './models/ViewModel';

import AddGeneration from './generations/AddGeneration';
import EditGeneration from './generations/EditGeneration';
import ViewGeneration from './generations/ViewGeneration';

import AddFacelift from './facelifts/AddFacelift';
import EditFacelift from './facelifts/EditFacelift';
import ViewFacelift from './facelifts/ViewFacelift';

import AddBodystyle from './bodystyles/AddBodystyle';
import AddBodystyle2 from './bodystyles/AddBodystyle';
import EditBodystyle from './bodystyles/EditBodystyle';
import ViewBodystyle from './bodystyles/ViewBodystyle';

import AddTrim from './trims/AddTrim';
import EditTrim from './trims/EditTrim';
import ViewTrim from './trims/ViewTrim';

import AddUser from './users/AddUser';
import EditUser from './users/EditUser';
import ViewUser from './users/ViewUser';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Home />} />

          <Route exact path='/catalog' element={<Makes/>} />
          <Route exact path='/catalog/addMake' element={<AddMake/>} />
          <Route exact path='/editmake/:id' element={<EditMake />} />
          <Route exact path='/catalog/:make' element={<ViewMake />} />

          <Route exact path='/catalog/:make/addModel' element={<AddModel/>} />
          <Route exact path='/editmodel/:id' element={<EditModel />} />
          <Route exact path='/catalog/:make/:model' element={<ViewModel />} />

          <Route exact path='/catalog/:make/:model/addGeneration' element={<AddGeneration/>} />
          <Route exact path='/editmodel/:id' element={<EditGeneration />} />
          <Route exact path='/catalog/:make/:model/:generationId' element={<ViewGeneration />} />

          <Route exact path='/catalog/:make/:model/:generation/addFacelift' element={<AddFacelift/>} />
          <Route exact path='/editmodel/:id' element={<EditFacelift />} />

          <Route exact path='/catalog/:make/:model/:generation/addBodystyle' element={<AddBodystyle/>} />
          <Route exact path='/editmodel/:id' element={<EditBodystyle />} />
          <Route exact path='/catalog/:make/:model/:generation/:bodystyleId' element={<ViewBodystyle />} />

          <Route exact path='/catalog/:make/:model/:generation/:bodystyle/addTrim' element={<AddTrim/>} />
          <Route exact path='/editmodel/:id' element={<EditTrim />} />
          <Route exact path='/catalog/:make/:model/:generationId/:bodystyleId/:trimId' element={<ViewTrim />} />

          <Route exact path='/adduser' element={<AddUser />} />
          <Route exact path='/edituser/:id' element={<EditUser />} />
          <Route exact path='/viewuser/:id' element={<ViewUser />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
