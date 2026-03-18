import Register from "./components/pages/auth/user/AdminRegistration";
import { BrowserRouter,Route,Routes } from "react-router-dom";
import DbTest from "./components/pages/auth/user/DbTest";
function App(){
    return<>
    <BrowserRouter>
        
        <Routes>
            <Route path="/register" element={<Register/>}></Route>
                <Route path="/test" element={<DbTest />}></Route>
        </Routes>
    </BrowserRouter>
    </>
}
export default App;