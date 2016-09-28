/**
 * Created by iag on 9/28/16.
 */
import React, {Component} from 'react';
import videosvg from '../../../public/video_camera.svg';
import imagesvg from '../../../public/icon-image.svg';
import comment from '../../../public/icon-comment.svg';
import MediaRecorder from '../MediaRecord';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import './note-type-menu.css';

class NoteTypeMenu extends Component {

    state = {
        isShowVideo: false
    }

    showVideoType = () => {
        this.setState({isShowVideo: true})
    }

    handleClose = () => {
        this.props.handleClose();
        this.setState({isShowVideo: false})
    }

    render() {
        return (
            <div className="note-type-container">
                <img src={videosvg} alt="videosvg" className="videotype" onClick={this.showVideoType}/>
                <img src={imagesvg} alt="imagesvg" className="imagetype"/>
                <img src={comment} alt="comment" className="commentype"/>
                {
                    this.state.isShowVideo &&
                    <ModalContainer onClose={this.handleClose}>
                        <ModalDialog onClose={this.handleClose}>
                            <MediaRecorder></MediaRecorder>
                        </ModalDialog>
                    </ModalContainer>
                }
            </div>
        )
    }
}
;

export default NoteTypeMenu;