/* Copyright (C) 2020 Yusuf Usta.

RECODDED BY RAASHII 

*/

const fs = require("fs");

const os = require("os");

const { getBuffer } = require('./func');

const path = require("path");

const events = require("./events");

const chalk = require('chalk');

const config = require('./config');

const Config = require('./config');

const zara = require('./zara');

const axios = require('axios');

const Heroku = require('heroku-client');

const {WAConnection, MessageOptions, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');

const {Message, StringSession, Image, Video} = require('./Zara/');

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

    await config.DATABASE.sync();

    var StrSes_Db = await WhatsAsenaDB.findAll({

        where: {

          info: 'StringSession'

        }

    });

    

    

    

    const conn = new WAConnection();

    conn.version = [3, 3234, 9];

    const Session = new StringSession();

    conn.version = [2, 2140, 12]

    conn.browserDescription = ['ZaraMwol', 'Firefox', '90']

	

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

            chalk.blueBright.italic('⬇️  Installing plugins...')

        );

        fs.readdirSync('./plugins').forEach(plugin => {

            if(path.extname(plugin).toLowerCase() == '.js') {

                require('./plugins/' + plugin);

            }

        });

        console.log(

            chalk.green.bold('𝚉𝚊𝚛𝚊 𝚠𝚘𝚛𝚔𝚒𝚗𝚐 ' + config.WORKTYPE + ' 𝚗𝚘𝚠 👻'));

            await conn.sendMessage(conn.user.jid, "*𝙱𝙾𝚃 𝚂𝚃𝙰𝚁𝚃𝙴𝙳*", MessageType.text);

    });

    

    conn.on('chat-update', async m => {

        if (!m.hasNewMessage) return;

        if (!m.messages && !m.count) return;

        let msg = m.messages.all()[0];

        if (msg.key && msg.key.remoteJid == 'status@broadcast') return;

        if (config.NO_ONLINE) {

            await conn.updatePresence(msg.key.remoteJid, Presence.unavailable);

        }

        

//Auto fake remove

if (msg.messageStubeType === 31 && config.FAKER === 'true') {

    

  if (!msg.messageStubParameters[0].startsWith('91') ) {

  

  async function checkImAdmin(message, user = conn.user.jid) {

    var grup = await conn.groupMetadata(msg.key.remoteJid);

    var sonuc = grup['participants'].map((member) => {

        

        if (member.jid.split("@")[0] == user.split("@")[0] && member.isAdmin) return true; else; return false;

    });

    

    return sonuc.includes(true);

}

             

		var iam = await checkImAdmin();

     if (!iam) {

       

		return;

		

		}

		   else {

			return await conn.groupRemove(msg.key.remoteJid, [msg.messageStubParameters[0]]);

			}	

   

  }

  return;

  }

//greeting

       if (msg.messageStubType === 32 || msg.messageStubType === 28) {

 

            var gb = await getMessage(msg.key.remoteJid, 'goodbye');

            if (gb !== false) {

                if (gb.message.includes('{pp}')) {

                let pp 

                try { pp = await conn.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await conn.getProfilePicture(); }

                    var pinkjson = await conn.groupMetadata(msg.key.remoteJid)

                    

                    const tag = '@' + msg.messageStubParameters[0].split('@')[0]

                    

                   var time = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]

                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {

                await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {thumbnail: fs.readFileSync('./media/image/bye.jpg'), caption:  gb.message.replace('{pp}', '').replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{time}', time).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]}}); });                           

        } else if (gb.message.includes('{gp}')) {

                let gp

                try { gp = await conn.getProfilePicture(msg.key.remoteJid); } catch { gp = await conn.getProfilePicture(); }

                const tag = '@' + msg.messageStubParameters[0].split('@')[0]

                    var rashijson = await conn.groupMetadata(msg.key.remoteJid)

                   var time = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]

   

                await axios.get(gp, {responseType: 'arraybuffer'}).then(async (res) => {

                    //created by Raashii

                await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {thumbnail: fs.readFileSync('./media/image/bye.jpg'), caption:  gb.message.replace('{gp}', '').replace('{gphead}', rashijson.subject).replace('{gpmaker}', rashijson.owner).replace('{gpdesc}', rashijson.desc).replace('{owner}', conn.user.name).replace('{time}', time).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]} }); });

             

   } else if (gb.message.includes('{gif}')) {

                //created by afnanplk

                const tag = '@' + msg.messageStubParameters[0].split('@')[0]

                    var plkpinky = await axios.get(config.GIF_BYE, { responseType: 'arraybuffer' })

                    var pinkjson = await conn.groupMetadata(msg.key.remoteJid)

                   var time = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]

                await conn.sendMessage(msg.key.remoteJid, Buffer.from(plkpinky.data), MessageType.video, {thumbnail: fs.readFileSync('./media/image/bye.jpg'), mimetype: Mimetype.gif, caption: gb.message.replace('{gif}', '').replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{time}', time).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]} });

            } else {

              var time = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]

              

              const tag = '@' + msg.messageStubParameters[0].split('@')[0]

                   await conn.sendMessage(msg.key.remoteJid,gb.message.replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{time}', time).replace('{mention}', tag),MessageType.text,{ contextInfo: {mentionedJid: [msg.messageStubParameters[0]]}});

                   

              }

              

            } 

           

            return;

            

                  

         }else if (msg.messageStubType === 27 || msg.messageStubType === 31) {

          

            // welcome

            const tag = '@' + msg.messageStubParameters[0].split('@')[0]

             var gb = await getMessage(msg.key.remoteJid);

            if (gb !== false) {

                if (gb.message.includes('{pp}')) {

                let pp

                try { pp = await conn.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await conn.getProfilePicture(); }

                    var pinkjson = await conn.groupMetadata(msg.key.remoteJid)

                   var time = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]

                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {

                    //created by afnanplk

                await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {thumbnail: fs.readFileSync('./media/image/wel.jpg'), caption:  gb.message.replace('{pp}', '').replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{time}', time).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]} }); });                           

           } else if (gb.message.includes('{gp}')) {

             

             const tag = '@' + msg.messageStubParameters[0].split('@')[0]

             

                let gp

                try { gp = await conn.getProfilePicture(msg.key.remoteJid); } catch { gp = await conn.getProfilePicture(); }

                     var time = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]

                  var rashijson = await conn.groupMetadata(msg.key.remoteJid)

                await axios.get(gp, {responseType: 'arraybuffer'}).then(async (res) => {

                    //created by Raashii

                await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {thumbnail: fs.readFileSync('./media/image/wel.jpg'), caption:  gb.message.replace('{gp}', '').replace('{gphead}', rashijson.subject).replace('{gpmaker}', rashijson.owner).replace('{gpdesc}', rashijson.desc).replace('{owner}', conn.user.name).replace('{time}', time).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]} }); });

} else if (gb.message.includes('{gif}')) {

                   var time = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]

               const tag = '@' + msg.messageStubParameters[0].split('@')[0]

                var plkpinky = await axios.get(config.WEL_GIF, { responseType: 'arraybuffer' })

                var pinkjson = await conn.groupMetadata(msg.key.remoteJid)

                await conn.sendMessage(msg.key.remoteJid, Buffer.from(plkpinky.data), MessageType.video, {thumbnail: fs.readFileSync('./media/image/wel.jpg'), mimetype: Mimetype.gif, caption: gb.message.replace('{gif}', '').replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{time}', time).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]} });

            } else {

              const tag = '@' + msg.messageStubParameters[0].split('@')[0]

              var time = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]

                var pinkjson = await conn.groupMetadata(msg.key.remoteJid)

                    await conn.sendMessage(msg.key.remoteJid,gb.message.replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{time}', time).replace('{mention}', tag),MessageType.text,{ contextInfo: {mentionedJid: [msg.messageStubParameters[0]]}});

            }

          }         

       

            

              return; 

//callblock

    }else if (msg.messageStubType === 45 ||msg.messageStubType === 40 ||msg.messageStubType === 46 || msg.messageStubType === 41) {

  if (config.CALLB == 'true') {

  

     await conn.blockUser(msg.key.remoteJid, "add");

    

  }

  return;

  }

//cntrl and help button response

const _0x28eb32=_0x5c56;function _0x40ec(){const _0x472a77=['𝙲𝙷𝙽𝙶\x20𝙿𝙼\x20𝙱𝙻𝙾𝙲𝙺\x20𝙼𝙾𝙳𝙴','𝙾𝚆𝙽𝙴𝚁\x20𝙲𝙼𝙽𝙳𝚂','0@s.whatsapp.net','text','desc','ORG:','image/jpeg','𝚁𝙴𝚂𝚃𝙰𝚁𝚃','```\x0a\x0a','vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=','toString','test','TEL;type=CELL;type=VOICE;waid=','```\x20\x0a','patch','OFF\x20PMBLOCK','VERSION:3.0\x0a','WORKTYPE','```ONLY\x20WORK\x20AT\x20BOT\x20NUMB\x20VRO🌚```','(((.+)+)+)+$','title','.shutdown','920RojGmC','USE\x20THIS\x20CMND\x20.bgm\x20on','map','ON\x20ZARA_AI','/config-vars',':*\x20```','true','𝙲𝙷𝙰𝙽𝙶𝙴\x20𝚉𝙰𝚁𝙰\x20𝙰𝙸\x20𝙼𝙾𝙳𝙴','❝𝐋𝐎𝐀𝐃𝐈𝐍𝐆❞','𝚃𝚁𝙾𝙻𝙻\x20𝙿𝙰𝙲𝙺','302607FELhfL','bind','*⚠️\x20','ON\x20THERIBLOCK','24qwymog','console','𝚈𝙴𝚂','╭────────────────╮\x0a\x20\x20\x20\x20\x20\x20\x20\x20*ʟᴏɢᴏ\x20ᴍᴀᴋᴇʀ\x20ᴘᴀᴄᴋ*\x0a╰────────────────╯\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a❏\x20*ᴀʟʟ\x20ᴄᴏᴍᴍᴀɴᴅs*\x0a╭────────────────\x0a│\x20▢\x20.ʙʀᴇᴀᴋ\x0a│\x20▢\x20.ɴᴀʀᴜᴛᴏ\x0a│\x20▢\x20.ɢɴᴇᴏɴ\x0a│\x20▢\x20.ʙɴᴇᴏɴ\x0a│\x20▢\x20.ʜᴀᴄᴋ\x0a│\x20▢\x20.ᴅʀᴏᴘ\x0a│\x20▢\x20.ғʟᴏᴡᴇʀ\x0a│\x20▢\x20.sɪʟᴋ\x0a│\x20▢\x20.ғʟᴀᴍᴇ\x0a│\x20▢\x20.sᴍᴏᴋᴇ\x0a│\x20▢\x20.sᴋʏ\x0a│\x20▢\x20.ʙʟᴀᴄᴋᴘɪɴᴋ\x0a│\x20▢\x20.ɴᴇᴏɴ\x0a│\x20▢\x20.ғᴀɴᴄʏ\x0a│\x20▢\x20.ɢʟᴏɢᴏ\x0a│\x20▢\x20.sᴘᴀʀᴋ\x0a╰────────────────\x0a╭────────────────╮\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20*ʟᴏɢᴏ\x20ᴍᴀᴋᴇʀ\x20ᴠ𝟷*\x0a\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20❃ᴢᴀʀᴀᴍᴡᴏʟ❀\x0a╰────────────────╯','1004838PFyHdp','THERI_BLOCK','listResponseMessage','keys','match','FN:','.git','message','BEGIN:VCARD\x0a','\x0a𝙳𝙾\x20𝚈𝙾𝚄\x20𝚁𝙴𝙰𝙻𝚈\x20𝚆𝙰𝙽𝚃\x20𝚃𝙾\x20𝚂𝙷𝚄𝚃𝙳𝙾𝚆𝙽\x20𝚄𝚁\x20𝙱𝙾𝚃','OFF\x20THERIBLOCK','prototype','remoteJid','sendMessage','./events','https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc','dontAddCommandList','╭────────────────╮\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20*ᴛʀᴏʟʟ\x20ᴘᴀᴄᴋ*\x0a╰────────────────╯\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20*ᴄᴏᴍᴍᴀɴᴅs*\x0a❏\x20\x20ᴄᴀᴛ\x20ᴘᴀᴄᴋ\x0a╭────────────────\x0a│\x20▢\x20𝟷ᴄᴀᴛ\x0a│\x20▢\x20𝟸ᴄᴀᴛ\x0a│\x20▢\x20𝟹ᴄᴀᴛ\x0a│\x20▢\x20𝟺ᴄᴀᴛ\x0a│\x20▢\x20𝟻ᴄᴀᴛ\x0a╰────────────────\x0a❏\x20ɢᴜʜᴀɴ\x20ᴘᴀᴄᴋ\x0a╭────────────────\x0a│\x20▢\x20𝟷ɢᴜʜᴀɴ\x0a│\x20▢\x20𝟸ɢᴜʜᴀɴ\x0a│\x20▢\x20𝟹ɢᴜʜᴀɴ\x0a│\x20▢\x20𝟺ɢᴜʜᴀɴ\x0a│\x20▢\x20𝟻ɢᴜʜᴀɴ\x0a╰────────────────\x0a\x20❏\x20sᴇᴅ\x20ᴘᴀᴄᴋ\x0a╭────────────────\x0a│\x20▢\x20𝟷sᴇᴅ\x0a│\x20▢\x20𝟸sᴇᴅ\x0a│\x20▢\x20𝟹sᴇᴅ\x0a│\x20▢\x20𝟺sᴇᴅ\x0a│\x20▢\x20𝟻sᴇᴅ\x0a╰────────────────\x0a╭────────────────╮\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20*ᴛʀᴏʟʟ\x20ᴘᴀᴄᴋ\x20ᴠ𝟷*\x0a╰────────────────╯','log','\x0a𝙳𝙾\x20𝚈𝙾𝚄\x20𝚁𝙴𝙰𝙻𝚈\x20𝚆𝙰𝙽𝚃\x20𝚃𝙾\x20𝙲𝙷𝙰𝙽𝙶𝙴\x20𝚆𝙾𝚁𝙺𝚃𝚈𝙿𝙴\x20𝚃𝙾\x20-\x20*','WARN','exception','\x0a𝙳𝙾\x20𝚈𝙾𝚄\x20𝚁𝙴𝙰𝙻𝚈\x20𝚆𝙰𝙽𝚃\x20𝚃𝙾\x20*','pattern','BGMFILTER','ON\x20ANTILINK','2259425HxihsB','length','```https://github.com/Jokerser-x-Raashii/Zaramwol```','ZARA_AI','__proto__','STICKERP','{}.constructor(\x22return\x20this\x22)(\x20)','𝚇\x20𝙼𝙴𝙳𝙸𝙰','buttonsMessage','𝙲𝙷𝙰𝙽𝙶𝙴\x20𝙼𝙾𝙳𝙴\x20𝙾𝙵\x20𝙰𝚄𝚃𝙾\x20𝙱𝙶𝙼','key','USE\x20THIS\x20CMND\x20.austick\x20off','ON\x20THERIKICK','\x0a\x20```XMEDIA\x20COMMANDS\x20ARE\x20👇```\x20\x0a\x0a\x20\x20\x20\x20\x0a\x0a💻Usage:\x20*.mp4enhance*\x0aℹ️Desc:Enhance\x20video’s\x20quality.\x0a\x0a💻Usage:\x20*.interp*\x0aℹ️Desc:Increases\x20the\x20FPS\x20of\x20the\x20video.\x0a\x0a💻Usage:\x20*.mp4slowmo*\x0aℹ️Desc:Applies\x20true-slowmo\x20to\x20non-slow\x20motion\x20videos.\x0a\x0a💻Usage:\x20*.x4mp4*\x0aℹ️Desc:Reduce\x20video’s\x20quality\x20by\x2075%.\x0a\x0a💻Usage:\x20*.x2mp4*\x0aℹ️Desc:\x20Reduce\x20video’s\x20quality\x20by\x2050%.\x0a\x0a💻Usage:\x20*.gif*\x0aℹ️Desc:Converts\x20video\x20to\x20gif.\x0a\x0a💻Usage:\x20*.agif*\x0aℹ️Desc:Converts\x20video\x20to\x20voiced\x20gif.\x0a\x0a💻Usage:\x20*.mp4blur*\x0aℹ️Desc:\x20Blurs\x20the\x20background\x20of\x20the\x20video.\x0a\x0a💻Usage:\x20*.mp4stab*\x0aℹ️Desc:\x20Decreases\x20the\x20vibration\x20of\x20the\x20video.\x0a\x0a💻Usage:\x20*.mp4rainbow*\x0aℹ️Desc:\x20Applies\x20a\x20rainbow\x20effect\x20to\x20video.\x0a\x0a💻Usage:\x20*.mp4color*\x0aℹ️Desc:Makes\x20the\x20colors\x20of\x20the\x20video\x20more\x20vivid\x20and\x20beautiful.\x0a\x0a💻Usage:\x20*.mp4art*\x0aℹ️Desc:Applies\x20a\x20art\x20effect\x20to\x20the\x20video.\x0a\x0a💻Usage:\x20*.mp4negative*\x0aℹ️Desc:Applies\x20a\x20negative\x20color\x20filter\x20to\x20the\x20video.\x0a\x0a💻Usage:\x20*.mp4vintage*\x0aℹ️Desc:Applies\x20a\x20nostalgic\x20effect\x20to\x20video.\x0a\x0a💻Usage:\x20*.mp4bw*\x0aℹ️Desc:\x20Applies\x20a\x20monochrome\x20effect\x20to\x20video.\x0a\x0a💻Usage:\x20*.mp4reverse*\x0aℹ️Desc:\x20Plays\x20the\x20video\x20in\x20reverse.\x0a\x0a💻Usage:\x20*.mp4edge*\x0aℹ️Desc:Applies\x20a\x20edge\x20effect\x20to\x20the\x20video.\x0a\x0a💻Usage:\x20*.mp4image*\x0aℹ️Desc:\x20Converts\x20photo\x20to\x205\x20sec\x20video.\x0a\x0a💻Usage:\x20*.spectrum*\x0aℹ️Desc:\x20Converts\x20the\x20spectrum\x20of\x20sound\x20into\x20video.\x0a\x0a💻Usage:\x20*.waves*\x0aℹ️Desc:\x20Converts\x20the\x20wave\x20range\x20of\x20sound\x20to\x20video.\x0a\x0a💻Usage:\x20*.frequency*\x0aℹ️Desc:\x20Converts\x20the\x20frequency\x20range\x20of\x20sound\x20to\x20video.\x0a\x0a💻Usage:\x20*.avec*\x0aℹ️Desc:\x20Converts\x20the\x20histogram\x20of\x20sound\x20to\x20video.\x0a\x0a💻Usage:\x20*.volumeaudio*\x0aℹ️Desc:\x20Converts\x20the\x20decibel\x20value\x20of\x20the\x20sound\x20into\x20video.\x0a\x0a💻Usage:\x20*.cqtaudio*\x0aℹ️Desc:\x20Converts\x20the\x20CQT\x20value\x20of\x20audio\x20to\x20video.\x0a\x0a💻Usage:\x20*.mp3eq*\x0aℹ️Desc:\x20Adjusts\x20the\x20sound\x20to\x20a\x20crystal\x20clear\x20level.\x0a\x0a💻Usage:\x20*.mp3crusher*\x0aℹ️Desc:Distorts\x20the\x20sound,\x20makes\x20ridiculous.\x0a\x0a💻Usage:\x20*.mp3reverse*\x0aℹ️Desc:Plays\x20the\x20sound\x20in\x20reverse.\x0a\x0a💻Usage:\x20*.mp3pitch*\x0aℹ️Desc:Makes\x20the\x20sound\x20thinner\x20and\x20faster.\x0a\x0a💻Usage\x20*.mp3low*\x0aℹ️Desc:Makes\x20the\x20sound\x20deep\x20and\x20slower.\x0a\x0a💻Usage:\x20*.x2mp3*\x0aℹ️Desc:\x20\x20Makes\x20the\x20sound\x20twice\x20as\x20fast.\x0a\x0a💻Usage:\x20*.mp3volume*\x0aℹ️Desc:\x20🇹🇷\x20Ses\x20seviyesini\x20fazalca\x20arttırır.\x0a🇬🇧\x20Increase\x20sound\x20level\x20so\x20much.\x0a\x0a💻Usage:\x20*.bwimage*\x0aℹ️Desc:\x20🇹🇷\x20Fotoğrafa\x20monochrome\x20efekti\x20uygular.\x0a🇬🇧\x20Applies\x20a\x20monochrome\x20effect\x20to\x20image.\x0a\x0a💻Usage:\x20*.vintageimage*\x0aℹ️Desc:\x20🇹🇷\x20Fotoğrafa\x20vintage\x20efekti\x20uygular.\x0a🇬🇧\x20Applies\x20a\x20vinatge\x20effect\x20to\x20video.\x0a\x0a💻Usage:\x20*.edgeimage*\x0aℹ️Desc:\x20🇹🇷\x20Fotoğrafa\x20edge\x20efekti\x20uygular.\x0a🇬🇧\x20Applies\x20a\x20edge\x20effect\x20to\x20the\x20photo.\x0a\x0a💻Usage:\x20*.enhanceimage*\x0aℹ️Desc:\x20🇹🇷\x20Fotoğrafı\x20daha\x20net\x20hale\x20getirir.\x0a🇬🇧\x20Makes\x20the\x20photo\x20clearer.\x0a\x0a💻Usage:\x20*.blurimage*\x0aℹ️Desc:\x20🇹🇷\x20Fotoğrafın\x20arka\x20planını\x20bulanıklaştırır.\x0a🇬🇧\x20Blurs\x20the\x20background\x20of\x20the\x20photo.\x0a\x0a💻Usage:\x20*.grenimage*\x0aℹ️Desc:\x20🇹🇷\x20Fotoğrafa\x20gren\x20efekti\x20uygular.\x0a🇬🇧\x20Applies\x20grain\x20effect\x20to\x20the\x20photo.\x0a\x0a💻Usage:\x20*.negativeimage*\x0aℹ️Desc:\x20🇹🇷\x20Fotoğrafa\x20negatif\x20renk\x20filtresi\x20uygular.\x0a🇬🇧\x20Applies\x20a\x20negative\x20color\x20filter\x20to\x20the\x20photo.\x0a\x0a💻Usage:\x20*.rainbowimage*\x0aℹ️Desc:\x20🇹🇷\x20Fotoğrafa\x20gökkuşağı\x20efekti\x20uygular.\x0a🇬🇧\x20Applies\x20rainbow\x20effect\x20to\x20the\x20photo.\x0a\x0a💻Usage:\x20*.colorimage*\x0aℹ️Desc:\x20🇹🇷\x20Fotoğrafın\x20renklerini\x20daha\x20canlı\x20ve\x20çekici\x20yapar.\x0a🇬🇧\x20It\x20makes\x20the\x20colors\x20of\x20the\x20photo\x20more\x20vivid\x20and\x20attractive.\x0a\x0a💻Usage:\x20*.artimage*\x0aℹ️Desc:\x20🇹🇷\x20Fotoğrafa\x20çizim\x20efekti\x20uygular.\x0a🇬🇧\x20Applies\x20a\x20art\x20effect\x20to\x20the\x20photo.','search','catch','apply','OFF\x20ZARA_AI','\x20```','𝙲𝙷𝙽𝙶\x20𝚃𝙷𝙴𝚁𝙸\x20𝙱𝙻𝙾𝙲𝙺\x20𝙼𝙾𝙳𝙴','commands','get','ON\x20PMBLOCK','ANTİ_LİNK',':\x20```','717KZKGHL','12EpJGTQ','148ulZqXQ','warn','Owner','```\x20\x0a\x0a','*⌨︎','𝙲𝙷𝙰𝙽𝙶𝙴\x20𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺\x20𝙼𝙾𝙳𝙴','error','```CMNDS\x20OF```\x20','private','status@broadcast','OFF\x20ANTILINK','9077750jvfNxC','PHONE','USE\x20THIS\x20CMND\x20.austick\x20on','buttonsResponseMessage','PM_BLOCK','```\x0a','THERI_KICK_PM','1312360QusFZE','157565qyareG','𝙰𝙻𝙻\x20𝙲𝙼𝙽𝙳𝚂','public','return\x20(function()\x20','BOTPLK','.restart','DESC','usage','USE\x20THIS\x20CMND\x20.bgm\x20off','fromMe','EXAMPLE','false','HANDLERS','OFF\x20THERIKICK','then','REMOVE2','ok\x20bye\x20🙂','selectedButtonId','\x0a\x0a\x20\x20\x0a','ANTİLİNK','♲︎︎︎\x20','constructor','```PERFECT\x20OKEY\x20🙂```','END:VCARD'];_0x40ec=function(){return _0x472a77;};return _0x40ec();}(function(_0x2f1e9e,_0x497e96){const _0x3bfaaf=_0x5c56,_0x3bc2a8=_0x2f1e9e();while(!![]){try{const _0x2bce52=parseInt(_0x3bfaaf(0xfa))/0x1+-parseInt(_0x3bfaaf(0xe8))/0x2*(-parseInt(_0x3bfaaf(0xa5))/0x3)+-parseInt(_0x3bfaaf(0xa7))/0x4*(-parseInt(_0x3bfaaf(0xba))/0x5)+parseInt(_0x3bfaaf(0xa6))/0x6*(-parseInt(_0x3bfaaf(0x8c))/0x7)+parseInt(_0x3bfaaf(0xf6))/0x8*(parseInt(_0x3bfaaf(0xf2))/0x9)+-parseInt(_0x3bfaaf(0xb9))/0xa+-parseInt(_0x3bfaaf(0xb2))/0xb;if(_0x2bce52===_0x497e96)break;else _0x3bc2a8['push'](_0x3bc2a8['shift']());}catch(_0x101e02){_0x3bc2a8['push'](_0x3bc2a8['shift']());}}}(_0x40ec,0xbe548));const _0x4d7e06=(function(){let _0x2ea9be=!![];return function(_0x16632f,_0x23536d){const _0x9534da=_0x2ea9be?function(){const _0x48bfa8=_0x5c56;if(_0x23536d){const _0x29ce50=_0x23536d[_0x48bfa8(0x9c)](_0x16632f,arguments);return _0x23536d=null,_0x29ce50;}}:function(){};return _0x2ea9be=![],_0x9534da;};}()),_0x4428bf=_0x4d7e06(this,function(){const _0x36c1c9=_0x5c56;return _0x4428bf[_0x36c1c9(0xdc)]()[_0x36c1c9(0x9a)](_0x36c1c9(0xe5))['toString']()[_0x36c1c9(0xcf)](_0x4428bf)[_0x36c1c9(0x9a)](_0x36c1c9(0xe5));});_0x4428bf();const _0x15eb14=(function(){let _0x4bd8a8=!![];return function(_0x6a9508,_0x6fd5c1){const _0x49ca6d=_0x4bd8a8?function(){const _0x59e8d9=_0x5c56;if(_0x6fd5c1){const _0x4222d1=_0x6fd5c1[_0x59e8d9(0x9c)](_0x6a9508,arguments);return _0x6fd5c1=null,_0x4222d1;}}:function(){};return _0x4bd8a8=![],_0x49ca6d;};}()),_0x4cdd79=_0x15eb14(this,function(){const _0x56ea0c=_0x5c56,_0x10153b=function(){const _0x442e07=_0x5c56;let _0x30f194;try{_0x30f194=Function(_0x442e07(0xbd)+_0x442e07(0x92)+');')();}catch(_0x34dc13){_0x30f194=window;}return _0x30f194;},_0xab784e=_0x10153b(),_0x40972=_0xab784e[_0x56ea0c(0xf7)]=_0xab784e[_0x56ea0c(0xf7)]||{},_0x531b24=[_0x56ea0c(0x84),_0x56ea0c(0xa8),'info',_0x56ea0c(0xad),_0x56ea0c(0x87),'table','trace'];for(let _0x4391bf=0x0;_0x4391bf<_0x531b24[_0x56ea0c(0x8d)];_0x4391bf++){const _0x19d063=_0x15eb14[_0x56ea0c(0xcf)][_0x56ea0c(0x7d)][_0x56ea0c(0xf3)](_0x15eb14),_0x5c5664=_0x531b24[_0x4391bf],_0x12c99b=_0x40972[_0x5c5664]||_0x19d063;_0x19d063[_0x56ea0c(0x90)]=_0x15eb14['bind'](_0x15eb14),_0x19d063[_0x56ea0c(0xdc)]=_0x12c99b[_0x56ea0c(0xdc)]['bind'](_0x12c99b),_0x40972[_0x5c5664]=_0x19d063;}});_0x4cdd79();const type=Object[_0x28eb32(0x75)](msg[_0x28eb32(0x79)])[0x0],Code=_0x28eb32(0x83),lpack=_0x28eb32(0xf9),owt='\x0a\x20```\x20BOT\x20OWNER\x20COMMANDS\x20ARE\x20👇```\x20\x0a\x0a\x20\x20\x20\x20\x0a\x0a💠\x20Command:\x20!install\x0a🧩\x20Description:\x20Install\x20external\x20plugins.\x0a\x0a💠\x20Command:\x20!plugin\x0a🧩\x20Description:\x20Shows\x20the\x20plugins\x20you\x20have\x20installed.\x0a\x0a💠\x20Command:\x20!remove\x0a🧩\x20Description:\x20Removes\x20the\x20plugin.\x0a\x0a💠\x20Command:\x20!ban\x0a🧩\x20Description:\x20Ban\x20someone\x20in\x20the\x20group.\x20Reply\x20to\x20message\x20or\x20tag\x20a\x20person\x20to\x20use\x20command.\x0a\x0a💠\x20Command:\x20!add\x0a🧩\x20Description:\x20Adds\x20someone\x20to\x20the\x20group.\x0a\x0a💠\x20Command:\x20!promote\x0a🧩\x20Description:\x20Makes\x20any\x20person\x20an\x20admin.\x0a\x0a💠\x20Command:\x20!demote\x0a🧩\x20Description:\x20Takes\x20the\x20authority\x20of\x20any\x20admin.\x0a\x0a💠\x20Command:\x20!mute\x0a🧩\x20Description:\x20Mute\x20the\x20group\x20chat.\x20Only\x20the\x20admins\x20can\x20send\x20a\x20message.\x0a\x0a💠\x20Command:\x20!unmute\x0a🧩\x20Description:\x20Unmute\x20the\x20group\x20chat.\x20Anyone\x20can\x20send\x20a\x20message.\x0a\x0a💠\x20Command:\x20!invite\x0a🧩\x20Description:\x20Provides\x20the\x20groups\x20invitation\x20link.\x0a\x0a💠\x20Command:\x20!afk\x0a🧩\x20Description:\x20It\x20makes\x20you\x20AFK\x20-\x20Away\x20From\x20Keyboard.\x0a\x0a💠\x20Command:\x20!del\x0a🧩\x20Description:\x20Deletes\x20The\x20Replied\x20Message\x20Send\x20By\x20The\x20Bot\x20[\x20✅\x20Official\x20External\x20Plugin\x20]\x0a\x0a💠\x20Command:\x20!justspam\x0a🧩\x20Description:\x20spam\x20the\x20sticker\x20you\x20replyed.\x0a\x0a💠\x20Command:\x20!welcome\x0a🧩\x20Description:\x20It\x20sets\x20the\x20welcome\x20message.\x20If\x20you\x20leave\x20it\x20blank\x20it\x20shows\x20the\x20welcome\x20message.\x0a\x0a💠\x20Command:\x20!goodbye\x0a🧩\x20Description:\x20Sets\x20the\x20goodbye\x20message.\x20If\x20you\x20leave\x20blank,\x20it\x20shows\x20the\x20goodbye\x20message\x0a\x0a💠\x20Command:\x20!phelp\x0a🧩\x20Description:\x20Gives\x20information\x20about\x20using\x20the\x20bot\x20from\x20the\x20Help\x20menu.\x0a\x0a💠\x20Command:\x20!degis\x0a\x0a💠\x20Command:\x20!restart\x0a🧩\x20Description:\x20Restart\x20Zara\x0a\x0a💠\x20Command:\x20!shutdown\x0a🧩\x20Description:\x20Shutdown\x20Zara\x0a\x0a💠\x20Command:\x20!dyno\x0a🧩\x20Description:\x20Check\x20heroku\x20dyno\x20usage\x0a\x0a💠\x20Command:\x20!setvar\x0a🧩\x20Description:\x20Set\x20heroku\x20config\x20var\x0a\x0a💠\x20Command:\x20!delvar\x0a🧩\x20Description:\x20Delete\x20heroku\x20config\x20var\x0a\x0a💠\x20Command:\x20!getvar\x0a🧩\x20Description:\x20Get\x20heroku\x20config\x20var\x0a\x0a💠\x20Command:\x20!leave\x0a🧩\x20Description:\x20It\x20kicks\x20you\x20from\x20the\x20group\x20you\x20are\x20using\x20it\x20in.\x0a\x0a💠\x20Command:\x20!pp\x0a🧩\x20Description:\x20Makes\x20the\x20profile\x20photo\x20what\x20photo\x20you\x20reply.\x0a\x0a💠\x20Command:\x20!block\x0a🧩\x20Description:\x20Block\x20user.\x0a\x0a💠\x20Command:\x20!unblock\x0a🧩\x20Description:\x20Unblock\x20user.\x0a\x0a💠\x20Command:\x20!jid\x0a🧩\x20Description:\x20Giving\x20users\x20JID.\x0a\x0a💠\x20Command:\x20!scam\x0a🧩\x20Description:\x20Creates\x205\x20minutes\x20of\x20fake\x20actions.\x0a\x0a💠\x20Command:\x20!spam\x5cn🧩\x20Description:\x20It\x20spam\x20until\x20you\x20stop\x20it.\x0a⌨️\x20Example:\x20.spam\x20test\x0a\x0a💠\x20Command:\x20!filtre\x0a🧩\x20Description:\x20add\x20filtre\x20in\x20chats\x0aeg:\x20.filter\x20\x22input\x22\x20\x22output\x22\x0a\x0a💠\x20Command:\x20!tagall\x0a🧩\x20Description:\x20Tags\x20everyone\x20in\x20the\x20group.\x0a\x0a💠\x20Command:\x20!stam\x0a🧩\x20Description:\x20sends\x20the\x20replyed\x20messages\x20to\x20all\x20the\x20members\x20in\x20the\x20group\x20\x0a\x0a💠\x20Command:\x20!update\x0a🧩\x20Description:\x20Checks\x20the\x20update.\x0a\x0a💠\x20Command:\x20update\x20now\x0a🧩\x20Description:\x20It\x20makes\x20updates.',xmt=_0x28eb32(0x99),purl=await getBuffer(zara['LOGO']),verq={'key':{'fromMe':![],'participant':_0x28eb32(0xd4),...msg[_0x28eb32(0x96)][_0x28eb32(0x7e)]?{'remoteJid':_0x28eb32(0xb0)}:{}},'message':{'imageMessage':{'url':_0x28eb32(0x81),'mimetype':_0x28eb32(0xd8),'caption':Config['BOTPLK'],'fileSha256':'+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=','fileLength':'28777','height':0x438,'width':0x437,'mediaKey':_0x28eb32(0xdb),'fileEncSha256':'sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=','directPath':'/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69','mediaKeyTimestamp':'1610993486','jpegThumbnail':purl}}},Button=type==_0x28eb32(0xb5)?msg[_0x28eb32(0x79)]['buttonsResponseMessage'][_0x28eb32(0xcb)]:'',selectedButton=type==_0x28eb32(0x74)?msg[_0x28eb32(0x79)][_0x28eb32(0x74)][_0x28eb32(0xe6)]:'';switch(Button){case _0x28eb32(0xe1):if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],'```ONLY\x20WORK\x20AT\x20BOT\x20NUMB\x20VRO🌚```',MessageType['text']);await heroku[_0x28eb32(0xe0)](baseURI+_0x28eb32(0xec),{'body':{[_0x28eb32(0xb6)]:'false'}}),await conn['sendMessage'](msg[_0x28eb32(0x96)]['remoteJid'],'```PERFECT\x20OKEY\x20🙂```',MessageType[_0x28eb32(0xd5)]);return;case _0x28eb32(0xa2):if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)]['remoteJid'],_0x28eb32(0xe4),MessageType[_0x28eb32(0xd5)]);await heroku['patch'](baseURI+'/config-vars',{'body':{[_0x28eb32(0xb6)]:_0x28eb32(0xee)}}),await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xd0),MessageType[_0x28eb32(0xd5)]);return;case _0x28eb32(0x7c):if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType[_0x28eb32(0xd5)]);await heroku[_0x28eb32(0xe0)](baseURI+_0x28eb32(0xec),{'body':{[_0x28eb32(0x73)]:'false'}}),await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xd0),MessageType[_0x28eb32(0xd5)]);return;case _0x28eb32(0xc7):if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn['sendMessage'](msg[_0x28eb32(0x96)]['remoteJid'],'```ONLY\x20WORK\x20AT\x20BOT\x20NUMB\x20VRO🌚```',MessageType[_0x28eb32(0xd5)]);await heroku['patch'](baseURI+'/config-vars',{'body':{[_0x28eb32(0xb8)]:_0x28eb32(0xc5)}}),await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xd0),MessageType[_0x28eb32(0xd5)]);return;case _0x28eb32(0x9d):if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn['sendMessage'](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType[_0x28eb32(0xd5)]);await heroku['patch'](baseURI+_0x28eb32(0xec),{'body':{[_0x28eb32(0x8f)]:_0x28eb32(0xc5)}}),await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xd0),MessageType[_0x28eb32(0xd5)]);return;case _0x28eb32(0xb1):if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],'```ONLY\x20WORK\x20AT\x20BOT\x20NUMB\x20VRO🌚```',MessageType[_0x28eb32(0xd5)]);await heroku[_0x28eb32(0xe0)](baseURI+_0x28eb32(0xec),{'body':{[_0x28eb32(0xa3)]:_0x28eb32(0xc5)}}),await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xd0),MessageType[_0x28eb32(0xd5)]);return;case'ON\x20THERIBLOCK':if(!msg['key'][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg['key']['remoteJid'],_0x28eb32(0xe4),MessageType['text']);await heroku[_0x28eb32(0xe0)](baseURI+_0x28eb32(0xec),{'body':{[_0x28eb32(0x73)]:'true'}}),await conn['sendMessage'](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xd0),MessageType['text']);return;case _0x28eb32(0x98):if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg['key'][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType[_0x28eb32(0xd5)]);await heroku[_0x28eb32(0xe0)](baseURI+_0x28eb32(0xec),{'body':{['THERI_KICK_PM']:_0x28eb32(0xee)}}),await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xd0),MessageType[_0x28eb32(0xd5)]);return;case _0x28eb32(0x8b):if(!msg[_0x28eb32(0x96)]['fromMe'])return await conn[_0x28eb32(0x7f)](msg['key'][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType[_0x28eb32(0xd5)]);await heroku[_0x28eb32(0xe0)](baseURI+_0x28eb32(0xec),{'body':{['ANTİLİNK']:_0x28eb32(0xee)}}),await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xd0),MessageType[_0x28eb32(0xd5)]);return;case _0x28eb32(0xeb):if(!msg['key'][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType[_0x28eb32(0xd5)]);await heroku[_0x28eb32(0xe0)](baseURI+'/config-vars',{'body':{[_0x28eb32(0x8f)]:'true'}}),await conn['sendMessage'](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xd0),MessageType['text']);return;case _0x28eb32(0xaf):if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg['key'][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType[_0x28eb32(0xd5)]);await heroku['patch'](baseURI+_0x28eb32(0xec),{'body':{['WORK_TYPE']:_0x28eb32(0xaf)}}),await conn[_0x28eb32(0x7f)](msg['key'][_0x28eb32(0x7e)],_0x28eb32(0xd0),MessageType[_0x28eb32(0xd5)]);return;case'public':if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn['sendMessage'](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType[_0x28eb32(0xd5)]);await heroku[_0x28eb32(0xe0)](baseURI+_0x28eb32(0xec),{'body':{['WORK_TYPE']:_0x28eb32(0xbc)}}),await conn['sendMessage'](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xd0),MessageType[_0x28eb32(0xd5)]);return;case _0x28eb32(0xe7):if(!msg[_0x28eb32(0x96)]['fromMe'])return await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType[_0x28eb32(0xd5)]);await heroku[_0x28eb32(0xa1)](baseURI+'/formation')[_0x28eb32(0xc8)](async _0x495b5b=>{const _0x417ae6=_0x28eb32;forID=_0x495b5b[0x0]['id'],await conn[_0x417ae6(0x7f)](msg[_0x417ae6(0x96)][_0x417ae6(0x7e)],_0x417ae6(0xca),MessageType[_0x417ae6(0xd5)]),await heroku['patch'](baseURI+'/formation/'+forID,{'body':{'quantity':0x0}});})[_0x28eb32(0x9b)](async _0x107c94=>{const _0x583108=_0x28eb32;await conn['sendMessage'](msg['key']['remoteJid'],_0x107c94[_0x583108(0x79)],MessageType[_0x583108(0xd5)]);});return;case _0x28eb32(0xbf):await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],'restarting🌚',MessageType[_0x28eb32(0xd5)]),console[_0x28eb32(0x84)](baseURI),await heroku['delete'](baseURI+'/dynos')['catch'](async _0x33e087=>{const _0x126274=_0x28eb32;await conn[_0x126274(0x7f)](msg[_0x126274(0x96)]['remoteJid'],_0x33e087[_0x126274(0x79)],MessageType[_0x126274(0xd5)]);});return;case'.number':const vcont=_0x28eb32(0x7a)+_0x28eb32(0xe2)+_0x28eb32(0x77)+config['PLK']+'\x0a'+_0x28eb32(0xd7)+zara[_0x28eb32(0xc0)]+';\x0a'+_0x28eb32(0xde)+zara[_0x28eb32(0xb3)]+':'+zara['PHONE']+'\x20\x0a'+_0x28eb32(0xd1);await conn['sendMessage'](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],{'displayname':_0x28eb32(0xa9),'vcard':vcont},MessageType['contact'],{'quoted':verq});return;case _0x28eb32(0x78):await conn['sendMessage'](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0x8e),MessageType[_0x28eb32(0xd5)]);return;}function _0x5c56(_0x4966a9,_0x1b576b){const _0x8d6684=_0x40ec();return _0x5c56=function(_0x4cdd79,_0x15eb14){_0x4cdd79=_0x4cdd79-0x73;let _0x44a12b=_0x8d6684[_0x4cdd79];return _0x44a12b;},_0x5c56(_0x4966a9,_0x1b576b);}switch(selectedButton){case _0x28eb32(0xd2):if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn['sendMessage'](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType[_0x28eb32(0xd5)]);var pbb='';if(zara['PM_BLOCK']==_0x28eb32(0xee))pbb='OFF\x20PMBLOCK';if(zara[_0x28eb32(0xb6)]==_0x28eb32(0xc5))pbb='ON\x20PMBLOCK';const pbuttons=[{'buttonId':pbb,'buttonText':{'displayText':_0x28eb32(0xf8)},'type':0x1}],pbuttonMessage={'contentText':_0x28eb32(0x88)+pbb+'*','footerText':zara[_0x28eb32(0xc0)],'buttons':pbuttons,'headerType':0x1};await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],pbuttonMessage,MessageType[_0x28eb32(0x94)]);return;case _0x28eb32(0x9f):if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType['text']);var tbb='';if(zara[_0x28eb32(0x73)]==_0x28eb32(0xee))tbb=_0x28eb32(0x7c);if(zara[_0x28eb32(0x73)]==_0x28eb32(0xc5))tbb=_0x28eb32(0xf5);const tbuttons=[{'buttonId':tbb,'buttonText':{'displayText':_0x28eb32(0xf8)},'type':0x1}],tbuttonMessage={'contentText':_0x28eb32(0x88)+tbb+'*','footerText':zara[_0x28eb32(0xc0)],'buttons':tbuttons,'headerType':0x1};await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],tbuttonMessage,MessageType[_0x28eb32(0x94)]);return;case'𝙲𝙷𝙽𝙶\x20𝚃𝙷𝙴𝚁𝙸\x20𝙺𝙸𝙲𝙺\x20𝙼𝙾𝙳𝙴':if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg['key'][_0x28eb32(0x7e)],'```ONLY\x20WORK\x20AT\x20BOT\x20NUMB\x20VRO🌚```',MessageType[_0x28eb32(0xd5)]);var tkb='';if(zara[_0x28eb32(0xc9)]==_0x28eb32(0xee))tkb=_0x28eb32(0xc7);if(zara['REMOVE2']==_0x28eb32(0xc5))tkb=_0x28eb32(0x98);const tkbuttons=[{'buttonId':tkb,'buttonText':{'displayText':_0x28eb32(0xf8)},'type':0x1}],tkbuttonMessage={'contentText':_0x28eb32(0x88)+tkb+'*','footerText':zara[_0x28eb32(0xc0)],'buttons':tkbuttons,'headerType':0x1};await conn[_0x28eb32(0x7f)](msg['key'][_0x28eb32(0x7e)],tkbuttonMessage,MessageType[_0x28eb32(0x94)]);return;case'𝙲𝙷𝙰𝙽𝙶𝙴\x20𝙼𝙾𝙳𝙴\x20𝙾𝙵\x20𝙰𝚄𝚃𝙾\x20𝚂𝚃𝙸𝙲𝙺𝙴𝚁':if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn['sendMessage'](msg['key'][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType[_0x28eb32(0xd5)]);var sbb='';if(config['STICKERP']==_0x28eb32(0xee))sbb=_0x28eb32(0x97);if(config[_0x28eb32(0x91)]==_0x28eb32(0xc5))sbb=_0x28eb32(0xb4);await conn['sendMessage'](msg[_0x28eb32(0x96)]['remoteJid'],sbb,MessageType[_0x28eb32(0xd5)]);return;case _0x28eb32(0x95):if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn['sendMessage'](msg['key'][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType[_0x28eb32(0xd5)]);var bb='';if(config[_0x28eb32(0x8a)]==_0x28eb32(0xee))bb=_0x28eb32(0xc2);if(config[_0x28eb32(0x8a)]==_0x28eb32(0xc5))bb=_0x28eb32(0xe9);await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],bb,MessageType[_0x28eb32(0xd5)]);return;case _0x28eb32(0xef):if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],'```ONLY\x20WORK\x20AT\x20BOT\x20NUMB\x20VRO🌚```',MessageType[_0x28eb32(0xd5)]);var zb='';if(config[_0x28eb32(0x8f)]==_0x28eb32(0xee))zb=_0x28eb32(0x9d);if(config[_0x28eb32(0x8f)]==_0x28eb32(0xc5))zb=_0x28eb32(0xeb);const zbuttons=[{'buttonId':zb,'buttonText':{'displayText':_0x28eb32(0xf8)},'type':0x1}],zbuttonMessage={'contentText':_0x28eb32(0x88)+zb+'*','footerText':zara[_0x28eb32(0xc0)],'buttons':zbuttons,'headerType':0x1};await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)]['remoteJid'],zbuttonMessage,MessageType[_0x28eb32(0x94)]);return;case _0x28eb32(0xac):if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType[_0x28eb32(0xd5)]);var ab='';if(config[_0x28eb32(0xcd)]==_0x28eb32(0xee))ab='OFF\x20ANTILINK';if(config[_0x28eb32(0xcd)]==_0x28eb32(0xc5))ab=_0x28eb32(0x8b);const abuttons=[{'buttonId':ab,'buttonText':{'displayText':_0x28eb32(0xf8)},'type':0x1}],abuttonMessage={'contentText':'\x0a𝙳𝙾\x20𝚈𝙾𝚄\x20𝚁𝙴𝙰𝙻𝚈\x20𝚆𝙰𝙽𝚃\x20𝚃𝙾\x20*'+ab+'*','footerText':zara[_0x28eb32(0xc0)],'buttons':abuttons,'headerType':0x1};await conn[_0x28eb32(0x7f)](msg['key'][_0x28eb32(0x7e)],abuttonMessage,MessageType[_0x28eb32(0x94)]);return;case'𝙲𝙷𝙰𝙽𝙶𝙴\x20𝚆𝙾𝚁𝙺𝚃𝚈𝙿𝙴':if(!msg['key']['fromMe'])return await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType['text']);var wb='';if(config[_0x28eb32(0xe3)]=='public')wb=_0x28eb32(0xaf);if(config['WORKTYPE']=='private')wb=_0x28eb32(0xbc);const wbuttons=[{'buttonId':wb,'buttonText':{'displayText':'𝚈𝙴𝚂'},'type':0x1}],wbuttonMessage={'contentText':_0x28eb32(0x85)+wb+'*','footerText':zara['DESC'],'buttons':wbuttons,'headerType':0x1};await conn[_0x28eb32(0x7f)](msg['key'][_0x28eb32(0x7e)],wbuttonMessage,MessageType[_0x28eb32(0x94)]);return;case _0x28eb32(0xd9):if(!msg['key'][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],'```ONLY\x20WORK\x20AT\x20BOT\x20NUMB\x20VRO🌚```',MessageType[_0x28eb32(0xd5)]);const rbuttons=[{'buttonId':_0x28eb32(0xbf),'buttonText':{'displayText':'𝚈𝙴𝚂'},'type':0x1}],rbuttonMessage={'contentText':'\x0a𝙳𝙾\x20𝚈𝙾𝚄\x20𝚁𝙴𝙰𝙻𝚈\x20𝚆𝙰𝙽𝚃\x20𝚃𝙾\x20𝚁𝙴𝚂𝚃𝙰𝚁𝚃\x20𝚄𝚁\x20𝙱𝙾𝚃','footerText':zara[_0x28eb32(0xc0)],'buttons':rbuttons,'headerType':0x1};await conn[_0x28eb32(0x7f)](msg['key'][_0x28eb32(0x7e)],rbuttonMessage,MessageType[_0x28eb32(0x94)]);return;case'𝚂𝙷𝚄𝚃\x20𝙳𝙾𝚆𝙽':if(!msg[_0x28eb32(0x96)][_0x28eb32(0xc3)])return await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xe4),MessageType['text']);const sbuttons=[{'buttonId':_0x28eb32(0xe7),'buttonText':{'displayText':_0x28eb32(0xf8)},'type':0x1}],sbuttonMessage={'contentText':_0x28eb32(0x7b),'footerText':zara[_0x28eb32(0xc0)],'buttons':buttons,'headerType':0x1};await conn[_0x28eb32(0x7f)](msg['key'][_0x28eb32(0x7e)],sbuttonMessage,MessageType[_0x28eb32(0x94)]);return;case _0x28eb32(0xf1):await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],_0x28eb32(0xf0),MessageType['text']),await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],Code,MessageType['text'],{'quoted':verq});return;case'𝙻𝙾𝙶𝙾\x20𝙿𝙰𝙲𝙺':await conn[_0x28eb32(0x7f)](msg['key']['remoteJid'],_0x28eb32(0xf0),MessageType[_0x28eb32(0xd5)]),await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)]['remoteJid'],lpack,MessageType[_0x28eb32(0xd5)],{'quoted':verq});return;case _0x28eb32(0xd3):await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)]['remoteJid'],_0x28eb32(0xf0),MessageType['text']),await conn['sendMessage'](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],owt,MessageType[_0x28eb32(0xd5)],{'quoted':verq});return;case _0x28eb32(0x93):await conn['sendMessage'](msg[_0x28eb32(0x96)]['remoteJid'],_0x28eb32(0xf0),MessageType[_0x28eb32(0xd5)]),await conn[_0x28eb32(0x7f)](msg[_0x28eb32(0x96)][_0x28eb32(0x7e)],xmt,MessageType[_0x28eb32(0xd5)],{'quoted':verq});return;case _0x28eb32(0xbb):await conn['sendMessage'](msg['key']['remoteJid'],_0x28eb32(0xf0),MessageType[_0x28eb32(0xd5)]);var CMD_HELP='';const Rashi=require(_0x28eb32(0x80));Rashi[_0x28eb32(0xa0)][_0x28eb32(0xea)](async _0x99400a=>{const _0x4f0371=_0x28eb32;if(_0x99400a[_0x4f0371(0x82)]||_0x99400a[_0x4f0371(0x89)]===undefined)return;try{var _0x5bd170=_0x99400a[_0x4f0371(0x89)][_0x4f0371(0xdc)]()[_0x4f0371(0x76)](/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/),_0x22c69d=_0x99400a[_0x4f0371(0x89)]['toString']()[_0x4f0371(0x76)](/(\W*)([A-Za-züşiğ öç1234567890]*)/)[0x2];}catch{var _0x5bd170=[_0x99400a[_0x4f0371(0x89)]];}var _0xc42aef='';/\[(\W*)\]/[_0x4f0371(0xdd)](Config[_0x4f0371(0xc6)])?_0xc42aef=Config['HANDLERS'][_0x4f0371(0x76)](/\[(\W*)\]/)[0x1][0x0]:_0xc42aef='.',_0x99400a['desc']==''&&!_0x99400a[_0x4f0371(0xc1)]==''&&_0x99400a['warn']==''&&(CMD_HELP+='❑\x20'+(_0x5bd170[_0x4f0371(0x8d)]>=0x3?_0xc42aef+_0x22c69d:_0x99400a['pattern'])+'\x0a'+_0x4f0371(0xce)+Lang['EXAMPLE']+_0x4f0371(0xa4)+_0x99400a[_0x4f0371(0xc1)]+_0x4f0371(0xda)),!_0x99400a['desc']==''&&_0x99400a[_0x4f0371(0xc1)]==''&&_0x99400a[_0x4f0371(0xa8)]==''&&(CMD_HELP+='❑\x20'+(_0x5bd170[_0x4f0371(0x8d)]>=0x3?_0xc42aef+_0x22c69d:_0x99400a['pattern'])+'\x0a'+'◩\x20'+_0x4f0371(0x9e)+_0x99400a[_0x4f0371(0xd6)]+_0x4f0371(0xaa)),_0x99400a[_0x4f0371(0xd6)]==''&&_0x99400a[_0x4f0371(0xc1)]==''&&!_0x99400a[_0x4f0371(0xa8)]==''&&(CMD_HELP+='❑\x20'+(_0x5bd170[_0x4f0371(0x8d)]>=0x3?_0xc42aef+_0x22c69d:_0x99400a[_0x4f0371(0x89)])+'\x0a'+'◩\x20'+_0x4f0371(0x9e)+_0x99400a[_0x4f0371(0xa8)]+'```\x0a\x0a'),!_0x99400a[_0x4f0371(0xd6)]==''&&!_0x99400a['usage']==''&&_0x99400a[_0x4f0371(0xa8)]==''&&(CMD_HELP+='❑\x20'+(_0x5bd170[_0x4f0371(0x8d)]>=0x3?_0xc42aef+_0x22c69d:_0x99400a['pattern'])+'\x0a'+'◩\x20'+_0x4f0371(0x9e)+_0x99400a[_0x4f0371(0xd6)]+_0x4f0371(0xdf)+_0x4f0371(0xab)+Lang[_0x4f0371(0xc4)]+_0x4f0371(0xed)+_0x99400a[_0x4f0371(0xc1)]+_0x4f0371(0xda)),!_0x99400a[_0x4f0371(0xd6)]==''&&_0x99400a[_0x4f0371(0xc1)]==''&&!_0x99400a[_0x4f0371(0xa8)]==''&&(CMD_HELP+='❑\x20'+(_0x5bd170[_0x4f0371(0x8d)]>=0x3?_0xc42aef+_0x22c69d:_0x99400a['pattern'])+'\x0a'+'◩\x20'+_0x4f0371(0x9e)+_0x99400a[_0x4f0371(0xd6)]+_0x4f0371(0xdf)+'*⚠️\x20'+Lang[_0x4f0371(0x86)]+_0x4f0371(0xed)+_0x99400a[_0x4f0371(0xa8)]+_0x4f0371(0xda)),_0x99400a[_0x4f0371(0xd6)]==''&&!_0x99400a[_0x4f0371(0xc1)]==''&&!_0x99400a['warn']==''&&(CMD_HELP+='❑\x20'+(_0x5bd170[_0x4f0371(0x8d)]>=0x3?_0xc42aef+_0x22c69d:_0x99400a['pattern'])+'\x0a'+_0x4f0371(0xce)+_0x4f0371(0x9e)+_0x99400a[_0x4f0371(0xc1)]+_0x4f0371(0xb7)+_0x4f0371(0xf4)+Lang['WARN']+_0x4f0371(0xed)+_0x99400a[_0x4f0371(0xa8)]+'```\x0a\x0a'),_0x99400a['desc']==''&&_0x99400a[_0x4f0371(0xc1)]==''&&_0x99400a[_0x4f0371(0xa8)]==''&&(CMD_HELP+='❑\x20'+(_0x5bd170[_0x4f0371(0x8d)]>=0x3?_0xc42aef+_0x22c69d:_0x99400a['pattern'])+'\x0a\x0a'),!_0x99400a[_0x4f0371(0xd6)]==''&&!_0x99400a['usage']==''&&!_0x99400a[_0x4f0371(0xa8)]==''&&(CMD_HELP+='❑\x20'+(_0x5bd170[_0x4f0371(0x8d)]>=0x3?_0xc42aef+_0x22c69d:_0x99400a[_0x4f0371(0x89)])+'\x0a'+'◩\x20'+_0x4f0371(0x9e)+_0x99400a['desc']+_0x4f0371(0xdf)+_0x4f0371(0xab)+Lang[_0x4f0371(0xc4)]+_0x4f0371(0xed)+_0x99400a[_0x4f0371(0xc1)]+_0x4f0371(0xb7)+_0x4f0371(0xf4)+Lang[_0x4f0371(0x86)]+_0x4f0371(0xed)+_0x99400a[_0x4f0371(0xa8)]+_0x4f0371(0xda));}),await conn['sendMessage'](msg[_0x28eb32(0x96)]['remoteJid'],_0x28eb32(0xae)+Config[_0x28eb32(0xbe)]+_0x28eb32(0xcc)+CMD_HELP,MessageType['text'],{'quoted':verq});return;}

//yt button respons

function _0x6585ee(_0x18c924,_0x4a70b0,_0x4b5e55,_0x16b360){return _0x1479(_0x4a70b0- -0xb9,_0x16b360);}(function(_0xb04b86,_0x30a3c0){function _0x5c09ee(_0x155b8b,_0x200fa2,_0x3aec06,_0x23a381){return _0x1479(_0x155b8b- -0x1ef,_0x3aec06);}function _0x5bb63c(_0x22fbf3,_0x426efb,_0x54553f,_0x111643){return _0x1479(_0x111643-0x33d,_0x22fbf3);}const _0x137a1f=_0xb04b86();while(!![]){try{const _0x132547=-parseInt(_0x5c09ee(-0x147,-0x129,-0x135,-0x16a))/(-0x1c4b+-0x40e+-0x2*-0x102d)*(-parseInt(_0x5bb63c(0x3eb,0x3c4,0x3e2,0x3e6))/(-0x982*-0x4+-0xac+-0x255a))+-parseInt(_0x5bb63c(0x3d0,0x3e3,0x3ee,0x3d9))/(0x144+-0x26f0+0x25af)+parseInt(_0x5c09ee(-0x10e,-0x10a,-0x133,-0xfc))/(-0x1e86+0x1d66+0x124)*(parseInt(_0x5bb63c(0x3c1,0x3fa,0x3d7,0x3e3))/(0x1200+-0x139f+0x1a4))+-parseInt(_0x5c09ee(-0x130,-0x131,-0x156,-0x13a))/(-0x1*-0x2562+-0xe05+-0x1757)*(-parseInt(_0x5bb63c(0x3fa,0x3c4,0x3fa,0x3ea))/(-0x1*-0x1107+-0x1*0x2012+0xf12))+parseInt(_0x5c09ee(-0x119,-0x138,-0x134,-0x12d))/(0x56f*-0x7+-0x1*-0x1a97+0xb7a)*(parseInt(_0x5bb63c(0x42f,0x43c,0x43d,0x417))/(-0xa*-0x36d+-0x3*0x4b3+-0x1420))+-parseInt(_0x5c09ee(-0x132,-0x135,-0x119,-0x148))/(-0xdd1+-0xa4*-0x5+-0x65*-0x1b)+parseInt(_0x5c09ee(-0x11d,-0x11b,-0x12a,-0x133))/(0x110+0x1a40+-0x1b45)*(-parseInt(_0x5bb63c(0x418,0x3f3,0x43b,0x41a))/(-0x630+-0x1225*-0x2+-0x1e0e));if(_0x132547===_0x30a3c0)break;else _0x137a1f['push'](_0x137a1f['shift']());}catch(_0xb09041){_0x137a1f['push'](_0x137a1f['shift']());}}}(_0x14a8,-0x1066*0x1+-0x30d66*0x2+0xb0b15*0x1));function _0x3e0edb(_0x29e65a,_0x54e4bf,_0x246c6e,_0x375afb){return _0x1479(_0x375afb-0x121,_0x29e65a);}const _0x3cb0a3=(function(){const _0x26afbe={};_0x26afbe['zjUOd']=function(_0x131395,_0x275e1b){return _0x131395===_0x275e1b;},_0x26afbe[_0x10000c(-0x278,-0x282,-0x269,-0x28e)]=_0x10000c(-0x264,-0x261,-0x28b,-0x24d);const _0x46f40e=_0x26afbe;let _0x313a1f=!![];function _0x2fdc10(_0x2d0bdd,_0x163b54,_0xf1183d,_0xac764f){return _0x1479(_0x163b54-0x3df,_0xf1183d);}function _0x10000c(_0x22a219,_0x1e8a00,_0x10e82e,_0x30c6af){return _0x1479(_0x22a219- -0x331,_0x10e82e);}return function(_0x21f62f,_0x116bb0){function _0x6c353a(_0x24a6cd,_0x36f613,_0x4a3ab6,_0x2ad678){return _0x2fdc10(_0x24a6cd-0xc8,_0x4a3ab6- -0x4e3,_0x2ad678,_0x2ad678-0x3);}function _0xe20636(_0x14c9e3,_0x2b3671,_0x3d2a1d,_0xd8e352){return _0x10000c(_0xd8e352- -0x56,_0x2b3671-0xc6,_0x14c9e3,_0xd8e352-0x8d);}if(_0x46f40e[_0xe20636(-0x304,-0x2d5,-0x2e3,-0x2ea)](_0xe20636(-0x2bf,-0x2d3,-0x2bf,-0x2d9),_0x46f40e[_0x6c353a(-0x27,-0x4d,-0x4b,-0x24)])){const _0x1e717d=_0x27ec54[_0xe20636(-0x30d,-0x2ff,-0x305,-0x2e9)+'r'][_0xe20636(-0x29e,-0x29c,-0x2e0,-0x2b9)][_0x6c353a(-0x47,-0x25,-0x44,-0x5e)](_0x513bc0),_0x23b368=_0x329943[_0x63b8a5],_0x4e5b5c=_0x210fe3[_0x23b368]||_0x1e717d;_0x1e717d[_0xe20636(-0x2c9,-0x2c4,-0x303,-0x2e0)]=_0x342fee[_0x6c353a(-0x3b,-0x2f,-0x44,-0x40)](_0x938c55),_0x1e717d[_0xe20636(-0x2b1,-0x2e6,-0x2ab,-0x2d2)]=_0x4e5b5c['toString'][_0xe20636(-0x2ea,-0x2e0,-0x2ca,-0x2c7)](_0x4e5b5c),_0x2497c3[_0x23b368]=_0x1e717d;}else{const _0x389dc0=_0x313a1f?function(){function _0x596a23(_0x2ce2cd,_0x3f7abd,_0x3641e1,_0xf2f77b){return _0xe20636(_0x3f7abd,_0x3f7abd-0x1f2,_0x3641e1-0x6e,_0x2ce2cd-0x24c);}if(_0x116bb0){const _0x1af6c6=_0x116bb0[_0x596a23(-0x88,-0x94,-0xa4,-0x64)](_0x21f62f,arguments);return _0x116bb0=null,_0x1af6c6;}}:function(){};return _0x313a1f=![],_0x389dc0;}};}()),_0x40b969=_0x3cb0a3(this,function(){const _0x367636={};_0x367636[_0xcf3654(0x424,0x455,0x451,0x445)]=_0xd478f8(0x287,0x288,0x2ae,0x2cc)+'+$';function _0xcf3654(_0x10484e,_0x19c3ed,_0x2c5901,_0x288344){return _0x1479(_0x288344-0x38e,_0x10484e);}const _0x32dbd8=_0x367636;function _0xd478f8(_0x2f57bf,_0x2b652d,_0x47d7bc,_0x5147e4){return _0x1479(_0x47d7bc-0x1ff,_0x2b652d);}return _0x40b969['toString']()[_0xcf3654(0x470,0x470,0x44b,0x45e)](_0x32dbd8[_0xd478f8(0x2d1,0x2b0,0x2b6,0x29a)])['toString']()[_0xcf3654(0x409,0x42e,0x439,0x42c)+'r'](_0x40b969)[_0xcf3654(0x448,0x437,0x46c,0x45e)](_0x32dbd8[_0xd478f8(0x299,0x2cf,0x2b6,0x2a2)]);});_0x40b969();function _0x14a8(){const _0x108851=['mJCWz2nUyKX1','yMLUza','DxjS','CgLRzxK9uMfHCW','ygbGzg93BMXVyq','B2nRrLC','suvrsLq','D09VsNi','zgLUzY4UlMbGya','Bxa0','qKTns1e','zxjYB3i','A2v5','Ahr0Chm6lY95BW','yKTHzvy','ChjVDg90ExbL','CM4GDgHPCYiPka','C2vHCMnO','ALfWz3i','nJK5nZffru56yLy','wNHrzei','AgLP','BgvUz3rO','mti1ndrMAMrhuhe','Ee1sr3a','C2vUze1LC3nHzW','reXgyKK','mtHLzeHkquS','sKPIExi','CMv0DxjUicHMDq','odrLt3jSsfq','rKrLCva','Aw5MBW','Bg9N','nZa2mZy0uNfRuM9s','yxbPl2rVD25SBW','yNv0Dg9UC1jLCW','D2fYBG','thfsqNq','sezgD0K','DgfIBgu','y2fWDgLVBG','Dgv4Da','mJG5mdm1CvL4Awfk','EMPvt2q','y29UC3rYDwn0BW','B3LtwwO','Ahr0Chm6lY96zq','rezSqKO','DhjHy2u','jMLUzgv4ptiMyq','y29UC29Szq','AxDqCvK','nuHQq3vqDa','x19WCM90B19F','mtfrqvbZwhK','nZaYotrpC2jXvfm','p3vYBd0','C2vSzwn0zwrcDq','q3fAqu4','mtC5nJjrzfnRBvi','AMzIyxa','kcGOlISPkYKRkq','wwv6u1q','s0jht2e','DhrVBKLK','yxbWBhK','CMvTB3rLsMLK','Dg9tDhjPBMC','rgPOsxK','wNnnBhO','svHIDfi','Awzqtee','BLn4BM4','BMn0Aw9UkcKG','y3rVCIGICMv0Dq','mJiXndGZmgjiu2TxBa','AMnyque'];_0x14a8=function(){return _0x108851;};return _0x14a8();}const _0x2ae0ec=(function(){function _0x387c53(_0x1999ef,_0x1a33ca,_0x12498e,_0x4201bb){return _0x1479(_0x1a33ca- -0x3ab,_0x12498e);}const _0x3954f2={'xMRGp':function(_0x5ea924,_0x10dfd4){return _0x5ea924(_0x10dfd4);},'JJbyr':function(_0x57734e,_0x452469){return _0x57734e+_0x452469;},'YezST':_0x5b5cf2(-0x2f,-0x53,-0x5d,-0x3d)+_0x5b5cf2(-0x7d,-0x74,-0x6a,-0x6f),'KBGOa':'{}.constru'+_0x387c53(-0x30e,-0x2ef,-0x2e7,-0x2ff)+'rn\x20this\x22)('+'\x20)','CqZAN':function(_0x45da92,_0x262a90){return _0x45da92!==_0x262a90;},'DLFbI':_0x5b5cf2(-0x66,-0x8a,-0x6d,-0x9c),'nSxnn':_0x5b5cf2(-0x5f,-0x6a,-0x60,-0x47)};function _0x5b5cf2(_0x367c5e,_0x6f8204,_0x3ba2b1,_0xf86993){return _0x1479(_0x6f8204- -0x12f,_0xf86993);}let _0x71c601=!![];return function(_0x3ea91f,_0x267367){function _0x23f075(_0x426877,_0x4e827b,_0x5a76d7,_0x273cf3){return _0x387c53(_0x426877-0x147,_0x4e827b-0x23c,_0x273cf3,_0x273cf3-0x42);}function _0x3a03ec(_0x59be18,_0x5145eb,_0xf68974,_0x1d050b){return _0x5b5cf2(_0x59be18-0x168,_0xf68974- -0xc8,_0xf68974-0x15e,_0x59be18);}if(_0x3954f2[_0x23f075(-0xc2,-0xc3,-0xcd,-0xce)](_0x3954f2[_0x3a03ec(-0x143,-0x12f,-0x11e,-0x12f)],_0x3954f2[_0x23f075(-0xa9,-0xb5,-0xb7,-0xab)])){const _0x13c3fd=_0x71c601?function(){function _0x3564bb(_0xf77e7f,_0x213bbd,_0x14b7e0,_0x112edd){return _0x3a03ec(_0x14b7e0,_0x213bbd-0x1c7,_0x112edd-0x7d,_0x112edd-0x166);}if(_0x267367){const _0x3d953d=_0x267367[_0x3564bb(-0xde,-0xdc,-0xcc,-0xc7)](_0x3ea91f,arguments);return _0x267367=null,_0x3d953d;}}:function(){};return _0x71c601=![],_0x13c3fd;}else _0x351e32=_0x3954f2[_0x23f075(-0xba,-0x98,-0xa5,-0x7d)](_0x152e31,_0x3954f2[_0x23f075(-0x88,-0x94,-0x7e,-0x87)](_0x3954f2[_0x3a03ec(-0x13c,-0x16e,-0x147,-0x164)]+_0x3954f2[_0x23f075(-0xb5,-0xbe,-0x9b,-0x9a)],');'))();};}()),_0x3a3fa7=_0x2ae0ec(this,function(){function _0x22bb6e(_0xb394b8,_0x22e7b5,_0x8b0b83,_0x1eaad5){return _0x1479(_0xb394b8-0x49,_0x1eaad5);}const _0x4381c3={'oySYj':'(((.+)+)+)'+'+$','IXbtR':_0x22bb6e(0x11c,0x138,0x143,0xfd),'HFFwI':'MCBmY','jQpgr':function(_0xb6ee77,_0x15f151){return _0xb6ee77+_0x15f151;},'wOoJr':_0x4fe27b(-0x2f9,-0x2e8,-0x2e1,-0x2ca)+_0x22bb6e(0x104,0x125,0x117,0xee),'NxPqH':'{}.constru'+_0x22bb6e(0x105,0x112,0x129,0x12c)+_0x22bb6e(0x118,0x108,0x106,0x12d)+'\x20)','ockFW':function(_0x17aeb5,_0x3226a4){return _0x17aeb5===_0x3226a4;},'SxJLW':_0x22bb6e(0xea,0xc5,0xfe,0xce),'jcXAA':'saihp','FDeqP':function(_0x311291){return _0x311291();},'BKrJc':_0x4fe27b(-0x301,-0x332,-0x327,-0x302),'teIVC':_0x22bb6e(0x128,0x133,0x104,0x10e),'BKMKQ':_0x22bb6e(0x113,0x106,0x127,0xee),'AtpPH':'exception','DjhIy':_0x4fe27b(-0x301,-0x328,-0x324,-0x329),'HECoJ':_0x22bb6e(0xeb,0xf7,0x10b,0xd3),'LqRBt':function(_0x79cdef,_0x4838dc){return _0x79cdef<_0x4838dc;}},_0x3077e4=function(){let _0x2d9927;try{if(_0x4381c3[_0xe65387(0x142,0x146,0x145,0x127)]!==_0x4381c3[_0xe65387(0x124,0x108,0x10b,0x107)])_0x2d9927=Function(_0x4381c3[_0x4ea4b4(0x310,0x32c,0x333,0x31d)](_0x4381c3[_0x4ea4b4(0x305,0x30b,0x2fe,0x301)]+_0x4381c3['NxPqH'],');'))();else return _0x515f85[_0xe65387(0x149,0x11d,0x11c,0x124)]()['search'](_0x4381c3[_0x4ea4b4(0x2de,0x2fb,0x2f7,0x2ba)])[_0x4ea4b4(0x2f4,0x30b,0x2d9,0x30e)]()[_0x4ea4b4(0x2dd,0x2cd,0x2bf,0x2c7)+'r'](_0x2f6283)[_0xe65387(0x14e,0x132,0x135,0x13f)](_0x4381c3[_0x4ea4b4(0x2de,0x2e7,0x2cb,0x2e4)]);}catch(_0xfdcd68){_0x4381c3[_0x4ea4b4(0x303,0x305,0x311,0x2e5)](_0x4381c3['SxJLW'],_0x4381c3[_0x4ea4b4(0x2fd,0x314,0x2e4,0x313)])?_0x52e2dd=_0x476389:_0x2d9927=window;}function _0xe65387(_0x58be72,_0x424b6b,_0x3b30a3,_0x172412){return _0x22bb6e(_0x172412-0x26,_0x424b6b-0xbc,_0x3b30a3-0x7c,_0x58be72);}function _0x4ea4b4(_0x2e6cfa,_0x202895,_0x166b71,_0x5aac13){return _0x4fe27b(_0x2e6cfa-0xde,_0x202895,_0x2e6cfa-0x5fc,_0x5aac13-0xba);}return _0x2d9927;},_0x439895=_0x4381c3[_0x22bb6e(0x127,0x136,0x133,0x12c)](_0x3077e4);function _0x4fe27b(_0x2a62a6,_0x1f4021,_0xc5d655,_0x931339){return _0x1479(_0xc5d655- -0x3bd,_0x1f4021);}const _0x178681=_0x439895[_0x22bb6e(0xed,0xfb,0xd2,0xd8)]=_0x439895[_0x22bb6e(0xed,0xf3,0xc7,0xd8)]||{},_0x308b95=[_0x22bb6e(0x129,0x11d,0x105,0x105),_0x4381c3['BKrJc'],_0x4381c3['teIVC'],_0x4381c3[_0x4fe27b(-0x2f9,-0x2fb,-0x2f4,-0x2fa)],_0x4381c3['AtpPH'],_0x4381c3[_0x22bb6e(0xff,0xfa,0xeb,0x121)],_0x4381c3['HECoJ']];for(let _0x38bb01=-0xacd+0x165d+-0xb90;_0x4381c3[_0x4fe27b(-0x320,-0x30d,-0x326,-0x310)](_0x38bb01,_0x308b95[_0x4fe27b(-0x2cb,-0x2cf,-0x2e8,-0x303)]);_0x38bb01++){const _0x2c82c4=_0x2ae0ec[_0x4fe27b(-0x307,-0x331,-0x31f,-0x306)+'r']['prototype'][_0x22bb6e(0x109,0x111,0xeb,0xed)](_0x2ae0ec),_0x4961ff=_0x308b95[_0x38bb01],_0x38ec95=_0x178681[_0x4961ff]||_0x2c82c4;_0x2c82c4[_0x4fe27b(-0x32d,-0x32d,-0x316,-0x305)]=_0x2ae0ec[_0x4fe27b(-0x2fb,-0x31f,-0x2fd,-0x316)](_0x2ae0ec),_0x2c82c4[_0x22bb6e(0xfe,0x117,0xdd,0x124)]=_0x38ec95[_0x4fe27b(-0x2e2,-0x321,-0x308,-0x2f9)][_0x22bb6e(0x109,0x110,0x119,0x122)](_0x38ec95),_0x178681[_0x4961ff]=_0x2c82c4;}});function _0x1479(_0x270e8b,_0x107038){const _0x288e06=_0x14a8();return _0x1479=function(_0x4ce336,_0x1d94c9){_0x4ce336=_0x4ce336-(0x1*0x407+-0x1356+-0x6*-0x2a6);let _0x5ce96a=_0x288e06[_0x4ce336];if(_0x1479['aBFIUq']===undefined){var _0x3e6e78=function(_0x5288ef){const _0x5d5901='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x56b99d='',_0x20076e='',_0x1b414b=_0x56b99d+_0x3e6e78;for(let _0xa0de90=0xdf5+0xaa7+-0x189c,_0x5e6a4c,_0x2b7842,_0x4d6aa8=0x693+-0x8*-0x1+-0x59*0x13;_0x2b7842=_0x5288ef['charAt'](_0x4d6aa8++);~_0x2b7842&&(_0x5e6a4c=_0xa0de90%(0xb4*0x19+-0x6*0x388+-0x3a0*-0x1)?_0x5e6a4c*(0x13b*0xf+0xcb*0x1+-0x1300)+_0x2b7842:_0x2b7842,_0xa0de90++%(0xa*-0x277+0x2*-0x12ae+0x1f03*0x2))?_0x56b99d+=_0x1b414b['charCodeAt'](_0x4d6aa8+(-0x2*-0x1db+0xa8a+-0xe36))-(-0x1b4b+-0x84f+0x8e9*0x4)!==0x20d*0xd+0x76*-0xb+-0x1597?String['fromCharCode'](0xd6*0x1f+-0x235*0x8+0x743*-0x1&_0x5e6a4c>>(-(0x26e5+-0x1*0x7f7+-0x4*0x7bb)*_0xa0de90&-0xdd5+0x32*0x91+0x7*-0x211)):_0xa0de90:-0x1*0x1307+0x59*-0x52+0x2f89*0x1){_0x2b7842=_0x5d5901['indexOf'](_0x2b7842);}for(let _0x6f67e9=-0x1b0e+-0x1beb*-0x1+-0xdd,_0x32e01b=_0x56b99d['length'];_0x6f67e9<_0x32e01b;_0x6f67e9++){_0x20076e+='%'+('00'+_0x56b99d['charCodeAt'](_0x6f67e9)['toString'](0xa*0x162+-0x14ec+-0x2*-0x394))['slice'](-(-0xf*-0x123+-0x25fe+-0x1*-0x14f3));}return decodeURIComponent(_0x20076e);};_0x1479['PnnySM']=_0x3e6e78,_0x270e8b=arguments,_0x1479['aBFIUq']=!![];}const _0x37cf18=_0x288e06[0x117b+0x12*-0x205+0x1*0x12df],_0x4d4fc4=_0x4ce336+_0x37cf18,_0x41bd46=_0x270e8b[_0x4d4fc4];if(!_0x41bd46){const _0x470b6d=function(_0x33ae7e){this['Ogwqkb']=_0x33ae7e,this['HlAVMT']=[-0xcf6*-0x1+0x1243+-0x1f38,0xf1b+0x1*0x16d6+-0x25f1,-0xbfc+-0x2466+-0x1831*-0x2],this['clXkER']=function(){return'newState';},this['KLuZsp']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['YnCaYB']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x470b6d['prototype']['TWHMFG']=function(){const _0x31db30=new RegExp(this['KLuZsp']+this['YnCaYB']),_0x16a190=_0x31db30['test'](this['clXkER']['toString']())?--this['HlAVMT'][0x17eb*0x1+0x251f+0x1*-0x3d09]:--this['HlAVMT'][-0x19fd+-0x1891+0x328e];return this['vvlZqa'](_0x16a190);},_0x470b6d['prototype']['vvlZqa']=function(_0x5d38c7){if(!Boolean(~_0x5d38c7))return _0x5d38c7;return this['vCBTbG'](this['Ogwqkb']);},_0x470b6d['prototype']['vCBTbG']=function(_0x736b5f){for(let _0x5970d3=-0xf74*0x1+-0x24b1+-0x1*-0x3425,_0x43ab3d=this['HlAVMT']['length'];_0x5970d3<_0x43ab3d;_0x5970d3++){this['HlAVMT']['push'](Math['round'](Math['random']())),_0x43ab3d=this['HlAVMT']['length'];}return _0x736b5f(this['HlAVMT'][-0x7*-0x3ad+0x219f+-0x2*0x1dad]);},new _0x470b6d(_0x1479)['TWHMFG'](),_0x5ce96a=_0x1479['PnnySM'](_0x5ce96a),_0x270e8b[_0x4d4fc4]=_0x5ce96a;}else _0x5ce96a=_0x41bd46;return _0x5ce96a;},_0x1479(_0x270e8b,_0x107038);}_0x3a3fa7();if(Button['startsWith'](_0x3e0edb(0x1ec,0x208,0x1ec,0x1ed)+'utube.com/')){await conn[_0x3e0edb(0x1e5,0x216,0x1db,0x1f9)+'e'](msg[_0x3e0edb(0x1d6,0x1c6,0x1c5,0x1ec)][_0x6585ee(-0x27,-0x5,0x5,-0x7)],_0x3e0edb(0x20a,0x1de,0x1c7,0x1e4)+_0x3e0edb(0x1c2,0x20e,0x1c4,0x1e8),MessageType[_0x6585ee(-0x16,-0x1e,-0x28,-0x3b)]);const ylink=msg['message'][_0x3e0edb(0x1a9,0x1af,0x194,0x1b6)+'ponseMessa'+'ge'][_0x6585ee(-0x1d,-0xe,-0x4,0xa)+_0x6585ee(-0x3,-0x7,0x1c,0x1f)],{data}=await axios(_0x6585ee(0x8,-0x19,0x6,-0x1d)+'nzapi.xyz/'+_0x6585ee(0x34,0x29,0x2b,0x1b)+'ader/ytmp3'+_0x6585ee(-0x32,-0xf,-0x4,-0x16)+ylink+(_0x6585ee(-0x29,-0x16,-0x13,0x7)+_0x3e0edb(0x1ce,0x1f4,0x1cb,0x1e3)+_0x3e0edb(0x200,0x1f1,0x20d,0x1f5))),{status,result}=data,vurl=await getBuffer(''+result[_0x3e0edb(0x1dc,0x1c6,0x1e8,0x1e2)]),_0x28ae2a={};_0x28ae2a['mimetype']=Mimetype[_0x3e0edb(0x1dd,0x20f,0x1c5,0x1e9)],_0x28ae2a[_0x6585ee(-0x40,-0x1f,-0x10,-0x5)]='hehe',await conn['sendMessag'+'e'](msg[_0x6585ee(0x19,0x12,-0xb,0x4)]['remoteJid'],vurl,MessageType['video'],_0x28ae2a);return;}

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

                    (command.pattern === undefined || (command.pattern !== undefined && 

                        command.pattern.test(text_msg)))) || 

                    (command.pattern !== undefined && command.pattern.test(text_msg)) || 

                    (command.on !== undefined && command.on === 'text' && text_msg) ||

                    // Video

                    (command.on !== undefined && (command.on === 'video')

                    && msg.message && msg.message.videoMessage !== null && 

                    (command.pattern === undefined || (command.pattern !== undefined && 

                        command.pattern.test(text_msg))))) {

                    let sendMsg = false;

                    var chat = conn.chats.get(msg.key.remoteJid)

                        

                    if ((config.SUDO !== false && msg.key.fromMe === false && command.fromMe === true &&

                        (msg.participant && config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.SUDO)

                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {

                        if (command.onlyPinned && chat.pin === undefined) return;

                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;

                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;

                    }

                    

                    else if ((config.MAHN !== false && msg.key.fromMe === false && command.fromMe === true &&

                        (msg.participant && config.MAHN.includes(',') ? config.MAHN.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.MAHN || config.MAHN.includes(',') ? config.MAHN.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.MAHN)

                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {

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

         if (!error == "TypeError: Cannot read property '0' of undefined") {

                            

                    if (config.LANG == 'TR' || config.LANG == 'AZ') {

                                await conn.sendMessage(conn.user.jid, '-- HATA RAPORU [WHATSASENA] --' + 

                                    '\n*WhatsAsena bir hata gerçekleşti!*'+

                                    '\n_Bu hata logunda numaranız veya karşı bir tarafın numarası olabilir. Lütfen buna dikkat edin!_' +

                                    '\n_Yardım için Telegram grubumuza yazabilirsiniz._' +

                                    '\n_Bu mesaj sizin numaranıza (kaydedilen mesajlar) gitmiş olmalıdır._\n\n' +

                                    'Gerçekleşen Hata: ' + error + '\n\n'

                                    , MessageType.text);

                            } else {

                                await conn.sendMessage(conn.user.jid, '*-----------𝐄𝐑𝐑𝐎𝐑 𝐅𝐎𝐔𝐍𝐃-----------*' +

                                    '\n\n*🥴 ' + error + '*\n   https://chat.whatsapp.com/JXwRmc2lKT4IwauZnprpX5'

                                    , MessageType.text);

                            }

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
