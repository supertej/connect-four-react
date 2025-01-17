import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const random = require('random')


function Hole(props){
    return <div className="Hole"><div className={props.value}></div></div>
}

function Slat(props){
        return <div className="Slat" onClick={() => props.handleClick()}>
            {[...Array(props.holes.length)].map((x, j) => 
                <Hole key={j} value={props.holes[j]}></Hole>)}
            </div>
 }

class Board extends Component {

    constructor() {
        super();
        var randValue = random.int(0, 1)
        var AI = ''
        if (randValue === 1) {
             AI = 'Red'
        }
        else{
             AI = 'Blue'
        }

        this.state = {
            boardState: new Array(7).fill(new Array(6).fill(null)),
            playerTurn: 'Red',
            gameMode: '',
            gameSelected: false,
            winner: '', 
            AITurn: 'Blue'
        }
        
    }

    selectedGame(mode){
        this.setState({
             gameMode: mode,
             gameSelected: true, 
             boardState: new Array(7).fill(new Array(6).fill(null)), 
             winner: '',
             playerTurn: 'Red'
        })
    }

    makeMove(slatID){
        const boardCopy = this.state.boardState.map(function(arr) {
            return arr.slice();
        });
        if( boardCopy[slatID].indexOf(null) !== -1 ){
            let newSlat = boardCopy[slatID].reverse()
            newSlat[newSlat.indexOf(null)] = this.state.playerTurn
            newSlat.reverse()
            this.setState({
                playerTurn: (this.state.playerTurn === 'Red') ? 'Blue' : 'Red',
                boardState: boardCopy
            })
            console.log('move made')
        }
    }

    /*Only make moves if winner doesn't exist*/
    handleClick(slatID) {
        // only handle click if it is your turn otherwise do not do anything ###
        if(this.state.winner === ''){
            this.makeMove(slatID)
        }
    }

    endGame() {
        this.setState({
            winner: '',
            boardState: new Array(7).fill(new Array(6).fill(null)),
            gameSelected: false
        })

    }

    makeAIMove() {
        let validMove = -1;
        while(validMove === -1){
            let slat = Math.floor((Math.random() * 7))
            if(this.state.boardState[slat].indexOf(null) !== -1){
                validMove = slat
            }
            else{
                validMove = -1
            }
        }
        if (this.state.winner === ''){
            this.makeMove(validMove)
        }
    }

    /*check the winner and make AI move IF game is in AI mode*/
    componentDidUpdate(){
        let winner = checkWinner(this.state.boardState)
        if(this.state.winner !== winner){
            this.setState({winner: winner})
        } 
        else {
            if(this.state.gameMode === 'ai' && this.state.playerTurn === 'Red'){
                this.makeAIMove()
            }
        }
    }
    



    render(){

        /*If a winner exists display the name*/
        let winnerMessageStyle
        if(this.state.winner !== ""){
            winnerMessageStyle = "winnerMessage appear"
        }else {
            winnerMessageStyle = "winnerMessage"
        }

        /*Contruct slats allocating column from board*/
        let slats = [...Array(this.state.boardState.length)].map((x, i) => 
            <Slat 
                    key={i}
                    holes={this.state.boardState[i]}
                    handleClick={() => this.handleClick(i)}
            ></Slat>
        )

        return (
            <div>
                {this.state.gameSelected &&
                    <div className="Board">
                        {slats}
                    </div>
                }
                <div className={winnerMessageStyle}>{this.state.winner}</div>
                {(!this.state.gameSelected ) &&
                    <div>
                        <button onClick={() => this.selectedGame('ai')}>Play AI</button>
                    </div>
                }

                {( this.state.winner !== '') &&
                    <div>
                        <button onClick={() => this.endGame()}>New Game</button>
                    </div>
                }
            </div>
        )
    }
}


class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>AI SUMMIT CONNECT 4 CHALLENGE</h2>
                </div>
                <div className="Game">
                    <Board></Board>
                </div>
            </div>
        );
    }
}

function checkLine(a,b,c,d) {
        return ((a !== null) && (a === b) && (a === c) && (a === d));
}
function checkDraw(bs) {
    for (let c = 0 ; c < 7; c ++)
        for (let r = 0; r < 6 ; r++)
            if (bs[c][r] === null)
                return false
    return true
}
function checkWinner(bs) {
        for (let c = 0 ; c < 7; c ++)
            for (let r = 0; r < 6 ; r++)

        for (let c = 0; c < 7; c++)
                for (let r = 0; r < 4; r++)
                        if (checkLine(bs[c][r], bs[c][r+1], bs[c][r+2], bs[c][r+3]))
                                return bs[c][r] + ' wins!'

        for (let r = 0; r < 6; r++)
                 for (let c = 0; c < 4; c++)
                         if (checkLine(bs[c][r], bs[c+1][r], bs[c+2][r], bs[c+3][r]))
                                 return bs[c][r] + ' wins!'

        for (let r = 0; r < 3; r++)
                 for (let c = 0; c < 4; c++)
                         if (checkLine(bs[c][r], bs[c+1][r+1], bs[c+2][r+2], bs[c+3][r+3]))
                                 return bs[c][r] + ' wins!'

        for (let r = 0; r < 3; r++)
                 for (let c = 3; c < 7; c++)
                         if (checkLine(bs[c][r], bs[c-1][r+1], bs[c-2][r+2], bs[c-3][r+3]))
                                 return bs[c][r] + ' wins!'

        if (checkDraw(bs))
            return "Match Draw"

        return "";
}

export default App;
