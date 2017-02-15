/**
 * Created by iag on 9/28/16.
 */
import React from 'react';

const VideoNote = ({blob}) => {

    var superBuffer = new Blob(blob, {type: 'video/webm'});
    const src = window.URL.createObjectURL(superBuffer);
    
    return (
        <div>
            <video loop controls src={src}></video>
        </div>
    );
};

export default VideoNote;