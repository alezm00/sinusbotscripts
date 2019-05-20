registerPlugin({
    name: 'azm follow user script',
    version: '0.1',
    description: 'Nothing to see here go away',
    author: 'Alezm <https://github.com/alezm00>',
    vars: [{
        name:'azm_welcome',
        title:'Benvenuto configura il followbot'
    },{
        name:'azm_defaultchannel',
        title:"Imposta il canale in cui il bot tornerà quando non trova l'tente selezionato",
        type:'string',
        indent:1
    },{
        name:'azm_usertofollow',
        title:"Imposta l'utente da seguire inserisci l'uid",
        type:'string',
        indent:1
    }]
}, function(_, config, meta) {
    var event = require('event');
    var engine = require('engine');
    var backend = require('backend');
    event.on("load",() => {
        let commandCreator = require("command");
        if (!commandCreator) {
            engine.log("Devi avere installato command.js");
            return;
        }
    })
    if(!config) {
        config = {}
    }
    event.on('clientMove',ev => {
        if (!backend.isConnected()) return;
        if (ev.client.isSelf()) return;
        if (typeof ev.toChannel == 'undefined') return;
        if (ev.toChannel == 'undefined') {
           backend.getBotClient().moveTo(backend.getChannelByID(config.azm_defaultchannel)); 
           return;
        }
        if (ev.client.uid() == config.azm_usertofollow) {
            backend.getBotClient().moveTo(ev.toChannel);
        }
    })
});