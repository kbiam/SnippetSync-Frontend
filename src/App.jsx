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
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isVerified: false,
  });
  // const [isLoading, setLoading] = useState(true);
  const {isLoading, showLoading, hideLoading} = useContext(LoadingContext)

  const authStateSignUp = () => {
    setAuthState({
      isAuthenticated: true,
      isVerified: false
    });
  };

  const logout = () => {
    showLoading();
    cookies.remove('token');
    setAuthState({
      isAuthenticated: false,
      isVerified: false,
    });
    setTimeout(() => {
      hideLoading();
    }, 500);
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
            setAuthState({
              isAuthenticated: true,
              isVerified: data.isVerified,
            });
          } else {
            setAuthState({ isAuthenticated: false, isVerified: false });
          }
        } catch (err) {
          console.error('Token verification failed', err);
          setAuthState({ isAuthenticated: false, isVerified: false });
        }
        hideLoading();
      } else {
        setAuthState({ isAuthenticated: false, isVerified: false });
        hideLoading();
      }
    };

    checkAuthState(); // Invoke the async function
  }, [location]); // Include location in the dependency array
 // Include location in the dependency array

  return (
    <>
      {isLoading ? (
        <div className='flex items-center justify-center min-h-screen'>
          <l-helix size="100" speed="2.5" color="white"></l-helix>
        </div>
      ) : (
        children(authState, authStateSignUp,logout)
      )}
    </>
  );
  // return (<>
  // {children(authState, authStateSignUp,logout)}
  // </>)
}



function App() {
  const list =[
    {
      id: 1,
      title: 'Fetch API Example',
      description: 'A simple example of using the Fetch API to make a GET request.',
      code: `fetch('https://api.example.com/data')\n.then(response => response.json())\n.then(data => {\n console.log(data);\n})\n.catch(error => {\n console.error('Error:', error);\n});`,
      language: 'JavaScript'
    },
    {
      id: 2,
      title: 'React useState Hook',
      description: 'An example of using the useState hook to manage state in a React component.',
      code: `import { useState } from 'react';\n\nfunction Counter() {\n const [count, setCount] = useState(0);\n\n return (\n <div>\n <p>You clicked {count} times</p>\n <button onClick={() => setCount(count + 1)}>\n Click me\n </button>\n </div>\n );\n}`,
      language: 'React'
    },
    {
      id: 3,
      title: 'Tailwind CSS Grid',
      description: 'An example of using Tailwind CSS to create a responsive grid layout.',
      code: `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">\n <div>Item 1</div>\n <div>Item 2</div>\n <div>Item 3</div>\n <div>Item 4</div>\n <div>Item 5</div>\n <div>Item 6</div>\n</div>`,
      language: 'CSS'
    },
    {
      id: 4,
      title: 'Python Flask API',
      description: 'A basic example of creating a RESTful API using Flask in Python.',
      code: `from flask import Flask, jsonify\n\napp = Flask(__name__)\n\n@app.route('/api/data', methods=['GET'])\ndef get_data():\n data = {\n 'message': 'Hello, World!',\n 'status': 200\n }\n return jsonify(data)\n\nif __name__ == '__main__':\n app.run(debug=True)`,
      language: 'Python'
    }
  ]


  
  
  return (
    <div className="App">
    <SearchContextProvider>
      <ModalContextProvider>
        <LoadingContextProvider>
        <main>
          <AuthChecker>
            {(authState, authStateSignUp, logout) => (
              <Routes>
                <Route path='/login' element={!authState.isAuthenticated ? <Login /> : <Navigate to={authState.isVerified ? '/snippets' : '/verify-otp'} replace />} />
                <Route path='/snippets' element={authState.isVerified ? <SnippetList logout ={logout} /> : <Navigate to="/login" replace />} />
                <Route path='/signup' element={!authState.isAuthenticated ? <Register authStateSignUp = {authStateSignUp}/> : <Navigate to={authState.isVerified ? "/snippets" : "/verify-otp"} replace />} />
                <Route 
                  path='/verify-otp' 
                  element={authState.isAuthenticated 
                    ? (!authState.isVerified 
                      ? <Otp /> 
                      : <Navigate to='/snippets' replace />) 
                    : <Navigate to="/signup" replace />} 
                />
                <Route path="*" element={<Navigate to={authState.isVerified ? "/snippets" : "/login"} />} />
              </Routes>
            )}
          </AuthChecker>
        </main>
        </LoadingContextProvider>
      </ModalContextProvider>
    </SearchContextProvider>
  </div>
  );
}

export default App;
