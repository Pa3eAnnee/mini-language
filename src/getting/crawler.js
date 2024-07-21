import axios from 'axios';
import cheerio from 'cheerio';
import { URL } from 'node:url';

const visited = new Set();
const toVisit = [];
const pages = [];

export async function crawl(baseDomain) {
    toVisit.push(baseDomain);

    while (toVisit.length > 0) {
        const url = toVisit.pop();

        if (!url || visited.has(url)) {
            continue;
        }

        visited.add(url);

        try {
            const { data } = await axios.get(url);
            pages.push({ url, html: data });

            const $ = cheerio.load(data);
            const links = $('a');

            links.each((_, link) => {
                const href = $(link).attr('href');
                if (href) {
                    const nextUrl = new URL(href, baseDomain).href;

                    if (nextUrl.startsWith(baseDomain) && !visited.has(nextUrl)) {
                        toVisit.push(nextUrl);
                    }
                }
            });
        } catch (error) {
            console.error(`Error crawling ${url}: ${error.message}`);
        }
    }
    return pages;
}
