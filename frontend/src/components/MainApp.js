import Login from "./auth/Login";
import {Route, Routes} from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import SendCode from "./password-recovery/SendCode";
import Registrar from "./auth/Registrar";
import ResetPassword from "./password-recovery/ResetPassword";
import ConfirmationCode from "./password-recovery/ConfirmationCode";
import AddClient from "./clients/AddClient";
import Clients from "./clients/Clients";
import ProtectedRoute from "./ProtectedRoute";
import EditClient from "./clients/EditClient";
import DeletedClients from "./clients/DeletedClients";
import ClientsWithRegistrars from "./registrars/ClientsWithRegistrars";
import AddPayment from "./registrars/AddPayment";

const MainApp = () => {
    return (
        <div>
            <Header/>
            <Routes>
                <Route exact path="/" element={<Login/>}/>
                <Route exact path="/login/" element={<Login message={""}/>}/>
                <Route exact path='/home' element={<ProtectedRoute/>}>
                    <Route exact path='/home' element={<Home/>}/>
                </Route>
                <Route exact path='/clients' element={<ProtectedRoute/>}>
                    <Route exact path='/clients' element={<Clients/>}/>
                </Route>
                <Route exact path='/clients/add' element={<ProtectedRoute/>}>
                    <Route exact path='/clients/add' element={<AddClient/>}/>
                </Route>
                <Route exact path='/clients/edit' element={<ProtectedRoute/>}>
                    <Route exact path='/clients/edit' element={<EditClient/>}/>
                </Route>
                <Route exact path='/clients/deleted' element={<ProtectedRoute/>}>
                    <Route exact path='/clients/deleted' element={<DeletedClients/>}/>
                </Route>
                <Route exact path='/registrars' element={<ProtectedRoute/>}>
                    <Route exact path='/registrars' element={<ClientsWithRegistrars/>}/>
                </Route>
                <Route exact path='/payments/add' element={<ProtectedRoute/>}>
                    <Route exact path='/payments/add' element={<AddPayment/>}/>
                </Route>
                <Route exact path="/password-recovery/" element={<SendCode/>}/>
                <Route exact path="/password-recovery/code" element={<ConfirmationCode/>}/>
                <Route exact path="/password-recovery/reset" element={<ResetPassword/>}/>
                <Route exact path="/registrar/" element={<Registrar/>}/>
                <Route exact path="/confirm/:id"
                       element={<Login message={"Электронная почта подтверждена"}/>}/>
            </Routes>
        </div>
    );
}
export default MainApp;
