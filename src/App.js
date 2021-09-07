import React,{useEffect} from 'react';
// import Home from './Home';
import './App.css';
//import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import Login from './Login';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';

import './App.css';
import Header from './Header';
import RecommendedVideos from './RecommendedVideos';
import Sidebar from './Sidebar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Charts from './Charts';
function App() {
  const [{user},dispatch]=useStateValue();
  useEffect(() => {
    //will only run with once when the app component loads...
    auth.onAuthStateChanged(authUser => {
      // console.log('The USER IS >>> ',authUser);
      if(authUser){
        // the user just logged in / the user was logged in
        dispatch({
          type:'SET_USER',
          user:authUser
        })
      }
      else {
        // the user is logged out
        dispatch({
          type:'SET_USER',
          user:null
        })

      }
    })
  }, [user]);
  return (
    // BEM class naming conventions
    <div className="app">
      <Router>
      <Header/>
        <Switch>
          <Route exact path="/login">
            <Login/>
          </Route>
        {user && (<Route exact path="/charts">
          <div className="app_charts_page">
            <Charts/>
          </div>
          </Route>)}
          <Route exact path="/">
            
            <div className="app__page">
              <Sidebar/>
              <RecommendedVideos/>
            </div>
      

            
          </Route>
        </Switch>
      </Router>       
        {/* 
            Think in terms of components
            1.Header making it sticky with z-index for transparency
            2.Sidebar
            3.Recommended videos
        */}
      
      {/* <Header/>
      <div className="app__page">
        <Sidebar/>
        <RecommendedVideos/>
      </div> */}
      

      
    </div>
  );
}

export default App;