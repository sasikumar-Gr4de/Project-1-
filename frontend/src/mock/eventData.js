export const player_events = {
  Passing: {
    "Shot Pass": {
      Unsuccessful: [],
      "Simple Pass": [],
      "Key Pass": [
        {
          position_x: 35.22,
          position_y: 42.71,
          position_x_end: 25.37,
          position_y_end: 15.95,
        },
      ],
      Assist: [],
    },
    "Long Pass": {
      Unsuccessful: [
        {
          position_x: 64.78,
          position_y: 57.29,
          position_x_end: 25.37,
          position_y_end: 28.46,
        },
        {
          position_x: 94.73,
          position_y: 42.71,
          position_x_end: 74.63,
          position_y_end: 5.32,
        },
        {
          position_x: 84.5,
          position_y: 66.0,
          position_x_end: 54.93,
          position_y_end: 66.0,
        },
        {
          position_x: 64.78,
          position_y: 57.29,
          position_x_end: 35.22,
          position_y_end: 66.0,
        },
      ],
      "Simple Pass": [
        {
          //   position_x: 40,
          //   position_y: 1,
          //   position_x_end: 40,
          //   position_y_end: 67.0,
        },
        {
          //   position_x: 1,
          //   position_y: 10,
          //   position_x_end: 108,
          //   position_y_end: 10,
        },
      ],
      "Key Pass": [],
      Assist: [],
    },
    "Through Ball": {
      Unsuccessful: [],
      "Simple Pass": [],
      "Key Pass": [],
      Assist: [],
    },
    Crossing: {
      Unsuccessful: [],
      "Simple Pass": [],
      "Key Pass": [],
      Assist: [],
    },
  },
  Shooting: {
    "Close Shot": {
      "Off Target": [],
      "Simple Shot": [],
      "Hit Goal Post": [],
      "Brilliant Shot": [],
    },
    "Long Shot": {
      "Off Target": [
        {
          position_x: 25.37,
          position_y: 42.71,
          position_x_end: 5.27,
          position_y_end: 42.71,
        },
      ],
      "Simple Shot": [],
      "Hit Goal Post": [],
      "Brilliant Shot": [],
    },
  },
  Defending: {
    "Standing Tackle": {
      Unsuccessful: [
        {
          position_x: 35.22,
          position_y: 68.0,
          position_x_end: 35.22,
          position_y_end: 68.0,
        },
      ],
      Successful: [],
      Crucial: [],
    },
    "Sliding Tackle": {
      Unsuccessful: [],
      Successful: [],
      Crucial: [],
    },
    Interception: {
      Unsuccessful: [],
      Successful: [
        {
          position_x: 64.78,
          position_y: 15.95,
          position_x_end: 64.78,
          position_y_end: 15.95,
        },
        {
          position_x: 64.78,
          position_y: 68.0,
          position_x_end: 64.78,
          position_y_end: 68.0,
        },
      ],
      Crucial: [
        {
          position_x: 84.5,
          position_y: 28.46,
          position_x_end: 84.5,
          position_y_end: 28.46,
        },
      ],
    },
    Clearance: {
      Unsuccessful: [],
      Successful: [],
      Crucial: [],
      "Goal Line Clearance": [],
    },
  },
  Physical: {
    "Aerial Duels": {
      "Duel Lost": [
        {
          position_x: 54.93,
          position_y: 68.0,
          position_x_end: 54.93,
          position_y_end: 68.0,
        },
      ],
      "Duel Won": [
        {
          position_x: 45.07,
          position_y: 15.95,
          position_x_end: 45.07,
          position_y_end: 15.95,
        },
      ],
    },
    "Ground Duels": {
      "Duel Lost": [],
      "Duel Won": [],
    },
    Heading: {
      "Off Target": [],
      "Simple Header": [],
      "Hit Goal Post": [],
      "Brilliant Header": [],
    },
  },
  Dribbling: {
    Dribbling: {
      Unsuccessful: [],
      Successful: [
        {
          position_x: 64.78,
          position_y: 15.95,
          position_x_end: 64.78,
          position_y_end: 15.95,
        },
      ],
      Crucial: [],
    },
    "Difficult Receives": {
      Unsuccessful: [],
      Successful: [],
    },
  },
  "Ball Carry": {
    "Ball Carry": {
      "Ball Carry Short": [
        {
          position_x: 45.07,
          position_y: 42.71,
          position_x_end: 45.07,
          position_y_end: 28.46,
        },
        {
          position_x: 45.07,
          position_y: 57.29,
          position_x_end: 45.07,
          position_y_end: 68.0,
        },
        {
          position_x: 35.22,
          position_y: 68.0,
          position_x_end: 35.22,
          position_y_end: 68.0,
        },
        {
          position_x: 45.07,
          position_y: 57.29,
          position_x_end: 35.22,
          position_y_end: 42.71,
        },
        {
          position_x: 84.5,
          position_y: 28.46,
          position_x_end: 74.63,
          position_y_end: 28.46,
        },
        {
          position_x: 25.37,
          position_y: 68.0,
          position_x_end: 15.5,
          position_y_end: 68.0,
        },
      ],
      "Ball Carry Medium": [
        {
          position_x: 25.37,
          position_y: 15.95,
          position_x_end: 25.37,
          position_y_end: 42.71,
        },
      ],
      "Ball Carry Long": [
        {
          position_x: 64.78,
          position_y: 42.71,
          position_x_end: 35.22,
          position_y_end: 42.71,
        },
      ],
    },
  },
  Goalkeeping: {
    "Goalkeeper Throw": {
      Unsuccessful: [],
      "Simple Throw": [],
      "Key Throw": [],
    },
    "Goalkeeper Heading": {
      Unsuccessful: [],
      "Loose Ball Handled": [],
      "Key Ball Handled": [],
    },
    "Goalkeeper Saves": {
      "Goal Conceded": [],
      "Simple Shot Saved": [],
      "Key Shot Saved": [],
      "Brilliant Shot Saved": [],
    },
  },
  "Special Actions": {
    Throw: {
      Unsuccessful: [],
      "Simple Throw": [
        {
          position_x: 74.63,
          position_y: 5.32,
          position_x_end: 84.5,
          position_y_end: 42.71,
        },
      ],
      "Key Throw": [],
      "Assist Throw": [],
    },
    Offside: {
      Offside: [],
    },
    Handball: {
      Handball: [],
    },
  },
  "Passing Actions Receive Attempts": {
    "Shot Pass Receive Attempts": {
      "Received Unsuccessful": [],
      "Received Simple Pass": [
        {
          position_x: 64.78,
          position_y: 42.71,
          position_x_end: 64.78,
          position_y_end: 42.71,
        },
        {
          position_x: 64.78,
          position_y: 57.29,
          position_x_end: 64.78,
          position_y_end: 57.29,
        },
        {
          position_x: 45.07,
          position_y: 42.71,
          position_x_end: 45.07,
          position_y_end: 42.71,
        },
        {
          position_x: 45.07,
          position_y: 15.95,
          position_x_end: 45.07,
          position_y_end: 15.95,
        },
        {
          position_x: 45.07,
          position_y: 57.29,
          position_x_end: 45.07,
          position_y_end: 57.29,
        },
        {
          position_x: 45.07,
          position_y: 68.0,
          position_x_end: 45.07,
          position_y_end: 68.0,
        },
        {
          position_x: 45.07,
          position_y: 57.29,
          position_x_end: 45.07,
          position_y_end: 57.29,
        },
        {
          position_x: 84.5,
          position_y: 68.0,
          position_x_end: 84.5,
          position_y_end: 68.0,
        },
        {
          position_x: 64.78,
          position_y: 57.29,
          position_x_end: 64.78,
          position_y_end: 57.29,
        },
        {
          position_x: 74.63,
          position_y: 28.46,
          position_x_end: 74.63,
          position_y_end: 28.46,
        },
        {
          position_x: 74.63,
          position_y: 57.29,
          position_x_end: 74.63,
          position_y_end: 57.29,
        },
        {
          position_x: 64.78,
          position_y: 57.29,
          position_x_end: 64.78,
          position_y_end: 57.29,
        },
        {
          position_x: 64.78,
          position_y: 42.71,
          position_x_end: 64.78,
          position_y_end: 42.71,
        },
      ],
      "Received Key Pass": [],
      "Received Assist": [],
    },
    "Long Pass Receive Attempts": {
      "Received Unsuccessful": [
        {
          position_x: 54.93,
          position_y: 68.0,
          position_x_end: 54.93,
          position_y_end: 68.0,
        },
      ],
      "Received Simple Pass": [
        {
          position_x: 64.78,
          position_y: 68.0,
          position_x_end: 64.78,
          position_y_end: 68.0,
        },
        {
          position_x: 64.78,
          position_y: 42.71,
          position_x_end: 64.78,
          position_y_end: 42.71,
        },
        {
          position_x: 74.63,
          position_y: 57.29,
          position_x_end: 74.63,
          position_y_end: 57.29,
        },
      ],
      "Received Key Pass": [],
      "Received Assist": [],
    },
    "Through Ball Receive Attempts": {
      "Received Unsuccessful": [],
      "Received Simple Pass": [],
      "Received Key Pass": [],
      "Received Assist": [],
    },
    "Cross Receive Attempts": {
      "Received Unsuccessful": [],
      "Received Simple Pass": [],
      "Received Key Pass": [],
      "Received Assist": [],
    },
  },
  "Defending Actions Encountered": {
    "Standing Tackle Encountered": {
      "Tackle Evaded": [],
      "Tackled-Simple": [],
      "Tackled-Crucial": [],
    },
    "Sliding Tackle Encountered": {
      "Tackle Evaded": [],
      "Tackled-Simple": [],
      "Tackled-Crucial": [],
    },
    "Interception Encountered": {
      "Interception Evaded": [],
      "Intercepted-Simple": [
        {
          position_x: 35.22,
          position_y: 28.46,
          position_x_end: 35.22,
          position_y_end: 28.46,
        },
        {
          position_x: 35.22,
          position_y: 68.0,
          position_x_end: 35.22,
          position_y_end: 68.0,
        },
      ],
      "Intercepted-Crucial": [
        {
          position_x: 15.5,
          position_y: 68.0,
          position_x_end: 15.5,
          position_y_end: 68.0,
        },
      ],
    },
    "Pressure Encountered": {
      "Press Evaded": [],
      "Pressed-Simple": [],
      "Pressed-Crucial": [],
    },
  },
  "Physical Actions Encountered": {
    "Aerial Duels": {
      "Duel Won": [],
      "Duel Lost": [
        {
          position_x: 54.93,
          position_y: 68.0,
          position_x_end: 54.93,
          position_y_end: 68.0,
        },
      ],
    },
    "Ground Duels": {
      "Duel Won": [],
      "Duel Lost": [],
    },
  },
  "Dribbling Actions Encountered": {
    "Dribbling Encountered": {
      "Dribble Resisted": [],
      "Dribbled Past-Simple": [
        {
          position_x: 35.22,
          position_y: 68.0,
          position_x_end: 35.22,
          position_y_end: 68.0,
        },
      ],
      "Dribbled Past-Crucial": [],
    },
  },
  "Goalkeeping Actions Encountered": {
    "Goalkeeper Throw Receive Attempts": {
      "Received Unsuccessful": [],
      "Received Simple Throw": [],
      "Received Key Throw": [],
    },
  },
  "Special Actions Encountered": {
    "Throw in Receive Attempts": {
      "Received Unsuccessful": [],
      "Received Simple Throw": [
        {
          position_x: 84.5,
          position_y: 42.71,
          position_x_end: 84.5,
          position_y_end: 42.71,
        },
      ],
      "Received Key Throw": [],
      "Received Assist Throw": [],
    },
  },
};
