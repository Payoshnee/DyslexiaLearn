import React from "react";
import "./BackgroundVideo.css";

const BackgroundVideo = () => {
  const videoSrc = `${process.env.PUBLIC_URL}/videos/robot-friendship-background.mp4`;

  return (
    <div className="video-background-container">
      <video
        className="video-background"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="video-overlay" />
    </div>
  );
};

export default BackgroundVideo;
