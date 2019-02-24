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
            songDuration: 0,
            activeSongIndex: 0,
            volume: 30, 
            files : undefined
        }
        this.audio = new Audio();
        this.audio.volume = this.state.volume / 100;
        this.audio.addEventListener('loadedmetadata',()=> {
            const that = this;
            this.setState({songDuration: that.audio.duration});
        });
        this.audio.addEventListener('timeupdate', ()=>{
            this.setState({currentTime : this.audio.currentTime});
            if(this.audio.currentTime === this.state.songDuration){
                this.audio.pause();
                if( this.state.activeSongIndex != this.state.playList.length -1 ){
                    this.changeTrack('next');
                }
            }
        })
    }

    /**
    * Create song list on file upload change
     */
    songList = (e) => {
        if(!e.target.files.length) return;
        let files = Object.keys(e.target.files).map(i => e.target.files[i]);
        let {playList} = {...this.state.playList}
        playList = playList ? {...playList, ...files}: files;
        this.setState({
            playList,
            file : e.target.files
        });
        this.audio.pause();
        this.audio.currentTime = 0;
    }
    /**
     * Play clicked file
     */
    playFile = (file, index, event) =>{
        event.stopPropagation();
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
        if(!playList || !playList.length) return false;
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
        this.setState({play:false})
    }

    /**
     * Change track Next and Previous. 
     * @param { next, prev}
     * switch track with param value.
     */
    changeTrack= (selection) => {
        if(!this.state.play) return;
        let {activeSongIndex, playList} = {...this.state}
        var index;
        switch(selection){
            case 'next':
                index = activeSongIndex === playList.length -1 ? 0 : activeSongIndex +1;
                break;
            case 'prev':
                index = activeSongIndex === 0 ? playList.length -1 : activeSongIndex -1;
                break;
            }
            this.audio.src = URL.createObjectURL(playList[index])
            this.setState({activeSongIndex : index})
            this.audio.play();
    }
    /**
     * Update volume
     * @param { target value }
     */
    updateVolume = (event) =>{
       const volume = event.target.value;
       this.audio.volume = volume / 100;
       this.setState({volume});
    }
    /**
     * Seekbar, change audio using range seekbar
     * @param { Event }
     */
    seekBar = (e) =>{
        this.setState({ currentTime : e.target.value });
        this.audio.currentTime = e.target.value;
    }

    /**
    * File drop handler
     */
  
     fileDropHandler = (event)=>{
        event.preventDefault();
        let files = Object.keys(event.dataTransfer.files).map(i => event.dataTransfer.files[i]);
        let {playList} = {...this.state.playList}
        playList = files;
        this.setState({
            playList,
            file : event.dataTransfer.files
        });
        this.audio.pause();
        this.audio.currentTime = 0;
        event.dataTransfer.clearData()
     }
     /**
      * File drop events; event is prevented to stop opening the file.
      */
     dragOver = (e)=>{
         e.preventDefault();
         e.stopPropagation();
     }
     /**
      * Browse file event on clicking div
      */
     fileBrowse = ()=>{
        this.refs.inputLabel.click();
     }
    render(){
        const {playList, activeSongIndex, volume, songDuration, currentTime, play} = this.state;
        return(
            <div onDragOver ={(e) => this.dragOver(e)} onDrop={(e) => this.fileDropHandler(e)} onDragLeave={(e) => e.preventDefault()}>
            <div className='col-md-12 col-sm-6'>
                <div className='col-md-5 col-sm-12 player_control'>
                    <div className='col-md-8 col-sm-12 album_cover'>
                        <div className='volume-label'>
                            <i className="glyphicon glyphicon-volume-up"></i> 
                            <span>{volume}</span>
                        </div>
                        <div className='col-md-6 volume-control'>
                            <input type='range' id='volume' steps='1' value={volume} onChange={(e) => this.updateVolume(e)} min='0' max='100' />
                        </div>
                    </div>
                    <div className='col-md-12 col-sm-12 track'>
                        <input 
                            type='range' 
                            value={currentTime ? currentTime : 0} 
                            min='0' 
                            max={songDuration}
                            steps='0.01'
                            onChange={(e) => this.seekBar(e)}
                        />
                    </div>
                    <div className='col-md-12 col-sm-12 audio-control'>
                        {
                            play &&
                            <span className='glyphicon glyphicon-pause' onClick={() => this.playSong()}></span>
                        }
                        {
                            !play &&
                            <span className='glyphicon glyphicon-play' onClick={() => this.playSong()}></span>
                        }
                            <span className='glyphicon glyphicon-stop' onClick={()=> this.stopSong()}></span>
                            <span className='glyphicon glyphicon-step-backward' onClick={() => this.changeTrack('prev')}></span>
                            <span className='glyphicon glyphicon-step-forward' onClick={() => this.changeTrack('next')}></span>
                    </div>
                </div>
                {/* File listings */}
                <div className='col-md-4 col-sm-12 drag_drop' onClick={()=> this.fileBrowse()}>
                    <div className='col-md-12'>
                        <label htmlFor='inputFile' ref='inputLabel'>Drag and drop or click to add songs</label>
                        <input type='file'  accept='audio/mp3' id='inputFile' style={{'display':'none'}} multiple  onChange={(e) => this.songList(e)}/>
                    </div>
                    <table>
                        <tbody>
                    {
                        playList && playList.length > 0 &&
                        playList.map((i, index) => {
                            return (
                                <tr key={index} onClick={(e)=> this.playFile(i, index, e)} className={activeSongIndex === index ? 'active' : ''}>
                                    <td width='50px'>{index +1}</td>
                                    <td>{i.name.replace(/\.([^\.]*)$/,'')}</td>
                                </tr>
                         )
                        })   
                    }
                    </tbody>
                    </table>
                </div>
            </div>
            </div>
        );
    }

}
export default Player;