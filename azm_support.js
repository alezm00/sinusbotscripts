registerPlugin({
    name: 'azm Support bot',
    version: '1.1',
    description: 'Nothing to see here go away',
    author: 'Alezm',
    vars: [{
        name:'azm_welcome',
        title:'Benvenuto configura il support'
    },{
        name:'azm_canale',
        title:'Seleziona il canale di supporto',
        indent : 1,
        type: 'channel'
    },{
        name:'azm_avviso',
        title: 'Inserisci il messaggio di avviso al player (&u = client name)',
        indent:1,
        type:'string'
    },{
        name:'azm_premessage',
        title: 'Inserisci il messaggio iniziale da inviare prima delle opzioni',
        indent:1,
        type:'string'
    },{
        name:'azm_postmessage',
        title: 'Inserisci il messaggio da inviare dopo la scelta (&u = client name)',
        indent:1,
        type:'string'
    },{
        name:'azm_supporterMessage',
        title: 'Inserisci il messaggio da inviare agli admin che ricevono il poke di avviso (&i = id messaggio)',
        indent:1,
        type:'string'
    },{
        name: 'azm_messages',
        indent : 2,
        title: 'Opzioni messaggi:',
        type: 'array',
        vars: [{
            name: 'azm_message_id',
            indent: 1,
            title: 'seleziona il numero del messaggio',
            type: 'number'
        },{
            name: 'azm_message',
            indent: 1,
            title: 'seleziona il messaggio scrivi &u per il nome del player',
            type: 'string' 
        },{
            name: 'azm_groups',
            indent: 1,
            title: 'seleziona i gruppi che devono ricevere questa richiesta',
            type: 'strings'
        }]
    },{
        name: 'azm_nosupporters',
        indent:1,
        title:'Inserisci il messaggio da inviare se non ci sono supporter online',
        type:'string'
    },{
        name: 'xxxxxxxxxx',
        title: '------------------------------------------------------------------------------------------------------------------------'
    }]
}, function(_, config, meta) {
    var event = require('event');
    var engine = require('engine');
    var backend = require('backend');
    var audio = require('audio');
    event.on("load",() => {
        let commandCreator = require("command");
        if (!commandCreator) {
            engine.log("Devi avere installato command.js");
            return;
        }
    })
    ////////////////////////////////
    if(!config) {
        config = {}
    }
    let azm_antispam = [];
    event.on('chat', (ev) => {
        if (!backend.isConnected()) return;
        if (ev.client.isSelf()) return;
        if (ev.channel.id() == config.azm_canale) {
            config.azm_messages.forEach(mess => {
                if (ev.text == mess.azm_message_id) {
                    if (azm_antispam.indexOf(ev.client.id()) == -1) {
                        sendMessage(ev.client,(config.azm_postmessage));
                        audio.say(config.azm_postmessage.replace("&u", ev.client.name()))
                        callSupport(mess.azm_message_id,mess.azm_groups,ev.client.name());
                        azm_antispam.push(ev.client.id());
                        setTimeout(() => {
                            let indexx = azm_antispam.indexOf(ev.client.id())
                            if (indexx != -1) {
                                azm_antispam.splice(indexx,1)
                            }
                        }, 30000);
                    }
                }                
            });
        }
    })
    event.on('clientMove',(ev) => {
        if (!backend.isConnected()) return;
        if (ev.client.isSelf()) return;
        if (typeof ev.toChannel == 'undefined') return;
        
        //engine.log("azm_channelmove" + ev.client.name() + "    [" + ev.toChannel.id() + " --- " + config.azm_canale+"]");
        if (ev.toChannel.id() == config.azm_canale) {
            ev.client.poke(config.azm_avviso.replace("&u", ev.client.name()))
            sendMessage(ev.client,config.azm_premessage)
            config.azm_messages.forEach(mess => {
                sendMessage(ev.client,("[B]" + mess.azm_message_id + "[/B]" + " >> " + mess.azm_message))
            });
        }
    })




    //functions
    function sendMessage(client,message) {
        client.chat(message.replace("&u", client.name()));
    }

    function callSupport(messageID,permID,requestName) {
        let list = getSupportList(permID);
        if (list.length == 0) {
            backend.getClientByName(requestName).poke(config.azm_nosupporters);
            return;
        };
        list.forEach(onSupportClient => {
            setTimeout(() => {
                backend.getClientByID(onSupportClient).poke(config.azm_supporterMessage.replace("&i", messageID).replace("&u",requestName))
            }, 100);
        });
    }

    function getSupportList(groupArray) {
        let supportList = []
        backend.getClients().forEach(client => {
            client.getServerGroups().forEach(group => {
                groupArray.forEach(group2 => {
                    if (group.id() == group2 && supportList.indexOf(client.id()) == -1) {
                        supportList.push(client.id());
                    }
                });
            });
        });
        return supportList;
    }
    function getDateTime(mode) { //getDateTime("date")
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        if (month.toString().length == 1) {
            var month = '0' + month;
        }
        if (day.toString().length == 1) {
            var day = '0' + day;
        }
        if (hour.toString().length == 1) {
            var hour = '0' + hour;
        }
        if (minute.toString().length == 1) {
            var minute = '0' + minute;
        }
        if (second.toString().length == 1) {
            var second = '0' + second;
        }
        var dateTime = "";
        if (mode == "date") {
            dateTime = year + '/' + month + '/' + day;
        } else if (mode == "ora") {
            dateTime = hour + ':' + minute + ':' + second;
        } else {
            dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
        }

        return dateTime;
    }
});