# Babyfoot Manager - Easilys

This project was realized within the framework of a technical test for the company Easilys, having for goal to set up a platform to manage games of table soccer.

## Summary

 1. Technical presentation of the subject
 2. Installation & Reproduction
 3. Path explanation
 4. Bonus
 5. Preview
 6. Video

## 1. Technical presentation of the subject
The goal was to create a management website for collaborative table soccer games

The features were :
- Be able to create a game 
- Be able to delete a game 
- Be able to end a game 
- In the list, differentiate the finished games from the others 
- Have a counter of the unfinished games 
- For each modification, creation or deletion, there must be a propagation in real time on the 
other connected clients 

The prerequisites were :
- Using NodeJS 
- PostgreSQL
- No ORM 
- Mac, Linux or Windows (in my case it will be Windows)
- Client-side JavaScript without frameworks or libraries (no jQuery, Vue, Angular, React) 
- Use of client-side libraries is allowed (but not required) for: 
- Date management 
- Websockets management 
- No identification to access the application 
- No page reloading on use, it's real time 

A suggested mockup was (the chat was a bonus if I had enough time) : 
![image](https://user-images.githubusercontent.com/44434162/127775285-b0628140-84ae-4fec-9604-32d4d50da130.png)

---- 
To be able to achieve the required goal I used POSTGRESQL to store the data of each part in a database. Node.JS was used as a bridge between the database and the user interface. 

To allow a user to be on the site without any reloading I used the Ajax protocol and the authorized library WebSocket.io

## 2. Installation & Reproduction
Steps to reproduce my realization : 
1. Clone this repository on your computer on a folder named Easilys
2. Install PostgreSQL version 12.7
3. Install Node.JS and in case of need every dependency (Carbone, Cors, Express, FS, HTTP, Nodemon, pg, socket.io)

Be careful : 
- My path is always based on the localhost (127.0.0.1) you might need to change it based on your configuration
- PostgreSQL : I connect via the port 5432 and with my own identifiers) (file "js/queries.js" (line 5 to 9)). 
- Socket.io : I use the port 3000 (file "js/game_manager.js" (line 1) and "node.js" (line 83))

4. Use the "pgsql_dump.sql" file at the root of this project to import the complete database structure
5. Go to localhost/easilys and everything should be fine !

The project must be included in an "Easilys" folder, an absolute path is used to generate reports (a new functionality I implemented !)
If you prefer to change the path to fit your needs it's located in the "node.js" file line 61 : 
```javascript
res.send('http://localhost/easilys/reports/table-'+ts+'.docx');
```

Once you are done with the installation you can enter the name of the players and create as much game as you want. 

The table shows the state of the game, date of beginning / ending, the score and name of each player.

The state of the game is "En cours" when you create it but you can stop a game by pressing the red square next to the "En cours" label.

You can increase or decrease the score by pressing the plus and minus signs.

Another possibility is to delete the game thanks to the trash icon next to it.

To export the table, you just have to click on the button under it, everything else will be automatic thanks to Carbone.io !

Finally, you can set up an username and chat with any user on the website, in real time, by writing what you want to say in the textarea and pressing the "plane" icon next to it.

## 3. Path explanation
- css -> style (front-end) related document
- documentation -> contains the subject
- js -> Game and chat management (game_manager.js & websoccket.js), plus interactions with the database (queries.js)
- node_modules -> Contains every node module I used
- pgsql_dump -> In order to replicate my database you will find a dump of the database structure, you can of course simply retrieve the table but the database name needs to be babyfoot_manager unless you modify it in queries.js
```sql 
CREATE TABLE public.babyfoot_games (
    id integer NOT NULL,
    "timestamp" time(0) without time zone DEFAULT now() NOT NULL,
    player1 text NOT NULL,
    score1 integer DEFAULT 0 NOT NULL,
    player2 text NOT NULL,
    score2 integer DEFAULT 0 NOT NULL,
    current_state text DEFAULT 'En cours'::text NOT NULL,
    timestamp_end time(0) without time zone,
    CONSTRAINT score_verification CHECK (((score1 > '-1'::integer) AND (score2 > '-1'::integer)))
);
```
- reports -> Reports generated with Carbone.io
- index.html -> The webpage
- node.js -> The heart of my work

## 4. Bonus
I decided to implement several new elements to innovate and go further in the subject. 
1. A fully responsive site, indeed given the growing presence of phones in our lives it seems unthinkable to make a site that does not adapt well on phone or tablet.
2. The possibility for each game to associate a time, when a game is created a start time is assigned, when it ends (you have to click on the red button next to "In progress" to stop a game) it takes an end time
3. Scores, each match associates two players who confront each other, from now on these players can add or remove points directly from the platform.
4. The chat that allows anyone on the site to choose their nickname or remain anonymous and talk to other users.
5. The design is completely different from the initial mockup, any idea is welcome as specified in the project subject. Moreover the table can "change its format" by displaying only the current games if the user wants or a disclaimer if there is no game at all in the database, the counter is in the bottom left corner of the table.
6. The last  - but not least - feature was to reuse Carbone.io, a tool developed by Easilys, in order to allow users to download a report containing the list of parts present in the table. I took the time to create a specific template to meet our needs.

## 5. Preview
![image](https://user-images.githubusercontent.com/44434162/127777651-932a05d4-255f-4f7e-9638-4f5accadb58c.png)

## 6. Video
If you can't install my realization on your configuration I have prepared a video to show the result of my technical test :
https://www.youtube.com/watch?v=4_s5rmn0sRM

[![Alt text](https://img.youtube.com/vi/4_s5rmn0sRM/0.jpg)](https://www.youtube.com/watch?v=4_s5rmn0sRM)
