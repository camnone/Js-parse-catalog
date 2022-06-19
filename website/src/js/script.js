const getResourse = async (url) => {
    const res = await fetch(url);
    if(!res.ok){
        throw new Error(`could no fetch ${url}, status ${res.status}`);
    }
    return await res.json();
}


function catalog(){
    class Catalog {
        constructor(title,link,price,img,alt){
            this.title = title,
            this.price = price,
            this.link = link,
            this.img = img
            this.alt = alt
        }


        render(){   
            const item = document.createElement('div');
            const parent = document.querySelector('.catalog');

            item.innerHTML = `
            <div class="catalog-item">
                <div class="catalog__img">
                    <img src="${this.img}" alt="${this.alt}">
                </div>
                <div class="catalog__text">
                    <a href="${this.link}" target="_blank" class="title"><span>${this.title}</span></a>
                </div>

                <div class="catalog__price">
                    <div class="price"><span>${this.price}</span></div>
                    <button class="btn btn-success">Купить</button>
                </div>
            </div>
            `;
            parent.insertAdjacentElement("beforeend",item);
        }
    }
    getResourse('http://localhost:3000/DataBase')
        .then(data => {
            data.forEach(({
                    title,
                    link,
                    price,
                    img,
                    alt
            }) => {
                new Catalog(title,link,price,img != 'NO-IMG' ? img : 'https://via.placeholder.com/250x200', alt).render();
            });
        });
};

catalog();




