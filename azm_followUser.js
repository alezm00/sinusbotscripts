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
    }]
}, function(_, config, meta) {
    
});