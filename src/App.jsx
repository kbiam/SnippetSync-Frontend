import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import './App.css';
import Header from './components/Header/Header';
import SnippetList from './components/SnippetList';
import Footer from './components/Footer/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Otp from './components/Otp';
import { helix } from 'ldrs'
import SearchContextProvider from './components/context/SearchContextProvider';
import ModalContextProvider from './components/context/ModalContextProvider';
import { LoadingContextProvider } from './components/context/LoadingContextProvider';
import { useContext } from 'react';
import LoadingContext from './components/context/LoadingContext';
import AuthContext from './components/context/AuthContext';
import { AuthContextProvider } from './components/context/AuthContextProvider';
import SnippetShare from './components/SnippetShare';
import { SkeletonTheme } from 'react-loading-skeleton';

helix.register()

// function AuthChecker({ children }) {
//   const cookies = new Cookies();
//   const location = useLocation();
//   const [authState, setAuthState] = useState({
//     isAuthenticated: false,
//     isVerified: false,
//   });
//   const [isLoading, setLoading] = useState(true)

//   useEffect(() => {
//     const checkAuthState = async () => {

//       const token = cookies.get('token');
//       if (token) {
//         try {
//           const response = await fetch('http://localhost:3000/checkState', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             credentials: 'include',
//           });
//           if(response.ok){
//             console.log("ok")
//             const data = await response.json();
//             if(data.isVerified){
//               setAuthState({
//                 isAuthenticated: true,
//                 isVerified: true,
//               })
              
//             }
//             if(!data.isVerified){
//               setAuthState({
//                 isAuthenticated: true,
//                 isVerified: false,
//               })
//             }
//           }
//           else{
//             console.log("error")
//           }
//           setLoading(false)
//         } catch (err) {
//           setLoading(false)
//           console.error('Token verification failed', err);
//           setAuthState({ isAuthenticated: false, isVerified: false });
//         }
//       }
//       setLoading(false)
//     };

//      checkAuthState(); // Invoke the async function

//   }, [location]); // Include cookies and location in the dependency array

//   return (
//     <>
//       {isLoading ? (
//         <div className='flex items-center justify-center min-h-screen'>
//           <l-helix size="100" speed="2.5" color="black"></l-helix>
//         </div>
//       ) : (
//         children(authState)
//       )}
//     </>
//   );
// }
function AuthChecker({ children }) {
  const cookies = new Cookies();
  const location = useLocation();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // const [isLoading, setLoading] = useState(true);
  const {isLoading, showLoading, hideLoading} = useContext(LoadingContext)
  const {authState, authStateSignUp, logoutAuthState, verifyAuthState, loginAuthState} = useContext(AuthContext)


  const logout = () => {
    showLoading()
    cookies.remove('token');
    logoutAuthState();
    hideLoading();
  };

  useEffect(() => {
    const checkAuthState = async () => {
      const token = cookies.get('token');
      console.log("token",token)
      if (token) {
        showLoading();
        try {
          console.log("sending req")
          const response = await fetch('https://snippetsync-backend.onrender.com/checkState', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials:"include"
            
          });
          if (response.status === 401) {
            cookies.remove('token');
          }
          if (response.ok) {
            const data = await response.json();
            verifyAuthState(data.isVerified)
            // setAuthState({
            //   isAuthenticated: true,
            //   isVerified: data.isVerified,
            // });
          } else {
            logoutAuthState()
          }
        } catch (err) {
          console.error('Token verification failed', err);
          logoutAuthState()
        }
        hideLoading();
      } else {
        logoutAuthState()
        hideLoading();
      }
      setAuthCheckComplete(true);

    };

    checkAuthState(); // Invoke the async function
  }, []); // Include location in the dependency array
 // Include location in the dependency array

  // return (
  //   <>
  //     {isLoading ? (
  //       <div className='flex items-center justify-center min-h-screen'>
  //         <l-helix size="100" speed="2.5" color="white"></l-helix>
  //       </div>
  //     ) : (
  //       children(authState, authStateSignUp,logout)
  //     )}
  //   </>
  // );
  if (!authCheckComplete) {
    return null
  }

  return children(authState, logout);
}




function App() {
  return (
    <div className="App">
      <SkeletonTheme baseColor='#282C34' highlightColor='#525252'>
      <AuthContextProvider>
    <SearchContextProvider>
      <ModalContextProvider>
        <LoadingContextProvider>
        <main>
          <AuthChecker>
            {(authState, logout) => (
              <Routes>
                <Route path='/login' element={!authState.isAuthenticated ? <Login /> : <Navigate to={authState.isVerified ? '/snippets' : '/verify-otp'} replace />} />
                <Route path='/snippets' element={authState.isVerified ? <SnippetList logout ={logout} /> : <Navigate to="/login" replace />} />
                <Route path='/signup' element={!authState.isAuthenticated ? <Register/> : <Navigate to={authState.isVerified ? "/snippets" : "/verify-otp"} replace />} />
                <Route 
                  path='/verify-otp' 
                  element={authState.isAuthenticated 
                    ? (!authState.isVerified 
                      ? <Otp /> 
                      : <Navigate to='/snippets' replace />) 
                    : <Navigate to="/signup" replace />} 
                />
                <Route path='/snippet/:snippetId' element={<SnippetShare/>}/>
                <Route path="*" element={<Navigate to={authState.isVerified ? "/snippets" : "/login"} />} />
              </Routes>
            )}
          </AuthChecker>
        </main>
        </LoadingContextProvider>
      </ModalContextProvider>
    </SearchContextProvider>
    </AuthContextProvider>
    </SkeletonTheme>
  </div>
  );
}

export default App;
