import Layout from "./components/layout/Layout"
import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import SignUpPage from "./pages/auth/SignUpPage.jsx"
import LoginPage from "./pages/auth/LoginPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import {useQuery} from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast"
import { axiosInstance } from "./lib/axios";


function App() {

	const { data: authUser, isLoading} = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await axiosInstance.get("/auth/me");
				return res.data;
			} catch (err) {
				if (err.response && err.response.status === 401) {
					return null;
				}
				toast.error(err.response.data.message || "Something went wrong");
			}
		},
	});

	console.log("authUser: ", authUser);

	if (isLoading) return null;

  return <Layout>
    <Routes>
      <Route path='/' element={authUser ? <HomePage/> : <Navigate to={"/login"}/>}/>
      <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to={"/"}/>}/>
      <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to={"/"}/>}/>
	  <Route path='/notifications' element={authUser ? <NotificationsPage /> : <Navigate to={"/login"} />} />
    </Routes>
	<Toaster position="bottom-right" reverseOrder={false} />
  </Layout>
}

export default App
