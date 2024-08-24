
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Makes from './pages/Catalog';
import AddMake from './catalog/makes/AddMake'
import EditMake from './catalog/makes/EditMake';
import ViewMake from './catalog/makes/ViewMake'

import AddModel from './catalog/models/AddModel';
import EditModel from './catalog/models/EditModel';
import ViewModel from './catalog/models/ViewModel';

import AddGeneration from './catalog/generations/AddGeneration';
import EditGeneration from './catalog/generations/EditGeneration';
import ViewGeneration from './catalog/generations/ViewGeneration';

import AddFacelift from './catalog/facelifts/AddFacelift';
import EditFacelift from './catalog/facelifts/EditFacelift';

import AddBodystyle from './catalog/bodystyles/AddBodystyle';
import EditBodystyle from './catalog/bodystyles/EditBodystyle';
import ViewBodystyle from './catalog/bodystyles/ViewBodystyle';

import AddTrim from './catalog/trims/AddTrim';
import EditTrim from './catalog/trims/EditTrim';
import ViewTrim from './catalog/trims/ViewTrim';

import AddUser from './administration/users/AddUser';
import EditUser from './administration/users/EditUser';
import ViewUser from './administration/users/ViewUser';
import Users from './administration/users/Users';

import Administration from './administration/Administration';

import AddCountry from './administration/countries/AddCountry';
import EditCountry from './administration/countries/EditCountry';
import Countries from './administration/countries/Countries';

import AddMarket from './administration/markets/AddMarket';
import EditMarket from './administration/markets/EditMarket';
import Markets from './administration/markets/Markets';

import AddEngine from './administration/engines/AddEngine';
import EditEngine from './administration/engines/EditEngine';
import Engines from './administration/engines/Engines';

import AddTransmission from './administration/transmissions/AddTransmission';
import EditTransmission from './administration/transmissions/EditTransmission';
import Transmissions from './administration/transmissions/Transmissions';

import AddBody from './administration/bodies/AddBody';
import EditBody from './administration/bodies/EditBody';
import Bodies from './administration/bodies/Bodies';

import AddDrivetrain from './administration/drivetrains/AddDrivetrain';
import EditDrivetrain from './administration/drivetrains/EditDrivetrain';
import Drivetrains from './administration/drivetrains/Drivetrains';

import AddBodytype from './administration/bodytypes/AddBodytype';
import EditBodytype from './administration/bodytypes/EditBodytype';
import Bodytypes from './administration/bodytypes/Bodytypes';

import AddSpot from './spots/AddSpot';
import EditSpot from './spots/EditSpot';
import Spots from './spots/Spots';

import Autosport from './autosport/Autosport';
import ImageUpload from './pages/ImageUpload';
import BucketAvailabilityChecker from './administration/BucketAvailabilityChecker';



function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Home />} />

          <Route exact path='/catalog' element={<Makes />} />
          <Route exact path='/catalog/addMake' element={<AddMake />} />
          <Route exact path='/catalog/editMake/:make' element={<EditMake />} />
          <Route exact path='/catalog/:make' element={<ViewMake />} />

          <Route exact path='/catalog/:make/addModel' element={<AddModel />} />
          <Route exact path='/catalog/:make/:model/editmodel' element={<EditModel />} />
          <Route exact path='/catalog/:make/:model' element={<ViewModel />} />

          <Route exact path='/catalog/:make/:model/addGeneration' element={<AddGeneration />} />
          <Route exact path='/catalog/:make/:model/:generationId/editGeneration' element={<EditGeneration />} />
          <Route exact path='/catalog/:make/:model/:generationId' element={<ViewGeneration />} />

          <Route exact path='/catalog/:make/:model/:generation/addFacelift' element={<AddFacelift />} />
          <Route exact path='/catalog/:make/:model/:generationId/:faceliftId/editFacelift' element={<EditFacelift />} />

          <Route exact path='/catalog/:make/:model/:generation/addBodystyle' element={<AddBodystyle />} />
          <Route exact path='/catalog/:make/:model/:generationId/:bodystyleId/editBodystyle' element={<EditBodystyle />} />
          <Route exact path='/catalog/:make/:model/:generationId/:bodystyleId' element={<ViewBodystyle />} />

          <Route exact path='/catalog/:make/:model/:generationId/:bodystyleId/addTrim' element={<AddTrim />} />
          <Route exact path='/catalog/:make/:model/:generationId/:bodystyleId/:trimId/editTrim' element={<EditTrim />} />
          <Route exact path='/catalog/:make/:model/:generationId/:bodystyleId/:trimId' element={<ViewTrim />} />

          <Route exact path='/administration/users/adduser' element={<AddUser />} />
          <Route exact path='/edituser/:id' element={<EditUser />} />
          <Route exact path='/viewuser/:id' element={<ViewUser />} />
          <Route exact path='/administration/users' element={<Users />} />

          <Route exact path='/administration' element={<Administration />} />

          <Route exact path='/administration/check-bucket-availability' element={<BucketAvailabilityChecker />} />
          <Route exact path='/administration/imageUpload' element={<ImageUpload />} />

          <Route exact path='/administration/countries/addCountry' element={<AddCountry />} />
          <Route exact path='/administration/countries/editCountry/:id' element={<EditCountry />} />
          <Route exact path='/administration/countries' element={<Countries />} />

          <Route exact path='/administration/markets/addMarket' element={<AddMarket />} />
          <Route exact path='/administration/markets/editMarket/:id' element={<EditMarket />} />
          <Route exact path='/administration/markets' element={<Markets />} />

          <Route exact path='/administration/engines/addEngine' element={<AddEngine />} />
          <Route exact path='/administration/engines/editEngine/:id' element={<EditEngine />} />
          <Route exact path='/administration/engines' element={<Engines />} />

          <Route exact path='/administration/transmissions/addTransmission' element={<AddTransmission />} />
          <Route exact path='/administration/transmissions/editTransmission/:id' element={<EditTransmission />} />
          <Route exact path='/administration/transmissions' element={<Transmissions />} />

          <Route exact path='/administration/bodies/addBody' element={<AddBody />} />
          <Route exact path='/administration/bodies/editBody/:id' element={<EditBody />} />
          <Route exact path='/administration/bodies' element={<Bodies />} />

          <Route exact path='/administration/drivetrains/addDrivetrain' element={<AddDrivetrain />} />
          <Route exact path='/administration/drivetrains/editDrivetrain/:id' element={<EditDrivetrain />} />
          <Route exact path='/administration/drivetrains' element={<Drivetrains />} />

          <Route exact path='/administration/bodytypes/addBodytype' element={<AddBodytype />} />
          <Route exact path='/administration/bodytypes/editBodytype/:id' element={<EditBodytype />} />
          <Route exact path='/administration/bodytypes' element={<Bodytypes />} />

          <Route exact path='/spots/addSpot' element={<AddSpot />} />
          <Route exact path='/spots/editSpot' element={<EditSpot />} />
          <Route exact path='/spots/' element={<Spots />} />

          <Route exact path='/autosport' element={<Autosport />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
