import React, {Component} from 'react';
import './App.css';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import MediaRecorder from './components/MediaRecord';
import shortid from 'shortid';

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
        notes: []
    }

    componentDidMount() {
        this.viewer = Jigsaw.createPageViewer(config, (data) => {
            if (data.code === 200) {
                console.log(data);
                this.viewer.bind('book:selectionWithPosition', (event, data) => {
                    console.log(data);
                    this.setState({isShowingModal: true});
                });
                this.viewer.bind('book:click', (event, data) => {
                    console.log(data);
                });
            }
        });
    }

    handleClose = () => this.setState({isShowingModal: false})
    
    save = (recordedBlob) => {
        const noteId = shortid.generate();
        this.viewer.Book.highlightCurrentSelection({markerId: 'T4UA3RTNATGPHJRCSME5'}, (event) => {
            const highlight = event.data.highlight;
            const notes = this.state.notes;
            this.setState({
                notes: notes.push({
                    noteId,
                    highlight,
                    recordedBlob
                })
            });
        });
    }

    render() {
        return <div id="book-container" >
                <div id="book"></div>
            {
                this.state.isShowingModal &&
                <ModalContainer onClose={this.handleClose}>
                    <ModalDialog onClose={this.handleClose}>
                        <h1>Dialog Content</h1>
                        <MediaRecorder onSave={this.save}></MediaRecorder>
                    </ModalDialog>
                </ModalContainer>
            }
        </div>;
    }
}

export default App;
