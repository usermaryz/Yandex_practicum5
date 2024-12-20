import './pages/index.css';
import enableValidation from './components/validate.js';
import createCard from './components/card.js';
import {loadUserProfile, loadInitialCards, saveProfileData, createNewCard, deleteCard, toggleLike, updateAvatar} from './components/api.js';
import { openModal, closeModal } from './components/modal.js';
import { fetchUserProfile, fetchInitialCards } from './components/api.js';
import { data } from 'autoprefixer';

// Константы
const API_URL = 'https://nomoreparties.co/v1/frontend-st-cohort-201';
const AUTH_TOKEN = 'a15a9fa4-2beb-412b-ab9c-abab3cd11d77';

const settings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'button_inactive',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error-text',
};

// Элементы
const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

const profilePopup = document.querySelector('.popup_type_edit');
const profilePopupButton = document.querySelector('.profile__edit-button');
const profileSubmitButton = profilePopup.querySelector('.popup__button');
const profilePopupName = profilePopup.querySelector('.popup__input_type_name');
const profilePopupDescription = profilePopup.querySelector('.popup__input_type_description');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
const profileData = {
    id: null,
    name: null,
    description: null
  }

const cardPopup = document.querySelector('.popup_type_new-card');
const cardAddButton = document.querySelector('.profile__add-button');
const cardName = cardPopup.querySelector('.popup__input_type_card-name');
const cardUrl = cardPopup.querySelector('.popup__input_type_url');
const cardSubmitButton = cardPopup.querySelector('.popup__button');

const imagePopup = document.querySelector('.popup_type_image');
const imagePopupImage = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');

const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarEditButton = document.querySelector('.profile__image');
const avatarSubmitButton = avatarPopup.querySelector('.popup__button');
const avatarInput = avatarPopup.querySelector('.popup__input_type_avatar');

// События
profilePopupButton.addEventListener('click', () => {
    profilePopupName.value = profileTitle.textContent;
    profilePopupDescription.value = profileDescription.textContent;
    openModal(profilePopup);
});

profileSubmitButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    saveProfileData(profilePopupName.value, profilePopupDescription.value).then(() =>{
        profileTitle.textContent = profilePopupName.value;
        profileDescription.textContent = profilePopupDescription.value;
    });
});

cardAddButton.addEventListener('click', () => {
    cardName.value = '';
    cardUrl.value = '';
    openModal(cardPopup);
});

cardSubmitButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    createNewCard(cardName.value, cardUrl.value).then((card) => {
        const newCard = createCard(card._id, card.name, card.link, true, 0, false);
        placesList.prepend(newCard);
        closeModal(cardPopup);
    });
});

avatarEditButton.addEventListener('click', () => {
    avatarInput.value = '';
    openModal(avatarPopup);
});

avatarSubmitButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    updateAvatar(avatarInput.value).then((data) => {
        profileAvatar.style.backgroundImage = `url(${data.avatar})`;
        closeModal(avatarPopup)
    });
});

function renderProfile(){
    fetchUserProfile().then(data => {
        profileData.id = data._id;
        profileData.name = data.name;
        profileData.description = data.about;
        profileAvatar.style.backgroundImage = `url(${data.avatar})`;
        profileTitle.textContent = profileData.name;
        profileDescription.textContent = profileData.description;
    });
}

function renderInitialCards(){
    fetchInitialCards().then(cards => {
        cards.forEach((card) => {
            placesList.append(createCard(card._id, card.name, card.link, card.owner._id === profileData.id, card.likes.length, card.likes.some((info) => info._id === profileData.id)));
        });
    });
}

renderProfile();
renderInitialCards();