import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserLayout from "./Layouts/UserLayout"
import Home from "./Pages/Home"

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<UserLayout/>}>
          <Route index element={<Home/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App



   
 