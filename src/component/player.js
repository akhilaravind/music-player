import React, { Component } from 'react';
import './styles.css';

class Player extends Component{
    constructor(props) {
        super(props);
        this.state = {
            playList: null,
            play: false,
            pause: false,
            stop: false,
            currentTime: null,
            songLength: null,
            activeSongIndex: 0
        }
        this.audio = new Audio();
    }
    songList = (e) => {
        let files = Object.keys(e.target.files).map(i => e.target.files[i]);
        this.setState({
            playList: files
        });
    }
    /**
     * Play clicked file
     */
    playFile = (file, index) =>{
        const currentTime = this.audio.currentTime;
        this.audio.pause();
        this.audio.src = URL.createObjectURL(file);
        this.setState({activeSongIndex: index})
        if(currentTime){
            this.audio.play();
        }
    }
   
    /**
     * Play song on clicking play button
     */
    playSong = () =>{
        const { activeSongIndex, playList, play } = this.state;
        if(this.audio.currentTime && play) {
            this.audio.pause();
            this.setState({ play : !play })
            return; 
        }else if(this.audio.currentTime && !play) {
            this.audio.play(this.audio.currentTime);
            this.setState({ play : !play })
            return;
        } else {
            this.audio.src = URL.createObjectURL(playList[activeSongIndex]);
            this.audio.play();
            this.setState({ play: !play })
        }
    }
    /**
     * Stop current playing song
     */
    stopSong = () =>{
        this.audio.pause()
        this.audio.currentTime = 0;
    }
    render(){
        const {playList, activeSongIndex} = this.state;
        return(
            <div>
                <div>
                    <h4>File list</h4>
                    <div className='col-md-6'>
                        <input type='file' multiple  onChange={(e) => this.songList(e)}/>
                    </div>
                    {
                     playList && playList.length > 0 &&
                     playList.map((i, index) => {
                         return (
                            <div key={index}>
                                <span 
                                    style={{'cursor':'pointer'}} 
                                    className={activeSongIndex == index ? 'active' : ''}
                                    onClick={()=> this.playFile(i, index)}
                                    >{i.name}</span>
                            </div>     
                         )
                     })   
                    }
                </div>
                <h4>Player Controls</h4>
                <div className='col-md-6'>
                    <button className='btn btn-success' role='play' onClick={() => this.playSong()}>Play</button>
                    <button className='btn btn-danger' role='stop' onClick={()=> this.stopSong()}>Stop</button>
                </div>
            </div>
        );
    }

}
export default Player;