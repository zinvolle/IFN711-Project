
import React from 'react';
import UniversityUpload from './components/universityUpload';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import StudentSend from './components/StudentSendToEmployer';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewBlocks from './components/ViewBlocks';
import EmployerPage from './components/EmployerReceiving';
import EncryptAndDecrypt from './components/EncryptDecrypt';
import ContractInformation from './components/contractInformation'



function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="/university/deploy" element={<UniversityUpload />} />
          <Route path="home" element={<Home />}/>
          <Route path="/student/send" element = {<StudentSend />} />
          <Route path='viewblocks' element = {<ViewBlocks/>} />
          <Route path='/employer/dashboard' element = {<EmployerPage />} />
          <Route path='/crypto' element = {<EncryptAndDecrypt />} />
          <Route path='/contract/information' element = {<ContractInformation/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;