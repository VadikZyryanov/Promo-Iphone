document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const getData = (url, callback) => {
        // const request = new XMLHttpRequest();
        // request.open('GET', url);
        // request.send();

        // request.addEventListener('readystatechange', () => {
        //     if (request.readyState !== 4) return;
        //     if (request.status === 200) {
        //         const response = JSON.parse(request.response);
        //         callback(response);
        //     } else {
        //         console.error(new Error('Ошибка: ' + request.status))
        //     }
        // });
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('response.statusText');
            })
            .then(callback)
            .catch((error) => {
                console.log(error);
            });
    };




    //функция переключение картинок и описанаия товара
    const tabs = () => {
         //получаем нужные элементы
        const cardDetailChangeElems = document.querySelectorAll('.card-detail__change');
        const cardDetailsTitleElem = document.querySelector('.card-details__title');
        const cardImageItemElem =  document.querySelector('.card__image_item');
        const cardDetailsPriceElem = document.querySelector('.card-details__price');
        const descriptionMemoryElem = document.querySelector('.description__memory');
        //записываем в массив данные, которые будут изменяться
        const data = [
            {
                name: 'Смартфон Apple iPhone 12 Pro 128GB Graphite',
                img: 'img/iPhone-graphite.png',
                price: 95990,
                memoryROM: 128
            },
            {
                name: 'Смартфон Apple iPhone 12 Pro 256GB Silver',
                img: 'img/iPhone-silver.png',
                price: 120990,
                memoryROM: 256
            },
            {
                name: 'Смартфон Apple iPhone 12 Pro 512GB Pacific Blue',
                img: 'img/iPhone-blue.png',
                price: 150000,
                memoryROM: 512
            },
        ];
        //функция деактивации класса, для смены товара
        const deactive = () => {
            cardDetailChangeElems.forEach(btn => btn.classList.remove('active'))
        }
        //функция прпебора и инофрмации и ее смены
        cardDetailChangeElems.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                if (!btn.classList.contains('active')) {
                    deactive();
                    btn.classList.add('active');
                    cardDetailsTitleElem.textContent = data[i].name;
                    cardImageItemElem.src = data[i].img;
                    cardImageItemElem.alt = data[i].name;          
                    cardDetailsPriceElem.textContent = data[i].price + '₽'
                    descriptionMemoryElem.textContent = `Встроенная память (ROM) ${data[i].memoryROM} ГБ`;
                }
            });
        });
    };
    //функция развертывания описания под кнопками
    const accordion = () => {
        //получаем нужные элементы
        const characteristicsListElem = document.querySelector('.characteristics__list');
        const characteristicsItemElems = document.querySelectorAll('.characteristics__item');
        //функция отрытия элементов
        const open = (button, dropDown) => {
            closeAllDrops();
            dropDown.style.height = `${dropDown.scrollHeight}px`
            button.classList.add('active');
            dropDown.classList.add('active');
        };
        //функция закрытия элементов
        const close = (button, dropDown) => {
            button.classList.remove('active');
            dropDown.classList.remove('active');
            dropDown.style.height = '';
        };
        //функция закрытия всех элементов, когда открывается новый элемент
        const closeAllDrops = (button, dropDown) => {
            characteristicsItemElems.forEach((elem) => {
                if (elem.children[0] !== button && elem.children[1] !== dropDown) {
                    close(elem.children[0], elem.children[1]);
                }
            })
        }
        //основной скрипт
        characteristicsListElem.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('characteristics__title')) {
                const parent = target.closest('.characteristics__item');
                const description = parent.querySelector('.characteristics__description');
                description.classList.contains('active') ? close(target, description) : open(target, description);
            }
        });
        //закртыие элементов при клике любое место на странице
        document.body.addEventListener('click', (event) => {
            const target = event.target;
            if (!target.closest('.characteristics__list')) {
                closeAllDrops();
            }
        })
    };
    //функция отрытия модального окна
    const modal = () => {
        
        //получаем нужные элементы
        const cardDetailsButtonBuy = document.querySelector('.card-details__button_buy');
        const modal = document.querySelector('.modal');
        const cardDetailsButtonDelivery = document.querySelector('.card-details__button_delivery');
        const cardDetailsTitle = document.querySelector('.card-details__title');
        const modalTitle = document.querySelector('.modal__title');
        const modalSubtitle = document.querySelector('.modal__subtitle');
        const modalTitleSubmit = modal.querySelector('.modal__title-submit');
        
        
        //функция отрытия
        const openModal = (event) => {
            const target = event.target;
            modal.classList.add('open');
            document.addEventListener('keydown', escapeHandler);
            //замена заголовка в модальном окне
            modalTitle.textContent = cardDetailsTitle.textContent;
            modalTitleSubmit.value = cardDetailsTitle.textContent;
            modalSubtitle.textContent = target.dataset.buttonBuy;
        };
        
        //функция закрытия
        const closeModal = () => {
            modal.classList.remove('open');
            document.removeEventListener('keydown', escapeHandler);
        };

        //функция закрытия по нажатию Escape
        const escapeHandler =  (event) => {
            const key = event.code;
            if (key === "Escape" && modal.classList.contains('open')) {
                closeModal();
            }
        };

        //основной скрипт
        modal.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('modal__close') || target.classList.contains('open')) {
                closeModal();
            }
        });

        cardDetailsButtonBuy.addEventListener('click', openModal);
        cardDetailsButtonDelivery.addEventListener('click', openModal);
    }



    const renderCrossSell = () => {

        const crossSellList = document.querySelector('.cross-sell__list');
        const crossSellAdd = document.querySelector('.cross-sell__add');
        const allGoods = [];

        //рандомная сортировка массива
        const shuffle = arr => arr.sort(() => Math.random() - 0.5);

        //функция, которая берет значения с сервера и вписывает в верстку
        const createCrossSellItem = (good) => {

            const { photo, name, price } = good;

            const liItem = document.createElement('li');
            liItem.innerHTML = `
                <article class="cross-sell__item">
                    <img class="cross-sell__image" src="${photo}" alt="${name}">
                    <h3 class="cross-sell__title">${name}</h3>
                    <p class="cross-sell__price">${price}₽</p>
                    <button type="button" class="button button_buy cross-sell__button">Купить</button>
                </article>
            `;
            return liItem;
        };

        const render = arr => {
            arr.forEach(item => {
                crossSellList.append(createCrossSellItem(item));
            })
        };

        //ограничение возможности нажать конпку "показать еще"
        // const wrapper = (fn, count) => {
        //     let counter = 0
        //     return (...args) => {
        //         if (counter === count) return;
        //         counter++
        //         return fn(...args)
        //     }
        // };

        // const wrapRender = wrapper(render, 2)

        //функция перебора объектов с сервера
        const createCrossSellList = (goods = []) => {
            allGoods.push(...shuffle(goods));
            const fourItems = allGoods.splice(0, 4);
            render(fourItems);
        };

        crossSellAdd.addEventListener('click', () => {
            render(allGoods);
            crossSellAdd.remove();
        })
        //вызов функции 
        getData('cross-sell-dbase/dbase.json', createCrossSellList)

    };

    tabs();
    accordion();
    modal();
    renderCrossSell();
    amenu('.header__menu', '.header-menu__list', '.header-menu__item', '.header-menu__burger');

});