from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin
import logging
import requests
import os
import json
from os import path
app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))

app.config['SQLALCHEMY_DATABASE_URI'] =\
        'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Lyric(db.Model):
    words = db.Column(db.Text(), nullable=False, primary_key=False)
    startTime = db.Column(db.Integer)
    song_id = db.Column(db.String(22), db.ForeignKey('song.trackID'))
    uniqueID = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False,)

    def serialize(self):
        return {
            "words": self.words,
            "startTime": self.startTime,
        }

class Song(db.Model):
    trackID = db.Column(db.String(22), primary_key=True)
    trackColor = db.Column(db.String(10), nullable=False)
    lyrics = db.relationship('Lyric', backref='song', cascade='all, delete-orphan')

    def serialize(self):
        return {
            "trackID": self.trackID,
            "trackColor": self.trackColor,
            "lyrics": [lyric.serialize() for lyric in self.lyrics] 
        }   

@app.route("/data", methods=['POST'])
@cross_origin()
def postLyrics():
    data = request.get_json()
    print(data)
    songLines = data['lyrics']['lines']
    trackColor = data['colors']['background']
    id = data['0']['trackID']
    song = Song(trackID=id, trackColor=trackColor)

    for line in songLines:
        dataWords = line['words']
        dataStartTime = line['startTimeMs']
        lyric = Lyric(words=dataWords, startTime=dataStartTime, song_id=id)
        song.lyrics.append(lyric)
    print(song)
    db.session.add(song)
    db.session.commit()       

    return "Data Sent"

@app.route("/data", methods=['GET'])
@cross_origin()
def getLyrics():
    song_id = request.args.get("songNum")
    app.logger.info(song_id)
    allSongs = Song.query.all()
    currSong = None
    for song in allSongs:
        if song.trackID == song_id:
            currSong = song
            return jsonify(currSong.serialize())


@app.route("/songID", methods=['POST'])
@cross_origin()
def postID():
    data = request.get_json()
    app.logger.info(data)
    global songID, match
    match = False
    songID = data['songID']
    allSongs = Song.query.all()
    for song in allSongs:
        if song.trackID == songID:
            match = True
    return jsonify("Success")


@app.route("/songID", methods=['GET'])
@cross_origin()
def getID():
    data = {
        "SongID": songID,
        'match': match
    }
    json = jsonify(data)
    print(json)
    return json

@app.route("/error", methods=['POST'])
@cross_origin()
def postError():
    data = request.get_data(as_text=True)
    app.logger.info(data)
    return "error"

if __name__ == "__main__":
    app.run(debug=True)
