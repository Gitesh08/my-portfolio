const https = require('https');

https.get('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40gitesh08', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const feed = JSON.parse(data);
            console.log('Got', feed.items.length, 'items');
            feed.items.forEach(item => {
                const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                console.log(`TITLE: ${item.title}`);
                console.log(`IMG: ${imgMatch ? imgMatch[1] : 'none'}\n`);
            });
        } catch (e) {
            console.error('Json error', e);
        }
    });
}).on('error', console.error);
