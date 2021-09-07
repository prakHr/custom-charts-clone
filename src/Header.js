import React from 'react';
import './Header.css';
import  MenuIcon from '@material-ui/icons/Menu';
// import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import  Avatar  from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import { auth } from './firebase';
function Header() {
    const [{user},dispatch]=useStateValue();
    const handleAuthentication=()=>{
        if(user){
            auth.signOut();
        }
    }
    return (
        <div className="header">
            <div className="header__left">
                <MenuIcon/>
                <Link to="/">
                    <img className="header__logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJpEyb-G5CLXIBL17DG1Y-bwbOdLTkVOLZ0g&usqp=CAU" alt=""/>
            
                </Link>
                
            </div>
            <div className="header__input">
                {/* <input onChange={e=>setInputSearch(e.target.value)} value={InputSearch} placeholder="Search" type="text"/>
                <Link to={`/search/${InputSearch}`}>
                    <SearchIcon className="header__inputButton"/>
            
                </Link> */}
                
            </div>
            <div className="header__icons">
                 {/* <ExitToAppIcon className="header__icon"/> */}
                {/*<AppsIcon className="header__icon"/>
                <NotificationsIcon className="header__icon"/> */}
                <Avatar alt="Prakhar Gandhi" src="https://i1.rgstatic.net/ii/profile.image/813466872979458-1570957024399_Q512/Prakhar-Gandhi.jpg"/>
                
            <div className="header__nav">
                <Link to={!user && '/login'}>
                    <div onClick={handleAuthentication} className='header__option'>
                        <span className='header__optionLineOne'>
                            Hello {!user ? 'Guest':user.email}
                        </span>
                        <br/>
                        <span className='header__optionLineTwo'>
                            {user ? 'Sign Out':'Sign In'}
                        </span>
                    </div>
                </Link>
                </div>
            </div>
        </div>
    )
}

export default Header
