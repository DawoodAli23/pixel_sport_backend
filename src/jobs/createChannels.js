const { default: axios } = require("axios");
const { LiveTvModel, ChannelModel } = require("../model");

const createChannels = async () => {
  const channel = await LiveTvModel.find({ status: "active" })
    .populate("TVCategory")
    .lean();
  const channelObject = groupByCategory(channel);
  const {
    data: {
      sports: [
        {
          leagues: [{ events: nba }],
        },
      ],
    },
  } = await axios.get(
    "https://site.api.espn.com/apis/v2/scoreboard/header?sport=basketball&league=nba&lang=en&region=ww&contentorigin=espn"
  );
  const {
    data: {
      sports: [
        {
          leagues: [{ events: nfl }],
        },
      ],
    },
  } = await axios.get(
    "https://site.api.espn.com/apis/v2/scoreboard/header?sport=football&league=nfl&lang=en&region=ww&contentorigin=espn&groups"
  );
  const {
    data: {
      sports: [
        {
          leagues: [{ events: mlb }],
        },
      ],
    },
  } = await axios.get(
    "https://site.api.espn.com/apis/v2/scoreboard/header?sport=baseball&league=mlb&lang=en&region=ww&contentorigin=espn&groups"
  );
  const {
    data: {
      sports: [
        {
          leagues: [{ events: nhl }],
        },
      ],
    },
  } = await axios.get(
    "https://site.api.espn.com/apis/v2/scoreboard/header?sport=hockey&league=nhl&lang=en&region=ww&contentorigin=espn"
  );
  filterByDate(nba);
  filterByDate(nhl);
  filterByDate(mlb);
  filterByDate(nfl);
  await ChannelModel.deleteMany({});
  let currentDate = new Date();
  let twoDaysAgo = new Date(currentDate);
  twoDaysAgo.setDate(currentDate.getDate() - 2);

  const finalArray = [
    ...concatObjects(nba, channelObject.NBA),
    ...concatObjects(nhl, channelObject.NHL),
    ...concatObjects(mlb, channelObject.MLB),
    ...concatObjects(nfl, channelObject.NFL),
  ];
  await Promise.all(finalArray.map((p) => p.save()));
};

const groupByCategory = (arr) => {
  const result = {};

  arr.forEach((item) => {
    const categoryName = item.TVCategory.name;

    if (!result[categoryName]) {
      result[categoryName] = [];
    }

    result[categoryName].push(item);
  });

  return result;
};

function filterByDate(arrayOfObjects, specificDate) {
  arrayOfObjects = arrayOfObjects.filter((obj) => {
    const gameDate = new Date(obj.date);
    const targetDate = new Date(specificDate);

    return gameDate <= targetDate;
  });

  return arrayOfObjects;
}

const concatObjects = (events, channels) => {
  let arrObject = [];
  for (let channel of channels) {
    const condition = filterByTeamAndName(events, channel.TVName);
    if (condition.length) {
      arrObject.push(
        ChannelModel({ channel: channel._id, data: condition[0] })
      );
    }
  }
  return arrObject;
};

const filterByTeamAndName = (arrayOfObjects, teamName) => {
  const lowercaseTeamName = teamName.toLowerCase();

  return arrayOfObjects.filter((game) => {
    const homeTeam = game.competitors.find((team) => team.homeAway === "home");
    const homeTeamName = homeTeam ? homeTeam.displayName : null;
    const gameNameWithoutLive = lowercaseTeamName.replace(/\s*live$/i, "");

    return (
      homeTeamName.toLowerCase() === gameNameWithoutLive ||
      gameNameWithoutLive.includes(homeTeamName.toLowerCase())
    );
  });
};
module.exports = createChannels;
