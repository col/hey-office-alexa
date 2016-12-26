'use strict';
var Alexa = require('alexa-sdk');
const util = require('util');
const moment = require('moment');
var aws = require('aws-sdk');

var bookingModeHandlers = {

    'BookMeetingRoom': function() {
      console.log("Intent = " + util.inspect(this.event.request.intent, false, null));
      console.log("Slots = " + util.inspect(this.event.request.intent.slots, false, null));
      console.log("Attributes = " + util.inspect(this.attributes, false, null));

      this.attributes['date'] = getSlotOrAttributeValue(this, 'date');
      this.attributes['time'] = getSlotOrAttributeValue(this, 'time');
      this.attributes['room'] = getSlotOrAttributeValue(this, 'room');
      this.emit('_BookMeetingRoom');
    },

    '_BookMeetingRoom': function() {
      var date = this.attributes['date'];
      var time = this.attributes['time'];
      var room = this.attributes['room'];

      console.log('Date = ' + date);
      console.log('Time = ' + time);
      console.log('Room = ' + room);

      if (date && time && room) {
        createMeeting(date, time, room, (error, data) => {
          if (error) {
            console.log('error', error);
            this.emit(':tell', 'Failed to create the booking.');
          }
          if(data.Payload){
           console.log(util.inspect(data.Payload));
           this.emit(':tell', "I've booked the "+room+" room for you at "+time+".");
          }
        });
      } else if (!room) {
        this.emit(':ask', 'What meeting room would you like?');
      } else if (date && !time) {
        this.emit(':ask', 'What time do you need the room?');
      } else if (!date && time) {
        this.emit(':ask', 'On what day do you need the room?');
      } else {
        this.emit(':ask', 'When do you need the meeting room?');
      }
    },

    'AMAZON.StopIntent': function() {
      this.handler.state = '';
      this.emit('Goodbye');
    },

    'AMAZON.CancelIntent': function() {
      this.handler.state = '';
      this.emit('Goodbye');
    },

    'SessionEndedRequest': function () {
      this.handler.state = '';
      console.log('session ended!');
    },

    'Unhandled': function() {
      this.emit(':ask', 'Sorry, I didn\'t get that. Please try again.', 'Please try again.');
    },

    'Goodbye': function() {
      this.emit(':tell', 'ok, goodbye');
    }

};

function createMeeting(date, time, room, callback) {
  var lambda = new aws.Lambda({
    region: 'ap-southeast-1'
  });

  var startMoment = moment(date+" "+time+"+08:00");
  var start = startMoment.format("YYYY-MM-DD HH:mmZ");
  var end = startMoment.add(1, 'hour').format("YYYY-MM-DD HH:mmZ");
  console.log("Start = " + start);
  console.log("End = " + end);
  lambda.invoke({
    FunctionName: 'hey-office-meetings-dev-create',
    Payload: JSON.stringify({body: JSON.stringify({
      title: "Alexa Test",
      room: room,
      start: start,
      end: end
    })})
  }, callback);
}

function getSlotOrAttributeValue(self, name) {
  return self.event.request.intent.slots[name].value || self.attributes[name];
}

module.exports.heyOffice = (event, context, callback) => {
  var alexa = Alexa.handler(event, context);
  alexa.appId = process.env['ALEXA_APP_ID'];
  alexa.registerHandlers(bookingModeHandlers);
  alexa.execute();
};
