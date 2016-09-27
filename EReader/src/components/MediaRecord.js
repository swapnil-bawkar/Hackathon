import React, { Component } from 'react';

/* globals MediaRecorder */
class MediaRecord extends Component {
    constructor(props, context) {
        super(props, context);
        this.initializeMediaRecorder();

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);

    }

    initializeMediaRecorder() {
        const constraints = {
            audio: true,
            video: true
        };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(this.handleSuccess).catch(this.handleError);
    }

    handleSuccess(stream) {
        console.log('getUserMedia() got stream: ', stream);
        window.stream = stream;
        const options = {mimeTypes: 'video/webm;codecs=vp9'};
        this.mediaRecorder = new window.MediaRecorder(window.stream, options);

        let recordedChuncks = [];
        this.mediaRecorder.ondataavailable = function (event) {
            if(event.data.size > 0) {
                recordedChuncks.push(event.data);
            }
        }
    }


    handleError(error) {
        console.log('navigator.getUserMedia error: ', error);
    }

    start() {
        this.mediaRecorder.start();
    }

    stop() {
        this.mediaRecorder.stop();
    }

    render() {
        return (
            <div>
                <div onClick={this.start}>Start</div>
                <div onClick={this.stop}>Stop</div>
            </div>
        );
    }
}


export default MediaRecord;
