import React, { Component } from 'react';

/* globals MediaRecorder */
class MediaRecord extends Component {
    constructor(props, context) {
        super(props, context);
        this.initializeMediaRecorder();
        this.state = {
            isShowingGum: true,
            isShowingRecorded: false
        };
        this.toggleRecording = this.toggleRecording.bind(this);
        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
    }

    initializeMediaRecorder() {
        const constraints = {
            audio: true,
            video: true
        };
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => this.handleSuccess(stream)).catch(this.handleError);
    }

    handleSuccess(stream) {
        console.log('getUserMedia() got stream: ', stream);
        window.stream = stream;
        if (window.URL) {
            this.gumVideo.src = window.URL.createObjectURL(stream);
        } else {
            this.gumVideo.src = stream;
        }
    }

    handleDataAvailable(event) {
        if(event.data.size > 0) {
            this.recordedBlobs.push(event.data);
        }
    }

    handleError(error) {
        console.log('navigator.getUserMedia error: ', error);
    }

    toggleRecording() {
        if (this.recordButton.textContent === 'Start Recording') {
            this.startRecording();
        } else {
            this.stopRecording();
            this.recordButton.textContent = 'Start Recording';
            this.playButton.disabled = false;
            this.setState({




                
                isShowingGum: false,
                isShowingRecorded: true
            });
        }
    }

    stopRecording() {
        this.mediaRecorder.stop();
        console.log('Recorded Blobs: ', this.recordedBlobs);
    }

    startRecording() {
        this.recordedBlobs = [];
        var options = {mimeType: 'video/webm;codecs=vp9'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + ' is not Supported');
            options = {mimeType: 'video/webm;codecs=vp8'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.log(options.mimeType + ' is not Supported');
                options = {mimeType: 'video/webm'};
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.log(options.mimeType + ' is not Supported');
                    options = {mimeType: ''};
                }
            }
        }
        try {
            this.mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder: ' + e);
            alert('Exception while creating MediaRecorder: '
                + e + '. mimeType: ' + options.mimeType);
            return;
        }
        console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);
        this.recordButton.textContent = 'Stop Recording';
        this.playButton.disabled = true;
        this.mediaRecorder.onstop = this.handleStop;
        this.mediaRecorder.ondataavailable = (event) => {
            this.handleDataAvailable(event);
        };
        this.mediaRecorder.start(10); // collect 10ms of data
        console.log('MediaRecorder started', this.mediaRecorder);
    }

    play() {
        var superBuffer = new Blob(this.recordedBlobs, {type: 'video/webm'});
        this.recordedVideo.src = window.URL.createObjectURL(superBuffer);
    }

    stop() {
        this.mediaRecorder.stop();
    }

    save = () => {
        this.props.onSave(this.recordedBlobs);
    }

    render() {
        return (
            <div>
                {
                    this.state.isShowingGum &&
                    <video id="gum" ref={(c)=> this.gumVideo = c} autoPlay muted></video>
                }
                {
                    this.state.isShowingRecorded &&
                    <video id="recorded" ref={(c)=> this.recordedVideo = c} autoPlay loop controls></video>
                }
                <div>
                    <button id="record" ref={(c)=> this.recordButton = c} onClick={this.toggleRecording}>Start Recording</button>
                    <button id="play" ref={(c)=> this.playButton = c} onClick={this.play}>Play</button>
                    <button onClick={this.save}>Save</button>
                </div>
            </div>
        );
    }
}


export default MediaRecord;
