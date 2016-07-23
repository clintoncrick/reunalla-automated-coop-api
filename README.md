
# Reunalla Automated Coop API

The backend for our initial attempt at automating a chicken coop. Meant as either a standalone installation or to be paired with a frontend dashboard. Written for [Node.js](https://nodejs.org/), currently being ran on a [Raspberry Pi 2 Model B](https://www.raspberrypi.org/products/raspberry-pi-2-model-b/).


## Usage

To start:  
 `sudo node server.js`

To access general status:  
 http://localhost:8080/api/coop

To access individual item statuses:  
 http://localhost:8080/api/coop/items/:ITEM_NAME

To call individual item actions:  
 http://localhost:8080/api/coop/items/:ITEM_NAME/:ACTION

To get an array of previous statuses:  
 http://localhost:8080/api/coop/items/monitor/getItems


## Requirements

### Mongo
The [Monitor](monitor.js) currently uses [mongoDB](https://www.mongodb.com/) for its storage. If you're using the Monitor moddule, you'll need to have mongoDB installed.

### Camera Streaming
I followed these [instructions on Raspberry Pi streaming](http://blog.cudmore.io/post/2015/03/15/Installing-mjpg-streamer-on-a-raspberry-pi/) to install `mjpg-stream`. I'm not completely sold on `mjpg-streamer` as a solution, and may move to a similar style of solution being incorporated in the front end.


## Todo

* Option based initialization
* Configuration file initialization
 * Desperately in need of a configuration file initialization. Current setup is lacking, essentially hardcoded