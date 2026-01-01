import React, { FC, useEffect, useState } from "react";
import axios from "axios";
type Props = {
    videoUrl: string;
    title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
    console.log("video", videoUrl);
    return (
        <div style={{ paddingTop: "41%", position: "relative" }}>
            (
            <iframe
                src={videoUrl}
                style={{
                    border: 0,
                    width: "90%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
                allowFullScreen={true}
                allow="encrypted-media"
            ></iframe>
  
            )
        </div>
    );
};

export default CoursePlayer;
