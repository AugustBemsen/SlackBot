require('dotenv').config()
const axios = require('axios');
const {
    RTMClient
} = require('@slack/rtm-api');
const {
    WebClient
} = require('@slack/web-api');
const {
    ...package
} = require("./package.json");

// app constants 
const token = process.env.BOT_TOKEN;
const rtm = new RTMClient(token);
const web = new WebClient(token);
const userToken = process.env.USER_TOKEN;
const testChannel = "testbot";
const testText = `Promotion Bot ${package.version}  has started`;
const promoteChannel = "C01CDGS324B";
const removeChannel = "C01BY2PJ3TR";
const promoteUsers = ["U01D2PWDY56"];
// const usersToRemove = ["U01CD2W0QRG"];
// Initializing bot

rtm.on("ready", async () => {
    // console.log(testText);
    // await sendMessage("#level-2", `Promotion Bot ${package.version}  is loading....`);
    // await setTimeout( sendMessage("#level-2", `Promotion Bot has started`), 3000);
    // await setTimeout( sendMessage("#level-2", `<@SideHustle_Bot> is ready`), 5000);
    // await sendMessage("#testbot", `Promotion Bot ${package.version}  has started`);
    // await promoteUser("G01CUFFAR27", "C01CDGS324B");
    // await removeUser();
    // await deactivateUsers();
})


// Send Message Function

const sendMessage = async (testChannel, testText) => {
    await web.chat.postMessage({
        channel: testChannel,
        text: testText
    }).catch(err => console.log(err))
}

//  Add users to channel function 

const promoteUser = async (promoteChannel, removeChannel) => {
    // Make a request for a user with a given ID
    await promoteUsers.map(user => {
        axios.post(`https://slack.com/api/conversations.invite?token=${userToken}&channel=${promoteChannel}&users=${user}&pretty=1`)
            .then((response) => {
                console.log("add res", response.data);
            })
            .catch((error) => {
                console.log("add err", error.data);
            });
        axios.post(`https://slack.com/api/conversations.kick?token=${userToken}&channel=${removeChannel}&user=${user}&pretty=1`)
            .then((response) => {
                console.log("remove res", response.data);
            }).catch((error) => {
                console.log("remove err", error.data);
            });
    })
};

// Deactivate Users

const deactivateUsers = async () => {
    await usersToRemove.map(user => {
        axios.post(`https://slack.com/api/users.admin.setInactive?token=${userToken}&user=${user}&pretty=1`)
            .then((response) => {
                console.log("deactivate res", response.data);
            })
            .catch((error) => {
                console.log("deactivate err", error.data);
            });
    })
};

// Check for events 

rtm.on("slack_event", async (eventType, event) => {
    if (event && event.type === "message") {
        console.log(event);
        if (event.text === "Hello Bot") {
            await sendMessage(event.channel, `Hey, how are you <@${event.user}>`);
        }
    }
})

rtm.start().catch(console.error);

// rtm.disconnect().catch(console.error);