// Создание и добавление карточек
const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;
const imagePopup = document.querySelector('.popup_type_image');
const imagePopupImage = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');

// Функция для создания карточки
function createCard({ name, link }) {
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const likeButton = cardElement.querySelector('.card__like-button');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    // Устанавливаем данные карточки
    cardImage.src = link;
    cardImage.alt = name;
    cardTitle.textContent = name;

    // Логика лайка
    likeButton.addEventListener('click', (evt) => {
        evt.target.classList.toggle('card__like-button_is-active');
    });

    // Логика удаления
    deleteButton.addEventListener('click', () => {
        cardElement.remove();
    });

    // Открытие попапа с изображением
    cardImage.addEventListener('click', () => {
        imagePopupImage.src = link;
        imagePopupImage.alt = name;
        imagePopupCaption.textContent = name;
        openModal(imagePopup);
    });

    return cardElement;
}

// Инициализация карточек из данных
initialCards.forEach(cardData => {
    const card = createCard(cardData);
    placesList.appendChild(card);
});

// Попапы
function openModal(popup) {
    popup.classList.add('popup_is-opened');
    popup.addEventListener('click', handleOverlayClose);
    document.addEventListener('keydown', handleEscClose);
}

function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
    popup.removeEventListener('click', handleOverlayClose);
    document.removeEventListener('keydown', handleEscClose);
}

function handleOverlayClose(evt) {
    if (evt.target === evt.currentTarget) {
        closeModal(evt.currentTarget);
    }
}

function handleEscClose(evt) {
    if (evt.key === "Escape") {
        const modalWindow = document.querySelector('.popup_is-opened');
        closeModal(modalWindow);
    }
}

// Попап редактирования профиля
const profilePopup = document.querySelector('.popup_type_edit');
const profilePopupButton = document.querySelector('.profile__edit-button');
const profileSubmitButton = profilePopup.querySelector('.popup__button');
const profilePopupName = profilePopup.querySelector('.popup__input_type_name');
const profilePopupDescription = profilePopup.querySelector('.popup__input_type_description');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

function profilePopupDefault() {
    profilePopupName.value = profileTitle.textContent;
    profilePopupDescription.value = profileDescription.textContent;
    openModal(profilePopup);
}

profilePopupButton.addEventListener('click', () => {
    profilePopupDefault();
});

profileSubmitButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    profileTitle.textContent = profilePopupName.value;
    profileDescription.textContent = profilePopupDescription.value;
    closeModal(profilePopup);
});

// Попап добавления новой карточки
const cardPopup = document.querySelector('.popup_type_new-card');
const cardAddButton = document.querySelector('.profile__add-button');
const cardName = cardPopup.querySelector('.popup__input_type_card-name');
const cardUrl = cardPopup.querySelector('.popup__input_type_url');
const cardSubmitButton = cardPopup.querySelector('.popup__button');

cardAddButton.addEventListener('click', () => {
    openModal(cardPopup);
    cardName.value = null;
    cardUrl.value = null;
});

cardSubmitButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    addCard(cardName.value, cardUrl.value);
    closeModal(cardPopup);
});

function addCard(name, url) {
    const newCardBlock = { name, link: url };
    const newCard = createCard(newCardBlock);
    placesList.prepend(newCard);
}


// Функция для отображения ошибки
function showInputError(formElement, inputElement, errorMessage) {
    const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
    inputElement.classList.add('popup__input_type_error'); // Красная рамка
    errorElement.textContent = errorMessage;
    errorElement.classList.add('popup__error-text'); // Красный цвет текста ошибки
}

// Функция для скрытия ошибки
function hideInputError(formElement, inputElement) {
    const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
    inputElement.classList.remove('popup__input_type_error'); // Убираем красную рамку
    errorElement.textContent = ''; // Очищаем текст ошибки
    errorElement.classList.remove('popup__error-text'); // Убираем красный текст ошибки
}

// Проверка валидности поля
function checkInputValidity(formElement, inputElement) {
    const errorElement = formElement.querySelector(`.${inputElement.name}-error`);

    // Если поле не валидно, показываем ошибку
    if (!inputElement.validity.valid) {
        if (inputElement.validity.valueMissing) {
            showInputError(formElement, inputElement, 'Вы пропустили это поле.');
        } else if (inputElement.validity.typeMismatch && inputElement.type === 'url') {
            showInputError(formElement, inputElement, 'Введите адрес сайта.');
        }
    } else {
        // Если поле валидно, скрываем ошибку
        hideInputError(formElement, inputElement);
    }
}

// Проверка состояния всех полей
function hasInvalidInput(inputList) {
    return inputList.some((element) => !element.validity.valid);
}

// Логика для кнопки отправки
function toggleButtonState(inputList, buttonElement) {
    const isValid = !hasInvalidInput(inputList); // Проверяем, что все поля валидны
    buttonElement.disabled = !isValid;
    buttonElement.classList.toggle('button_inactive', !isValid);
}

// Установка обработчиков событий
function setEventListeners(formElement) {
    const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
    const buttonElement = formElement.querySelector('.popup__button');

    // Первоначальное состояние кнопки
    toggleButtonState(inputList, buttonElement);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            checkInputValidity(formElement, inputElement);
            toggleButtonState(inputList, buttonElement); // Обновляем состояние кнопки
        });
    });
}

// Инициализация валидации
function enableValidation() {
    const forms = Array.from(document.querySelectorAll('.popup__form'));
    forms.forEach((formElement) => {
        formElement.addEventListener('submit', (evt) => {
            evt.preventDefault(); // Предотвращаем отправку формы
        });
        setEventListeners(formElement);
    });
}

// Запускаем валидацию
enableValidation();
