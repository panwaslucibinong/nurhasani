const cheerio = require('cheerio');
const beritaApi = async (link) => {
    try {
        const response = await fetch(link);
        const data = await response.json();
        return data.data.posts;
    } catch (error) {
        throw error;
    }
}

const sumberBerita = async (linku) => {
    try {
        const response = await fetch(linku);
        const data = await response.text();
        return data;
    } catch (error) {
        throw error;
    }
}

const beritaKpu = async () => {
    try {
        const data = await sumberBerita('https://infopemilu.kpu.go.id/');
        const $ = cheerio.load(data);
        const newsItems = $('.news-item.standard-item, .news-item.hero-item');
        const newsData = [];

        newsItems.each((_, item) => {
            const link = $(item).find('a').attr('href');
            const thumbnail = $(item).find('img').attr('src');
            const pubDate = $(item).find('.tag').text().trim();
            const title = $(item).find('.title').text().trim();
            const description = ''

            const newsItem = {
                link,
                thumbnail,
                pubDate,
                title,
                description
            };

            newsData.push(newsItem);
        });

        return newsData;
    } catch (error) {
        throw error;
    }
}
const beritaBws = async () => {
    try {
        const data = await sumberBerita('https://www.bawaslu.go.id/');
        const $ = cheerio.load(data);
        const newsItems = $('.views-row');

        const newsData = [];

        newsItems.each((_, item) => {
            const linkl = $(item).find('.views-field-title a').attr('href');
            const thumbnail = $('.views-row-1 .views-field-field-foto-berita .field-content img').attr('src');
            const pubDatel = $('.views-row-1 .views-field-created .field-content').text();
            const title = $(item).find('.views-field-title a').text().trim();
            const description = $('.views-row-1 .views-field-body .field-content p').text();

            const newsItem = {
                link: `https://www.bawaslu.go.id${linkl}`,
                thumbnail,
                pubDate: pubDatel.split(' -')[0],
                title,
                description
            };

            newsData.push(newsItem);
        });
        return newsData;
    } catch (error) {
        throw error;
    }
}

module.exports = { beritaApi, beritaKpu, beritaBws };
