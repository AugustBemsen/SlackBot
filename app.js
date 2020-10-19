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
// const promoteUsers = ["U01D2PWDY56"];
// const usersToRemove = ["U01CD2W0QRG"];
// Initializing bot

rtm.on("ready", async () => {
    console.log(`Promotion Bot ${package.version}  has started`);
    // await sendMessage("#testbot", `Promotion Bot ${package.version}  has started`);
    // await promoteUser("C01CUFFAR27", "C01CDGS324B");
    // await removeUser();
    // await deactivateUsers();
    // isolateUsers();
    // promoteMentors("C01CUFFAR27");

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
    // get users from database
    await axios.get('https://sidehustle.ng/dashboard/json.php')
        .then(async (res) => {
            // Make a request for a user with a given ID
            await res.data.map(user => {
                console.log(user.slack_id);
                axios.post(`https://slack.com/api/conversations.invite?token=${userToken}&channel=${promoteChannel}&users=${user.slack_id}&pretty=1`)
                    .then((response) => {
                        console.log("add res", response.data);
                    })
                    .catch((error) => {
                        console.log("add err", error.data);
                    });
                axios.post(`https://slack.com/api/conversations.kick?token=${userToken}&channel=${removeChannel}&user=${user.slack_id}&pretty=1`)
                    .then((response) => {
                        console.log("remove res", response.data);
                    }).catch((error) => {
                        console.log("remove err", error.data);
                    });
            })
        }).catch(console.error())
};

//  Promote mentors

const promoteMentors = async (promoteChannel) => {
    // get users from database
    await axios.get(`https://slack.com/api/conversations.members?token=${token}&channel=C01B1J54RRV&pretty=`)
        .then(async (res) => {
            // Make a request for a user with a given ID

            await res.data.members.map(user => {
                axios.post(`https://slack.com/api/conversations.invite?token=${userToken}&channel=${promoteChannel}&users=${user}&pretty=1`)
                    .then((response) => {
                        console.log("add res", response.data);
                    })
                    .catch((error) => {
                        console.log("add err", error.data);
                    });
            })
        }).catch(console.error())
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

//  isolate inactive Users

const isolateUsers = async () => {
    await axios.get(`https://slack.com/api/users.list?token=${userToken}&pretty=1`)
        .then(async (response) => {
            await response.data.members.map(element => {
                if (element.is_invited_user) {
                    console.log(response.data.members);
                }
            });

        })
        .catch((error) => {
            console.log("isolate err", error);
        });
}

// Check for events 

rtm.on("slack_event", async (eventType, event) => {
    if (event && event.type === "message") {
        // console.log(event);
        if (event.text === "Hello Bot") {
            await sendMessage(event.channel, `Hey, how are you <@${event.user}>`);
        }
    }
})

// rtm.start().catch(console.error);

// rtm.disconnect().catch(console.log("Bot disconnected"));
