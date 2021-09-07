import React from 'react'
import "./RecommendedVideos.css"
import VideoCard from './VideoCard'
import channelImages from './ImageArray';
import ImgSlider from './components/ImgSlider';
import styled from "styled-components";
import Viewers from './components/Viewers';


const Container = styled.main`
    color:white;
  position: relative;
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);
  &:after {
    background: url("/images/home-background.png") center center / cover
      no-repeat fixed;
    content: "";
    position: absolute;
    inset: 0px;
    opacity: 1;
    z-index: -1;
  }
`;

function RecommendedVideos() {
    
    //console.log("channel_Images",channelImages);
    return (
        <>
        
        <hr></hr>
        <div className="recommendedVideos">
                
            
            <h2>
                Recommended plots
            </h2>
            <div className="recommendedVideos__videos">
                {
                    channelImages.map(
                        item =>
                        <VideoCard 
                        
                        title={item.title}
                        views={item.views}
                        timestamp={item.timestamp}
                        channelImage={item.channelImage}
                        image={item.image}
                        channel={item.channel}
                        url={item.url}
                        >
                            
                        </VideoCard>)
                }
                    
            </div>
        

          
            
        </div>

        <Container>
            <ImgSlider/>
            <Viewers/>
        </Container>

        </>
        
    )
}

export default RecommendedVideos;
