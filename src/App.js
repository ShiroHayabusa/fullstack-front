
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect } from 'react';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import Home from './pages/Home';
import { Outlet, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import CookieConsent from "react-cookie-consent";

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

import EditUser from './administration/users/EditUser';
import ViewUser from './administration/users/ViewUser';
import Users from './administration/users/Users';

import AddRole from './administration/roles/AddRole';
import EditRole from './administration/roles/EditRole';
import ViewRole from './administration/roles/ViewRole';
import Roles from './administration/roles/Roles';

import Admin from './administration/Admin';

import AddCountry from './administration/countries/AddCountry';
import EditCountry from './administration/countries/EditCountry';
import Countries from './administration/countries/Countries';

import AddMarket from './administration/markets/AddMarket';
import EditMarket from './administration/markets/EditMarket';
import Markets from './administration/markets/Markets';

import AddEngine from './administration/engines/AddEngine';
import EditEngine from './administration/engines/EditEngine';
import Engines from './administration/engines/Engines';
import ListEngine from './administration/engines/ListEngine';
import ViewEngine from './administration/engines/ViewEngine';

import AddTransmission from './administration/transmissions/AddTransmission';
import EditTransmission from './administration/transmissions/EditTransmission';
import Transmissions from './administration/transmissions/Transmissions';
import ListTransmission from './administration/transmissions/ListTransmission';
import ViewTransmission from './administration/transmissions/ViewTransmission';

import AddBody from './administration/bodies/AddBody';
import EditBody from './administration/bodies/EditBody';
import Bodies from './administration/bodies/Bodies';
import ListBody from './administration/bodies/ListBody';
import ViewBody from './administration/bodies/ViewBody';

import AddDrivetrain from './administration/drivetrains/AddDrivetrain';
import EditDrivetrain from './administration/drivetrains/EditDrivetrain';
import Drivetrains from './administration/drivetrains/Drivetrains';

import AddBodytype from './administration/bodytypes/AddBodytype';
import EditBodytype from './administration/bodytypes/EditBodytype';
import Bodytypes from './administration/bodytypes/Bodytypes';

import AddEngineType from './administration/engineTypes/AddEngineType';
import EditEngineType from './administration/engineTypes/EditEngineType';
import EngineTypes from './administration/engineTypes/EngineTypes';

import AddTransmissionType from './administration/transmissionTypes/AddTransmissionType';
import EditTransmissionType from './administration/transmissionTypes/EditTransmissionType';
import TransmissionTypes from './administration/transmissionTypes/TransmissionTypes';

import AddFuel from './administration/fuels/AddFuel';
import EditFuel from './administration/fuels/EditFuel';
import Fuels from './administration/fuels/Fuels';

import AddSpot from './spots/AddSpot';
import EditSpot from './spots/EditSpot';
import Spots from './spots/Spots';
import ViewSpot from './spots/ViewSpot';
import MySpots from './spots/MySpots';

import Autosport from './autosport/Autosport';
import BucketAvailabilityChecker from './administration/BucketAvailabilityChecker';
import Login from './users/Login';
import Profile from './users/Profile';
import ForgotPassword from './users/ForgotPassword';
import ResetPassword from './users/ResetPassword';
import Register from './users/Register';
import ActivateAccount from './users/ActivateAccount';
import VerifyEmail from './users/VerifyEmail';
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from './pages/Unathorized';
import UserPage from './users/UserPage'
import PrivacyPolicy from './pages/PrivacyPolicy';

const routerOptions = {
  future: {
    v7_startTransition: true,
  },
};

function App() {

  const enableAnalytics = () => {
    console.log("Analytics enabled.");
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    });
  };

  const disableAnalytics = () => {
    console.log("Analytics disabled.");
    window.gtag("consent", "update", {
      analytics_storage: "denied",
    });
    document.cookie = "_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent === "accepted") {
      enableAnalytics();
    } else if (consent === "declined") {
      disableAnalytics();
    }
  }, []);

  return (
    <div className="App">

      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="myCookieConsent"
        style={{ background: "#2B373B" }}
        buttonStyle={{
          color: "#4e503b",
          fontSize: "13px",
        }}
        declineButtonStyle={{
          background: "#e74c3c",
          color: "#fff",
        }}
        expires={150}
        onAccept={() => {
          localStorage.setItem("cookieConsent", "accepted");
          enableAnalytics();
          console.log("Cookies accepted!");
        }}
        onDecline={() => {
          localStorage.setItem("cookieConsent", "declined");
          disableAnalytics();
          console.log("Cookies declined!");
        }}
      >
        This website uses cookies to enhance the user experience. By continuing to
        visit this site, you agree to our use of cookies. Read our{" "}
        <a
          href="/privacyPolicy"
          style={{ color: "#f1d600", textDecoration: "underline" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
        .
      </CookieConsent>

      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/privacyPolicy' element={<PrivacyPolicy />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/users/register' element={<Register />} />
            <Route exact path='/users/forgot-password/' element={<ForgotPassword />} />
            <Route exact path='/users/reset-password/:token' element={<ResetPassword />} />
            <Route exact path='/users/activate-account/:token' element={<ActivateAccount />} />
            <Route exact path='/users/profile/verify-changed-email/:email/:token' element={<VerifyEmail />} />
            <Route exact path='/user/profile' element={<Profile />} />
            <Route exact path='/users/:userId' element={<UserPage />} />


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

            <Route exact path='/engines' element={<Engines />} />
            <Route exact path='/engines/:make' element={<ListEngine />} />
            <Route exact path='/engines/:make/:engineId' element={<ViewEngine />} />

            <Route exact path='/transmissions' element={<Transmissions />} />
            <Route exact path='/transmissions/:make' element={<ListTransmission />} />
            <Route exact path='/transmissions/:make/:transmissionId' element={<ViewTransmission />} />

            <Route exact path='/bodies' element={<Bodies />} />
            <Route exact path='/bodies/:make' element={<ListBody />} />
            <Route exact path='/bodies/:make/:bodyId' element={<ViewBody />} />

            <Route exact path='/spots/addSpot' element={<AddSpot />} />
            <Route exact path='/spots/editSpot/:id' element={<EditSpot />} />
            <Route exact path='/spots' element={<Spots />} />
            <Route exact path='/spots/:id' element={<ViewSpot />} />
            <Route exact path='/spots/mySpots' element={<MySpots />} />

            <Route exact path='/autosport' element={<Autosport />} />

            <Route exact path="/unauthorized" element={<Unauthorized />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute roles={["ROLE_ADMIN"]}>
                  <AdministrationRoutes />
                </ProtectedRoute>
              }
            >
              <Route exact path='users/editUser/:id' element={<EditUser />} />
              <Route exact path='users/:userId' element={<ViewUser />} />
              <Route exact path='users' element={<Users />} />

              <Route exact path='roles/addRole' element={<AddRole />} />
              <Route exact path='roles/editRole/:id' element={<EditRole />} />
              <Route exact path='roles/viewRole/:id' element={<ViewRole />} />
              <Route exact path='roles' element={<Roles />} />

              <Route exact path='' element={<Admin />} />

              <Route exact path='check-bucket-availability' element={<BucketAvailabilityChecker />} />

              <Route exact path='countries/addCountry' element={<AddCountry />} />
              <Route exact path='countries/editCountry/:id' element={<EditCountry />} />
              <Route exact path='countries' element={<Countries />} />

              <Route exact path='markets/addMarket' element={<AddMarket />} />
              <Route exact path='markets/editMarket/:id' element={<EditMarket />} />
              <Route exact path='markets' element={<Markets />} />

              <Route exact path='engines/:make/addEngine' element={<AddEngine />} />
              <Route exact path='engines/:make/:engineId/editEngine' element={<EditEngine />} />

              <Route exact path='transmissions/:make/addTransmission' element={<AddTransmission />} />
              <Route exact path='transmissions/:make/:transmissionId/editTransmission' element={<EditTransmission />} />

              <Route exact path='bodies/:make/addBody' element={<AddBody />} />
              <Route exact path='bodies/:make/:bodyId/editBody' element={<EditBody />} />

              <Route exact path='drivetrains/addDrivetrain' element={<AddDrivetrain />} />
              <Route exact path='drivetrains/editDrivetrain/:id' element={<EditDrivetrain />} />
              <Route exact path='drivetrains' element={<Drivetrains />} />

              <Route exact path='bodytypes/addBodytype' element={<AddBodytype />} />
              <Route exact path='bodytypes/editBodytype/:id' element={<EditBodytype />} />
              <Route exact path='bodytypes' element={<Bodytypes />} />

              <Route exact path='engineTypes/addEngineType' element={<AddEngineType />} />
              <Route exact path='engineTypes/editEngineType/:id' element={<EditEngineType />} />
              <Route exact path='engineTypes' element={<EngineTypes />} />

              <Route exact path='transmissionTypes/addTransmissionType' element={<AddTransmissionType />} />
              <Route exact path='transmissionTypes/editTransmissionType/:id' element={<EditTransmissionType />} />
              <Route exact path='transmissionTypes' element={<TransmissionTypes />} />

              <Route exact path='fuels/addFuel' element={<AddFuel />} />
              <Route exact path='fuels/editFuel/:id' element={<EditFuel />} />
              <Route exact path='fuels' element={<Fuels />} />
            </Route>
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  );
}

const AdministrationRoutes = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
