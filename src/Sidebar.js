import React from 'react';
import './Sidebar.css';
import SidebarRow from './SidebarRow';
import HomeIcon from "@material-ui/icons/Home";
import TrendingUpOutlined from "@material-ui/icons/TrendingUpOutlined";
import { Link } from 'react-router-dom';
import { useStateValue } from './StateProvider';
function Sidebar() {
    const [{user},dispatch]=useStateValue();
    return (
        <div className="sidebar">
           
            <SidebarRow selected Icon={HomeIcon} title="Prakhar's Analytics"/>
            {user && (<Link to="/charts">
                <SidebarRow Icon={TrendingUpOutlined}  title="Trending Charts"/>
            </Link>)}
            <hr/>
            
            
        </div>
    )
}

export default Sidebar
