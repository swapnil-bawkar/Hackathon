import React, {Component} from 'react';
import './App.css';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import MediaRecorder from './components/MediaRecord';

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
        isShowingModal: false
    }

    componentDidMount() {
        this.viewer = Jigsaw.createPageViewer(config, (data) => {
            if (data.code === 200) {
                console.log(data);
                this.viewer.bind('book:selectionWithPosition', (event) => {
                    this.setState({isShowingModal: true});
                    this.viewer.Book.highlightCurrentSelection({markerId: 'sample'}, (highlighter) => {
                        console.log(highlighter);
                    });
                });
            }
        });
    }

    handleClose = () => this.setState({isShowingModal: false})

    render() {
        return <div id="book-container" >
                <div id="book"></div>
            {
                this.state.isShowingModal &&
                <ModalContainer onClose={this.handleClose}>
                    <ModalDialog onClose={this.handleClose}>
                        <h1>Dialog Content</h1>
                        <MediaRecorder></MediaRecorder>
                    </ModalDialog>
                </ModalContainer>
            }
        </div>;
    }
}

export default App;
