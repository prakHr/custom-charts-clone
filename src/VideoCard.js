import React,{useState} from 'react';
import "./VideoCard.css";
import  Avatar  from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
function VideoCard({image,title,channel,views,timestamp,channelImage,url}) {
    const [trailerUrl, setTrailerUrl] = useState(""); //store trailer url
    function handleClick(movie){
        console.log("movie",movie);
        if(trailerUrl)
        {
            setTrailerUrl("");
        }
        else{
            setTrailerUrl(movie);
        }
    };
    return (
        <div className="videoCard">
            {/* <Link to={`/search/${title}`}>
                
            </Link> */}
            <img className="videoCard__thumbnail" src={image} alt="" onClick={()=>{handleClick(url)}}/>
            {trailerUrl && <iframe src={trailerUrl} title="De" style={{height:'390',width:'100%'}}/>}
            <div className="videoCard__info">
                <Avatar className="videoCard__avatar" alt={channel} src={channelImage}></Avatar>
                <div className="videoCard__text">
                    <h4>{title}</h4>
                    <p>{channel}</p>
                    <p>
                        {views} - {timestamp}
                    </p>
                </div>
                
            </div>
            
        </div>
    )
}

export default VideoCard
