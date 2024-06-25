
import React from 'react';
import UniversityUpload from './components/universityUpload';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import StudentSend from './components/StudentSendToEmployer';
import StudentLogin from './components/StudentLogin';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewBlocks from './components/ViewBlocks';
import EmployerView from './components/EmployerView';
import EncryptAndDecrypt from './components/EncryptDecrypt';
import ContractInformation from './components/contractInformation';
import MongoUsers from './components/mongo';
import Pinata from './components/PinataTest';
import CreateUser from './components/CreateUser';
import EmployerLogin from './components/EmployerLogin';
import StudentPage from './components/StudentPage';
import EmployerPage from './components/EmployerPage';
import UniversityPage from './components/UniversityPage';
import StudentView from './components/StudentView';
import UniversityUpdate from './components/UniversityUpdate';


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="/university/deploy" element={<UniversityUpload />} />
          <Route path="home" element={<Home />}/>
          <Route path="/pinata" element={<Pinata />} />
          <Route path="/student/send" element = {<StudentSend />} />
          <Route path="/student/receive" element = {<StudentLogin />} />
          <Route path='viewblocks' element = {<ViewBlocks/>} />
          <Route path='/employer/login' element = {<EmployerLogin />} />
          <Route path='/crypto' element = {<EncryptAndDecrypt />} />
          <Route path='/contract/information' element = {<ContractInformation/>}/>
          <Route path='/userfetchtest' element = {<MongoUsers/>}/>
          <Route path='/createuser' element = {<CreateUser/>}/>
          <Route path='/employer/view' element = {<EmployerView/>}/>
          <Route path='/student/page' element = {<StudentPage/>}/>
          <Route path='/employer/page' element = {<EmployerPage/>}/>
          <Route path='/university/page' element = {<UniversityPage/>}/>
          <Route path= '/student/view' element = {<StudentView />} />
          <Route path= '/university/update' element = {<UniversityUpdate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
