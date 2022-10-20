(function() {

  // Swiper

    const swiper = new Swiper('.swiper', {
        slidesPerView: 2,
        grid: {
          rows: 2,
        },
        spaceBetween: 30,

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
    });

    const swiperTwo = new Swiper('.swiper-two', {
      slidesPerView: 3,
      spaceBetween: 30,

      navigation: {
        nextEl: '.swiper-button-next-two',
        prevEl: '.swiper-button-prev-two',
      },
    });

  // Tabs

  let tabsLinks = document.querySelectorAll('.giftsets-link');
  tabsLinks.forEach(function(tabLink) {
    tabLink.addEventListener('click', (e) => {
      document.querySelectorAll('.giftsets-link').forEach(function(tabLink) {
        tabLink.classList.remove('giftsets-link--active');
      });
      const path = e.currentTarget.dataset.path;
      let tabs = document.querySelectorAll('.giftsets-info');
      tabs.forEach(function(tab) {
        tab.classList.remove('giftsets-info--active');
      });
      document.querySelector(`[data-target="${path}"]`).classList.add('giftsets-info--active');
      document.querySelector(`[data-path="${path}"]`).classList.add('giftsets-link--active');
    });
  });

  //Cart
  const cart = document.querySelector('.cart');
  const cartCount = cart.querySelector('.cart__count');
  const cartList = cart.querySelector('.cart__list');
  const totalPrice = cart.querySelector('.cart__pricesum');

  //функция для присвоения id
  const randomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  //функция для перевода строки цены в число
  const priceNormalise = (price) => {
    price = price.split(' ');
    let priceV = price.pop();
    return Number(price.join(''));
  };
  //функция для перевода числа суммы в строку для вывода
  const pricePrint = (price) => {
    price = String(price).split('');
    priceTh = price.splice(-3);
    price = `${price.join('')} ${priceTh.join('')} p.`;
    return price;
  };
  //проверка для раскрытия окна корзины
  const cartOpen = () => {
    let productsListLength = cartList.children.length;
    productsListLength > 0 ? cart.classList.add('cart-active') : cart.classList.remove('cart-active');
  };
  

  //добавление товара в корзину
  const cartBtnAdd = document.querySelectorAll('.count-btn-add');
  cartBtnAdd.forEach(el => {
    //присвоить id товару
    el.closest('.product').setAttribute('data-id', randomId());

    el.addEventListener('click', () => {
      //число товаров в корзине
      let count = Number(cartCount.textContent);
      cartCount.textContent = count += 1;

      //получить все данные товара
      let parent = el.closest('.product');
      let id = parent.dataset.id;
      let img = parent.querySelector('.product-img').getAttribute('src');
      let name = parent.querySelector('.product-name').textContent;
      let price = parent.querySelector('.product-price').textContent;

      //добавить разметку в окно корзины
      let cartItem = document.createElement('li');
      cartItem.classList.add('cart__item');
      cartItem.setAttribute('data-id', id);
      cartItem.innerHTML = `<img class="cart__img" src="${img}" alt="">
        <div class="cart__wrapper">
            <h3 class="cart__name">${name}</h3>
            <span class="cart__price">${price}</span>
        </div>
        <button class="cart__btn-delete"></button>`;
      cartList.append(cartItem);
      //сделать кнопку добавления в корзину не активной
      el.setAttribute('disabled', true);
      //проверка для раскрытия окна корзины
      cartOpen();
      //подсчет итоговой суммы товаров
      let priceSum = priceNormalise(totalPrice.textContent) + priceNormalise(price)
      totalPrice.textContent = pricePrint(priceSum);
    });
  });

  //функция удаления товара из корзины
  function productDeleteCart (item) {
    let id = item.dataset.id;
      //число товаров в корзине
    let count = Number(cartCount.textContent);
    cartCount.textContent = count -= 1;
    //удалить disabled у кнопки товара
    document.querySelector(`.product[data-id = "${id}"]`).querySelector('.count-btn-add').disabled = false;
    //пересчитать итоговую стоимость
    let priceMin = priceNormalise(totalPrice.textContent) - priceNormalise(item.querySelector('.cart__price').textContent);
    totalPrice.textContent = pricePrint(priceMin);
    //удалить товар из корзины
    item.remove();
    //проверка для скрытия окна корзины
    cartOpen();
  }

  //удаление товара из корзины 
  cartList.addEventListener('click', (el) => {
    if (el.target.classList.contains('cart__btn-delete')) {
      let cartItem = el.target.closest('.cart__item');
      productDeleteCart(cartItem);
    }
  });

  // Order

  const cartBtn = cart.querySelector('.cart__btn');
  const orderCard = document.querySelector('.order');
  const orderList = orderCard.querySelector('.order__list');
  let productArray = [];

  //Заполнение списка товаров
  function orderProductAdd (id, img, name, price) {
    let orderItem = document.createElement('li');
      orderItem.classList.add('order__item');
      orderItem.setAttribute('data-id', id);
      orderItem.innerHTML = `<img class="order__img" src="${img}" alt="">
        <div class="order__wrapper">
            <h3 class="order__name">${name}</h3>
            <span class="order__price">${price}</span>
        </div>
        <button class="order-delete">Удалить</button>`;
      orderList.append(orderItem);
  };

  //функция заполнения данных о заказе в окно заказа
  function infoOrderAdd () {
    const countOrder = orderCard.querySelector('.order__count-num');
    countOrder.textContent = `${cartCount.textContent} шт.`;
    const priceOrder = orderCard.querySelector('.order__price-num');
    priceOrder.textContent = `${totalPrice.textContent}`;
  }

  //Получение данных товаров для окна заказа
  function productOrder () {
    let arr = cartList.children;
    let arrProductOrder = [];
    productArray = [];
    for (item of arr) {
      let id = item.dataset.id;
      let img = item.querySelector('.cart__img').getAttribute('src');
      let name = item.querySelector('.cart__name').textContent;
      let price = item.querySelector('.cart__price').textContent;

      //Oбъект с данными товара 
      let objProd = {};
      objProd.id = id;
      objProd.img = img;
      objProd.name = name;
      objProd.price = price;
      arrProductOrder.push(objProd);

      //Объект с товарамми для отправки
      let obj = {};
      obj.prodname = name;
      obj.price = price;
      productArray.push(obj);
    }

    return arrProductOrder; 
  };

  cartBtn.addEventListener('click', () => {
    //открытие окна заказа
    orderCard.classList.add('order-active');
    let bodyBackground = document.createElement('div');
    bodyBackground.classList.add('body-background');
    document.body.prepend(bodyBackground);

    orderList.innerHTML = '';

    //заполнение данных заказа
    infoOrderAdd();

    //заполнение листа заказа
    let arr = productOrder();
    arr.forEach((el) => {
      orderProductAdd(el.id, el.img, el.name, el.price);
    });

    //Открытие списка товаров на кнопку
    let orderProductsBtn = orderCard.querySelector('.order__products');
    let flag = 0;
    orderProductsBtn.addEventListener('click', () => {
      if (flag == 0) {
        orderList.classList.add('order__list-active');
        orderProductsBtn.classList.add('order__products-active');
        flag = 1;
      } else {
        orderList.classList.remove('order__list-active');
        orderProductsBtn.classList.remove('order__products-active');
        flag = 0;
      }
    });

    //Закрытие окна заказа
    let orderClose = orderCard.querySelector('.order__close');
    orderClose.addEventListener('click', () => {
      orderCard.classList.remove('order-active');
      bodyBackground.classList.remove('body-background');
      orderList.classList.remove('order__list-active');
      orderProductsBtn.classList.remove('order__products-active');
    });
  });

  //удаление товара из окна заказов
  orderList.addEventListener('click', (el) => {
    if (el.target.classList.contains('order-delete')) {
      let orderItem = el.target.closest('.order__item');
      let id = orderItem.dataset.id;
      let name = orderItem.querySelector('.order__name').textContent;
      //удалить товар из окна заказов и из корзины
      let cartItem = cartList.querySelector(`.cart__item[data-id = "${id}"]`);
      productDeleteCart(cartItem);
      orderList.innerHTML = '';
      let arr = productOrder();
      arr.forEach((el) => {
        orderProductAdd(el.id, el.img, el.name, el.price);
      });
      //Перезаписать данные заказа
      infoOrderAdd();
    }
  });
  
  //Маска для телефона
  const selector = document.querySelector('#tel');
  const im = new Inputmask("+7 (999) 999-99-99");
  im.mask(selector);


  //Отправка заказа
  const orderBtn = orderCard.querySelector('.order__btn');
  orderBtn.addEventListener('click',async (e) => {
    e.preventDefault();

    //Данные из формы для отправки
    let form = orderCard.querySelector('.order__form');
    let formData = new FormData(form);
    let name = form.querySelector('[name = "name"]').value;
    let tel = form.querySelector('[name = "tel"]').value;
    let email = form.querySelector('[name = "mail"]').value;
    formData.append('Товары', JSON.stringify(productArray));
    formData.append('Имя', name);
    formData.append('Телефон', tel);
    formData.append('Email', email);

    // Валидация
    let errorsArr= [];
    
    let errorName = form.querySelector('[for = "name"]').querySelector('.error-label');
    if (name.length < 2 || name.length > 30) {
      errorsArr.push('1');
      errorName.classList.add('error-label-active');
    } else {
      errorName.classList.remove('error-label-active')
    }

    let errorTel = form.querySelector('[for = "tel"]').querySelector('.error-label');
    let phone = selector.inputmask.unmaskedvalue()
    if (phone.length !== 10) {
      errorsArr.push('1');
      errorTel.classList.add('error-label-active');
    } else {
      errorTel.classList.remove('error-label-active');
    }

    let errorMail = form.querySelector('[for = "mail"]').querySelector('.error-label');
    if (!email.split('').includes('@') || !email.split('').includes('.')) {
      errorsArr.push('1');
      errorMail.classList.add('error-label-active');
    } else {
      errorMail.classList.remove('error-label-active');
    }

    //Если нет ошибок валидации, отправляем заказ на почту через РНРMailer
    if (errorsArr.length === 0) {
      let responce = await fetch('mail.php', {
        method: 'POST',
        body: formData,
      });
      if (responce.status === 200) {
        let result = await responce.json();
        alert('Данные отправлены');
        form.reset();
        orderCard.classList.remove('order-active');
        let bodyBackground = document.querySelector('.body-background');
        bodyBackground.classList.remove('body-background');
        cartList.innerHTML = '';
        cartCount.textContent = 0;
        totalPrice.textContent = 0;
        cartOpen();
        cartBtnAdd.forEach(el => {
          el.disabled = false;
        });
      } else {
        alert('Oшибка');
      } 
    } 
  });


  // About product
  const aboutProdLink = document.querySelectorAll('.coffee-card__link');
  aboutProdLink.forEach (link => {
    link.addEventListener('click', () => {
      //находим карточку о товаре по атрибуту
      let atr = link.dataset.prod;
      let aboutProd = document.querySelector(`.about-product[data-aboutprod = "${atr}"]`);
      aboutProd.classList.add('about-product-active');
      //затемнение на фон
      let bodyBackground = document.createElement('div');
      bodyBackground.classList.add('body-background');
      document.body.prepend(bodyBackground);
      //открытие карточки
      let btnClose = aboutProd.querySelector('.about-product__close');
      //закрытие карточки
      btnClose.addEventListener('click', () => {
        aboutProd.classList.remove('about-product-active');
        bodyBackground.remove();
      })
    });
  });
})();