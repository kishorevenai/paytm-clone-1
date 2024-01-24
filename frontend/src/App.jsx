import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import SignIn from "./Components/SignIn/SignIn";
import SignUp from "./Components/Signup/SignUp";
import Dashboard from "./Components/Dashboard/Dashboard";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
