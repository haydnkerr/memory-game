require('dotenv').config()

const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const Filter = require('bad-words');
const port = process.env.PORT || 3000

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);



app.use(express.static(path.resolve("")));

app.use(express.json());

let randomArr = []
let lobbyArr = []
let playerArray = []
let playerOneArray = []
let playerTwoArray = []

app.get('/', (req, res) => {
    return res.sendFile("index.html")
})

app.post('/postScore', async (req, res) => {
    const { playerName, time, totalMoves, gridSize } = req.body;

    try {
        let tableName;
        if (gridSize == 6) {
            tableName = 'highscores_2x3';
        } else if (gridSize == 12) {
            tableName = 'highscores_3x4';
        } else if (gridSize == 16) {
            tableName = 'highscores_4x4';
        } else if (gridSize == 20) {
            tableName = 'highscores_4x5';
        }
        var Filter = require('bad-words'),
    filter = new Filter();

    cleanWord = filter.clean(playerName)
 

        const { data, error } = await supabase.from(tableName).insert({
            player_name: cleanWord,
            score: time,
            moves: totalMoves
        });

        if (error) {
            throw error;
        }

        // Send success response
        res.status(200).json({ message: 'Score updated successfully' });
    } catch (error) {
        console.error('Error sending data to database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/leaderboard', async (req, res) => {
    const { gridSize } = req.query;

    try {
        let tableName;
        if (gridSize == 4) {
            tableName = 'highscores_2x2';
        } else if (gridSize == 6) {
            tableName = 'highscores_3x2';
        } else if (gridSize == 16) {
            tableName = 'highscores_4x4';
        } else if (gridSize == 20) {
            tableName = 'highscores_5x4';
        }

        const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('score', { ascending: true })
        .order('moves', { ascending: true })
        .limit(8);
    

        if (error) {
            throw error;
        }

        console.log(data[0].player_name)

        // Send data as response
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/', (req, res) => {
    return res.sendFile("index.html")
})

server.listen(3000, () => {
    console.log("port connected to 3000")
})

function generateLobbyCode() {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}