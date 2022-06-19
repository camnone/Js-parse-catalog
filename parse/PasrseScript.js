

    const fs = require('fs');
    const puppeteer = require('puppeteer');
    


    const link = {
        smartphone: 'https://www.dns-shop.ru/catalog/17a8a01d16404e77/smartfony/?p=',
        smartWatchesAndBracelets: 'https://www.dns-shop.ru/catalog/251c82c88ed24e77/smart-chasy-i-braslety/?p=',
        childrensWatches: 'https://www.dns-shop.ru/catalog/fa58a48980ca51bf/detskie-chasy/?p='
    };
    
(async () => {
    
        let flag = true;
        let res = [];
        let counter = 1
        try {

            let browser = await puppeteer.launch({
                headless: false,
                slowMo: 0,
                devtools: false
            });

            let page = await browser.newPage();
    
            await page.setViewport({
                width: 1400,
                height: 900
            });
    
            while (flag) {

                await page.goto(`${link.smartphone}${counter}`);
                await page.waitForSelector('a.pagination-widget__page-link_next');
    
                let html = await page.evaluate(async () => {
                    let page = [];
                    try {
                        let divs = document.querySelectorAll('div.catalog-product');
                        divs.forEach(div => {
                            let a = div.querySelector('a.ui-link');
    
                            let obj = {
                                title: a !== null ? a.innerText : 'NO-L INK',
                                link: a.href,
                                price: div.querySelector('div.product-buy__price') !== null ?
                                       div.querySelector('div.product-buy__price').innerText : 'NO-PRICE',
                                img: div.querySelector('a.catalog-product__image-link picture img').src == '' ? 'NO-IMG': div.querySelector('a.catalog-product__image-link picture img').src,
                                alt: div.querySelector('a.catalog-product__image-link picture img').src == '' ? 'img': div.querySelector('a.catalog-product__image-link picture img').alt
                            }
                            page.push(obj)
                        })
    
                    } catch (e) {
                        console.log(e);
                    }
                    return page
                }, {waitUntil: 'a.pagination-widget__page-link_next'})
    
                await res.push(html)
    
                for (let i in res) {
                    if (res[i].length === 0) flag = false
    
                }
                counter++
            }
            await browser.close();
    
            res = res.flat()
    
            
            fs.writeFile('DataBase.json', JSON.stringify({
                'DataBase': res
            }), err => {
                if (err) throw err
                console.log('json saved');
                console.log('json length - ', res.length);
            })
    
    
        } catch (e) {
            console.error(e);
            await browser.close();
        }
    })();


