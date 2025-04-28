import Layout from "./components/layout/Layout"
import { Route, Routes } from "react-router-dom"

function App() {

  return <Layout>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/signup' element={<SignUpPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
    </Routes>
  </Layout>
}

export default App
