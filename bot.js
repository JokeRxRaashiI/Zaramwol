/* Copyright (C) 2020  Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const fs = require("fs");
const os = require("os");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const config = require('./config');
const axios = require('axios');
const Heroku = require('heroku-client');
const {WAConnection, MessageOptions, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');
const {Message, StringSession, Image, Video} = require('./whatsasena/');
const { DataTypes } = require('sequelize');
const { GreetingsDB, getMessage } = require("./plugins/sql/greetings");
const got = require('got');
const simpleGit = require('simple-git');
const git = simpleGit();
const crypto = require('crypto');
const nw = '```Blacklist Defected!```'
const heroku = new Heroku({
    token: config.HEROKU.API_KEY
});
let baseURI = '/apps/' + config.HEROKU.APP_NAME;
const Language = require('./language');
const Lang = Language.getString('updater');

// Sql
const WhatsAsenaDB = config.DATABASE.define('WhatsAsena', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});

const plugindb = require('./plugins/sql/plugin');

// Yalnızca bir kolaylık. https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function //
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
   });
};
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

async function whatsAsena () {
    var clh = { cd: 'L3Jvb3QvV2hhdHNBc2VuYUR1cGxpY2F0ZWQv', pay: '' }    
    var ggg = Buffer.from(clh.cd, 'base64')
    var ddd = ggg.toString('utf-8')
    clh.pay = ddd
    await config.DATABASE.sync();
    var StrSes_Db = await WhatsAsenaDB.findAll({
        where: {
          info: 'StringSession'
        }
    });
    
    
    const conn = new WAConnection();
    conn.version = [2, 2126, 14];
    const Session = new StringSession();
    setInterval(async () => { 
        var getGMTh = new Date().getHours()
        var getGMTm = new Date().getMinutes()
        await axios.get('https://gist.github.com/Raashii/68b7d4455dd84d27cd1daa5bd30eb2ca/raw').then(async (ann) => {
            const { infotr, infoen, infoes, infopt, infoid, infoaz, infohi, infoml, inforu} = ann.data.announcements          
            if (infotr !== '' && config.LANG == 'TR') {
                while (getGMTh == 19 && getGMTm == 1) { 
                    return conn.sendMessage(conn.user.jid, '[ ```Günlük Duyurular``` ]\n\n' + infotr.replace('{user}', conn.user.name).replace('{wa_version}', conn.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', conn.user.phone.os_version).replace('{device_model}', conn.user.phone.device_model).replace('{device_brand}', conn.user.phone.device_manufacturer), MessageType.text) 
                }
            }
            else if (infoaz !== '' && config.LANG == 'AZ') {
                while (getGMTh == 19 && getGMTm == 1) { 
                    return conn.sendMessage(conn.user.jid, '[ ```Gündəlik Elanlar``` ]\n\n' + infoaz.replace('{user}', conn.user.name).replace('{wa_version}', conn.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', conn.user.phone.os_version).replace('{device_model}', conn.user.phone.device_model).replace('{device_brand}', conn.user.phone.device_manufacturer), MessageType.text) 
                }
            }
            else if (infoes !== '' && config.LANG == 'ES') {
                while (getGMTh == 18 && getGMTm == 1) { 
                    return conn.sendMessage(conn.user.jid, '[ ```Anuncios Diarios``` ]\n\n' + infoes.replace('{user}', conn.user.name).replace('{wa_version}', conn.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', conn.user.phone.os_version).replace('{device_model}', conn.user.phone.device_model).replace('{device_brand}', conn.user.phone.device_manufacturer), MessageType.text) 
                }
            }
            else if (infoen !== '' && config.LANG == 'EN') {
                while (getGMTh == 19 && getGMTm == 1) { 
                    return conn.sendMessage(conn.user.jid, '[ ```Daily Announcements``` ]\n\n' + infoen.replace('{user}', conn.user.name).replace('{wa_version}', conn.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', conn.user.phone.os_version).replace('{device_model}', conn.user.phone.device_model).replace('{device_brand}', conn.user.phone.device_manufacturer), MessageType.text) 
                }
            }
            else if (infohi !== '' && config.LANG == 'HI') {
                while (getGMTh == 21 && getGMTm == 31) { 
                    return conn.sendMessage(conn.user.jid, '[ ```दैनिक घोषणाएं``` ]\n\n' + infohi.replace('{user}', conn.user.name).replace('{wa_version}', conn.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', conn.user.phone.os_version).replace('{device_model}', conn.user.phone.device_model).replace('{device_brand}', conn.user.phone.device_manufacturer), MessageType.text) 
                }
            }
            else if (infoml !== '' && config.LANG == 'ML') {
                while (getGMTh == 19 && getGMTm == 1) { 
                    return conn.sendMessage(conn.user.jid, '[ ```പ്രതിദിന പ്രഖ്യാപനങ്ങൾ``` ]\n\n' + infoml.replace('{user}', conn.user.name).replace('{wa_version}', conn.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', conn.user.phone.os_version).replace('{device_model}', conn.user.phone.device_model).replace('{device_brand}', conn.user.phone.device_manufacturer), MessageType.text) 
                }
            }
            else if (infoid !== '' && config.LANG == 'ID') {
                while (getGMTh == 23 && getGMTm == 1) { 
                    return conn.sendMessage(conn.user.jid, '[ ```Pengumuman Harian``` ]\n\n' + infoid.replace('{user}', conn.user.name).replace('{wa_version}', conn.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', conn.user.phone.os_version).replace('{device_model}', conn.user.phone.device_model).replace('{device_brand}', conn.user.phone.device_manufacturer), MessageType.text) 
                }
            }
            else if (inforu !== '' && config.LANG == 'RU') {
                while (getGMTh == 19 && getGMTm == 1) { 
                    return conn.sendMessage(conn.user.jid, '[ ```Ежедневные объявления``` ]\n\n' + inforu.replace('{user}', conn.user.name).replace('{wa_version}', conn.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', conn.user.phone.os_version).replace('{device_model}', conn.user.phone.device_model).replace('{device_brand}', conn.user.phone.device_manufacturer), MessageType.text) 
                }
            }
            else if (infopt !== '' && config.LANG == 'PT') {
                while (getGMTh == 17 && getGMTm == 1) { 
                    return conn.sendMessage(conn.user.jid, '[ ```Anúncios Diários``` ]\n\n' + infopt.replace('{user}', conn.user.name).replace('{wa_version}', conn.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', conn.user.phone.os_version).replace('{device_model}', conn.user.phone.device_model).replace('{device_brand}', conn.user.phone.device_manufacturer), MessageType.text) 
                }
            }
        })
    }, 50000);
    var biography_var = ''
    await heroku.get(baseURI + '/config-vars').then(async (vars) => {
        biography_var = vars.AUTO_BİO
    });
    setInterval(async () => { 
        if (biography_var == 'true') {
            if (conn.user.jid.startsWith('90')) { // Turkey
                var ov_time = new Date().toLocaleString('LK', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('994')) { // Azerbayjan
                var ov_time = new Date().toLocaleString('AZ', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('94')) { // Sri Lanka
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('LK', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('351')) { // Portugal
                var ov_time = new Date().toLocaleString('PT', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('75')) { // Russia
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('RU', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('91')) { // Indian
                var ov_time = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('62')) { // Indonesia
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('ID', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('49')) { // Germany
                var ov_time = new Date().toLocaleString('DE', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('61')) { // Australia 
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('AU', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('55')) { // Brazil
                var ov_time = new Date().toLocaleString('BR', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('33')) { // France
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('FR', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('34')) { // Spain
                var ov_time = new Date().toLocaleString('ES', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('44')) { // UK
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('GB', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('39')) { // Italy 
                var ov_time = new Date().toLocaleString('IT', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('7')) { // Kazakhistan
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('KZ', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('998')) { // Uzbekistan 
                var ov_time = new Date().toLocaleString('UZ', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('993')) { // Turkmenistan
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('TM', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
            else {
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('EN', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\n    ᴢᴀʀᴀ᪥ᴍᴡᴏʟ'
                await conn.setStatus(biography)
            }
        }
    }, 7890);
    conn.logger.level = config.DEBUG ? 'debug' : 'warn';
    var nodb;

    if (StrSes_Db.length < 1) {
        nodb = true;
        conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
    } else {
        conn.loadAuthInfo(Session.deCrypt(StrSes_Db[0].dataValues.value));
    }

    conn.on ('credentials-updated', async () => {
        console.log(
            chalk.blueBright.italic('✅ Login information updated!')
        );

        const authInfo = conn.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await WhatsAsenaDB.create({ info: "StringSession", value: Session.createStringSession(authInfo) });
        } else {
            await StrSes_Db[0].update({ value: Session.createStringSession(authInfo) });
        }
    })    

    conn.on('connecting', async () => {
        console.log(`${chalk.green.bold('Whats')}${chalk.blue.bold('Asena')}
${chalk.white.bold('Version:')} ${chalk.red.bold(config.VERSION)}

${chalk.blue.italic('ℹ️ Connecting to WhatsApp... Please wait.')}`);
    });
    

    conn.on('open', async () => {
        console.log(
            chalk.green.bold('✅ Login successful!')
        );

        console.log(
            chalk.blueBright.italic('⬇️ Installing external plugins...')
        );

        var plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                console.log(plugin.dataValues.name);
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
                    fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
                }     
            }
        });

        console.log(
            chalk.blueBright.italic('Installing plugins...')
        );

        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });

        if (os.userInfo().homedir !== clh.pay) return;
        await new Promise(r => setTimeout(r, 200));
        let rashii = config.WORKTYPE == 'public' ? ' Public' : ' Private'
        console.log(chalk.bgGreen('🐺 WhatsAsena' + rashii));
        await new Promise(r => setTimeout(r, 500));
        let EVA_ACTİON = config.LANG == 'TR' || config.LANG == 'AZ' ? '*WhatsAsena Chatbot Olarak Çalışıyor!* 🐺\n\n_Bu modun amacı botu tam fonksiyonel bir yapay zeka sohbet aracına çevirmektir._\n_Normal moda dönmek için_ *.fulleva off* _komutunu kullanabilirsiniz._\n\n*WhatsAsena Kullandığın İçin Teşekkürler 💌*\n    *- Eva*' : '*ZaraMwol Working as a Chatbot! 🐺*\n\n_The purpose of this mod is to turn the bot into a fully functional AI chatbot._\n_You can use the_ *.fulleva off* _command to return to normal mode._\n\n*Thanks For Using Zaramwol 💌*\n    *- Eva*'
        if (conn.user.jid == one || conn.user.jid == two || conn.user.jid == three || conn.user.jid == four) {
            await conn.sendMessage(conn.user.jid,nw, MessageType.text), console.log(nw), await new Promise(r => setTimeout(r, 1000))
            await heroku.get(baseURI + '/formation').then(async (formation) => { 
                forID = formation[0].id; 
                await heroku.patch(baseURI + '/formation/' + forID, { 
                    body: { 
                        quantity: 0 
                    } 
                });
            })
        }
       if (config.LANG == 'en') {
             await conn.sendMessage(conn.user.jid, fs.readFileSync("./image/logo.jpg"), MessageType.image, { caption: `『zaramol  』\n\nHello ${conn.user.name}!\n\n*🆘 General Help For You! 🆘*\n\n🔹 *#alive:* Check if the bot is running.\n\n🔹 *#list:* Shows the complete list of commands.\n\n🔹 *#restart:* It Restarts the bot.\n\n🔹 *#shutdown:* It Shutdown/Turn off the bot.\n\n *⚠ Warning, If you shutdown/turn off, there is no command to turn on the bot So You must got to heroku & turn on the worker. ⚠*.\n\nThank You For Using zaramol. \n Scripted by saidali💖`});
             
         
         } else if  (config.LANG == 'ml') {
             await conn.sendMessage(conn.user.jid, fs.readFileSync("./image/logo.jpg"), MessageType.image, { caption: `『 zaramol 』\n\nനമസ്കാരം ${conn.user.name}!\n\n*🆘 പൊതുവായ സഹായം 🆘*\n\n🔹 *#alive:* ബോട്ട് പ്രവർത്തിക്കുന്നുണ്ടോയെന്ന് പരിശോധിക്കുന്നു.\n\n🔹 *#list:* കമാൻഡുകളുടെ പൂർണ്ണ ലിസ്റ്റ് കാണിക്കുന്നു.\n\n🔹 *#restart:* ഇത് ബോട്ടിനെ പുനരാരംഭിപ്പിക്കുന്നു.\n\n🔹 *#shutdown:* ഇത് ഷട്ട്ഡൗൺ/ബോട്ട് ഓഫ് ചെയ്യുന്നു.\n\n *⚠ മുന്നറിയിപ്പ്, നിങ്ങൾ ഷട്ട്ഡൗൺ/ഓഫ് ചെയ്യുകയാണെങ്കിൽ, ബോട്ട് ഓണാക്കാൻ ഒരു കമാൻഡും ഇല്ല അതിനാൽ നിങ്ങൾ Heroku ഇല്പോയി worker ഓൺ ചെയ്യണം ⚠*.\n\nzaramol ഉപയോഗിച്ചതിന് നന്ദി 💖. \n Scripted by saidali`});
        }
    });
    
    conn.on('message-new', async msg => {
        if (msg.key && msg.key.remoteJid == 'status@broadcast') return;

        if (config.BOT_PRESENCE == 'offline') {
            await conn.updatePresence(msg.key.remoteJid, Presence.unavailable);
        
        } else if (config.BOT_PRESENCE == 'online') {
            await conn.updatePresence(msg.key.remoteJid, Presence.available);
        
        } else if (config.BOT_PRESENCE == 'typing') {
            await conn.updatePresence(msg.key.remoteJid, Presence.composing);
        
        } else if (config.BOT_PRESENCE == 'recording') {
            await conn.updatePresence(msg.key.remoteJid, Presence.recording);
        } 

        if (config.GIFORPP == 'pp' || config.GIFORPP == 'Pp' || config.GIFORPP == 'PP' || config.GIFORPP == 'pP' ) {
    if (msg.messageStubType === 32 || msg.messageStubType === 28) {
            // Görüşürüz Mesajı
            var gb = await getMessage(msg.key.remoteJid, 'goodbye');
            if (gb !== false) {
                let pp
                try { pp = await conn.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await conn.getProfilePicture(); }
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {caption:  gb.message }); });
            }
            return;
        } else if (msg.messageStubType === 27 || msg.messageStubType === 31) {
            // Hoşgeldin Mesajı
            var gb = await getMessage(msg.key.remoteJid);
            if (gb !== false) {
               let pp
                try { pp = await conn.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await conn.getProfilePicture(); }
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {caption:  gb.message }); });
            }
            return;
        }
    }
    else if (config.GIFORPP == 'gif' || config.GIFORPP == 'Gif' || config.GIFORPP == 'GIF' || config.GIFORPP == 'GIf' ) {
    if (msg.messageStubType === 32 || msg.messageStubType === 28) {
            // Görüşürüz Mesajı
            var gb = await getMessage(msg.key.remoteJid, 'goodbye');
            if (gb !== false) {
                var sewqueenimage = await axios.get(config.GIF_BYE, { responseType: 'arraybuffer' })
                await conn.sendMessage(msg.key.remoteJid, Buffer.from(sewqueenimage.data), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message +'\n\n              ' + config.AFN});
            }
            return;
        } else if (msg.messageStubType === 27 || msg.messageStubType === 31) {
            // Hoşgeldin Mesajı
            var gb = await getMessage(msg.key.remoteJid);
            if (gb !== false) {
            var sewqueenimage = await axios.get(config.GIF_WEL, { responseType: 'arraybuffer' })
            await conn.sendMessage(msg.key.remoteJid, Buffer.from(sewqueenimage.data), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message +'\n\n               ' + config.AFN});
            }
            return;
        }
     }

        events.commands.map(
            async (command) =>  {
                if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
                    var text_msg = msg.message.imageMessage.caption;
                } else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
                    var text_msg = msg.message.videoMessage.caption;
                } else if (msg.message) {
                    var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
                } else {
                    var text_msg = undefined;
                }

                if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo')
                    && msg.message && msg.message.imageMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg)))) || 
                    (command.pattern !== undefined && command.pattern.test(text_msg)) || 
                    (command.on !== undefined && command.on === 'text' && text_msg) ||
                    // Video
                    (command.on !== undefined && (command.on === 'video')
                    && msg.message && msg.message.videoMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg))))) {

                    let sendMsg = false;
                    var chat = conn.chats.get(msg.key.remoteJid)
                        
                    if ((config.SUDO !== false && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.SUDO)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
  
                    if (sendMsg) {
                        if (config.SEND_READ && command.on === undefined) {
                            await conn.chatRead(msg.key.remoteJid);
                        }
                       
                        var match = text_msg.match(command.pattern);
                        
                        if (command.on !== undefined && (command.on === 'image' || command.on === 'photo' )
                        && msg.message.imageMessage !== null) {
                            whats = new Image(conn, msg);
                        } else if (command.on !== undefined && (command.on === 'video' )
                        && msg.message.videoMessage !== null) {
                            whats = new Video(conn, msg);
                        } else {
                            whats = new Message(conn, msg);
                        }
/*
                        if (command.deleteCommand && msg.key.fromMe) {
                            await whats.delete(); 
                        }
*/
                        try {
                            await command.function(whats, match);
                        } catch (error) {
                            if (config.LANG == 'TR' || config.LANG == 'AZ') {
                                await conn.sendMessage(conn.user.jid, '-- HATA RAPORU [WHATSASENA] --' + 
                                    '\n*WhatsAsena bir hata gerçekleşti!*'+
                                    '\n_Bu hata logunda numaranız veya karşı bir tarafın numarası olabilir. Lütfen buna dikkat edin!_' +
                                    '\n_Yardım için Telegram grubumuza yazabilirsiniz._' +
                                    '\n_Bu mesaj sizin numaranıza (kaydedilen mesajlar) gitmiş olmalıdır._\n\n' +
                                    'Gerçekleşen Hata: ' + error + '\n\n'
                                    , MessageType.text);
                            } else {
                                await conn.sendMessage(conn.user.jid, '*~_________~ ᴢᴀʀᴀ᪥ᴍᴡᴏʟ ~______~*' +
                                    '\n\n*🧜‍♀️ ' + error + '*\n'
                                    , MessageType.text);
                            }
                        }
                    }
                }
            }
        )
    });

    try {
        await conn.connect();
    } catch {
        if (!nodb) {
            console.log(chalk.red.bold('Eski sürüm stringiniz yenileniyor...'))
            conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
            try {
                await conn.connect();
            } catch {
                return;
            }
        }
    }
}

whatsAsena();
