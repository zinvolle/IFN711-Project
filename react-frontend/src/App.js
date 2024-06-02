
import React from 'react';
import UniversityUpload from './components/universityUpload';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import StudentSend from './components/StudentSendToEmployer';
import StudentRecieve from './components/StudentRecieve';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewBlocks from './components/ViewBlocks';
import EmployerPage from './components/EmployerReceiving';
import EncryptAndDecrypt from './components/EncryptDecrypt';
import ContractInformation from './components/contractInformation'
import IPFS from './components/ipfs'
import {IPFSUploader,IPFSDownloader} from './components/ipfs';
import MongoUsers from './components/mongo';
//import IPFSDownloader from './components/ipfs';



function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="/university/deploy" element={<UniversityUpload />} />
          <Route path="home" element={<Home />}/>
          <Route path="/student/send" element = {<StudentSend />} />
          <Route path="/student/receive" element = {<StudentRecieve />} />
          <Route path='viewblocks' element = {<ViewBlocks/>} />
          <Route path='/employer/dashboard' element = {<EmployerPage />} />
          <Route path='/crypto' element = {<EncryptAndDecrypt />} />
          <Route path='/contract/information' element = {<ContractInformation/>}/>
          <Route path='/ipfsuploader' element = {<IPFSDownloader/>}/>
          <Route path='/userfetchtest' element = {<MongoUsers/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;