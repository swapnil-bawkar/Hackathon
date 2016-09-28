import React, {Component} from 'react';
import './App.css';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import MediaRecorder from './components/MediaRecord';
import shortid from 'shortid';
import left from '../public/arrow-left.svg';
import right from '../public/arrow-right.svg';
import VideoNote from './components/video-note';

/* globals Jigsaw */

let config = {
    vbid: "9781285840802",
    el: "book",
    page: "recent",
    brand: "vitalsource",
    zoomDisabled: false,
    swipeDisabled: false,
    highlightsEnabled: false
};

class App extends Component {
    state = {
        isShowingModal: false,
        notes: [],
        isShowRecordedNote: false,
        blob: null
    }

    componentDidMount() {
        this.viewer = Jigsaw.createPageViewer(config, (data) => {
            if (data.code === 200) {
                console.log(data);
                this.viewer.bind('book:selectionWithPosition', (event, data) => {
                    this.position = data;
                    this.setState({isShowingModal: true});
                });
                this.viewer.bind('highlight:click', (event, data) => {
                    this.handleClick(data.syncId);
                });
            }
        });
    }

    handleClick(syncId) {
        const notes = this.state.notes;
        notes.filter((note) => {
            if(note.highlight.syncId === syncId) {
                this.setState({
                    isShowRecordedNote: true,
                    blob: note.recordedBlob
                });
                return note;
            }
        });
    }

    handleClose = () => this.setState({isShowingModal: false})

    handleVideoNoteClose = () => this.setState({isShowRecordedNote: false})
    
    save = (recordedBlob) => {
        const noteId = shortid.generate();
        this.viewer.Book.highlightCurrentSelection({markerId: 'T4UA3RTNATGPHJRCSME5'}, (event) => {
            const highlight = event.data.highlight;
            const notes = this.state.notes;
            notes.push({
                noteId,
                highlight,
                position: this.position,
                recordedBlob
            });
            this.setState({
                notes: notes
            });
        });
    }
    goToNextPage = () => {
        this.viewer.Book.hasNextPage((result) => {
            if(result.data) {
                this.viewer.Book.goToNextPage((data) => {
                    console.log(data);
                });
            } else {
                alert('This is last page');
            }
        });

    }
    goToPrevPage = ()=> {
        this.viewer.Book.hasPreviousPage((result) => {
            if(result.data) {
                this.viewer.Book.goToPreviousPage((data) => {
                    console.log(data);
                });
            } else {
                alert('This is first page');
            }
        });
    }

    render() {
        return <div id="book-container" >
                <div id="book" ref={(c)=> this.book = c}></div>
                {
                    this.state.isShowRecordedNote &&
                    <ModalContainer onClose={this.handleVideoNoteClose}>
                        <ModalDialog onClose={this.handleVideoNoteClose}>
                            <h1>Dialog Content</h1>
                            <VideoNote blob={this.state.blob}></VideoNote>
                        </ModalDialog>
                    </ModalContainer>
                }
            <div className="footer">
                <img src={left} onClick={() => this.goToPrevPage()}/>
                <img src={right} onClick={() => this.goToNextPage()} className="right"/>
            </div>
            </div>;
    }
}

export default App;
