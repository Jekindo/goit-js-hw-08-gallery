import galleryItems from './data/galleryItems.js';

const refs = {
	gallery: document.querySelector('.js-gallery'),
	closeLightboxBtn: document.querySelector('button[data-action="close-lightbox"]'),
	lightbox: document.querySelector('.js-lightbox'),
	lightboxImage: document.querySelector('.lightbox__image'),
	lightboxOverlay: document.querySelector('.lightbox__overlay'),
	lightboxCaption: document.querySelector('.lightbox__caption'),
};

const galleryMarkup = createGalleryItemsMarkup(galleryItems);
refs.gallery.insertAdjacentHTML('afterbegin', galleryMarkup);

refs.gallery.addEventListener('click', onGalleryContainerClick);
refs.closeLightboxBtn.addEventListener('click', onModalClose);
refs.lightboxOverlay.addEventListener('click', onLightboxOverlayClick);

const galleryImages = document.querySelectorAll('.gallery__image');

let currentImageIndex = 0;

function createGalleryItemsMarkup(items) {
	return items
		.map(({ preview, original, description }, index) => {
			return `
		<li class="gallery__item">
		<a
			class="gallery__link"
			href="${original}">
			<img
				class="gallery__image"
				src="${preview}"
				data-source="${original}"
				data-index="${index}"
				alt="${description}" />
		</a>
	</li>
		`;
		})
		.join('');
}

function onGalleryContainerClick(evt) {
	evt.preventDefault();

	if (evt.target.nodeName !== 'IMG') {
		return;
	}

	const imgRef = evt.target;

	refs.lightboxImage.src = imgRef.dataset.source;
	refs.lightboxImage.alt = imgRef.alt;
	refs.lightboxImage.addEventListener('load', () => {
		refs.lightboxCaption.classList.add('lightbox__caption--active'); //????????????
	});

	currentImageIndex = Number(imgRef.dataset.index);

	updateCaptionTextContent(refs.lightboxImage.alt);
	onModalOpen();
}

function onModalOpen() {
	refs.lightbox.classList.add('is-open');
	window.addEventListener('keydown', onEscapeKeypress);
	window.addEventListener('keydown', onLeftArrowKeypress); //??????????
	window.addEventListener('keydown', onRightArrowKeypress); //??????????
}

function onModalClose() {
	refs.lightbox.classList.remove('is-open');
	window.removeEventListener('keydown', onEscapeKeypress);
	window.removeEventListener('keydown', onLeftArrowKeypress);
	window.removeEventListener('keydown', onRightArrowKeypress);

	refs.lightboxCaption.classList.remove('lightbox__caption--active'); //????????????
	refs.lightboxImage.src = '';
	refs.lightboxImage.alt = '';
}

function onLeftArrowKeypress(evt) {
	if (evt.code !== 'ArrowLeft') {
		return;
	}

	currentImageIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;

	refs.lightboxImage.src = galleryImages[currentImageIndex].dataset.source;
	refs.lightboxImage.alt = galleryImages[currentImageIndex].alt;
	updateCaptionTextContent(refs.lightboxImage.alt);
}

function onRightArrowKeypress(evt) {
	if (evt.code !== 'ArrowRight') {
		return;
	}

	currentImageIndex = currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1;

	refs.lightboxImage.src = galleryImages[currentImageIndex].dataset.source;
	refs.lightboxImage.alt = galleryImages[currentImageIndex].alt;
	updateCaptionTextContent(refs.lightboxImage.alt);
}

function onLightboxOverlayClick(evt) {
	if (evt.currentTarget === evt.target) {
		onModalClose();
	}
}

function onEscapeKeypress(evt) {
	if (evt.code === 'Escape') {
		onModalClose();
	}
}

function updateCaptionTextContent(value) {
	refs.lightboxCaption.textContent = value;
}

function clearImageAttr() {
	refs.lightboxImage.src = '';
	refs.lightboxImage.alt = '';
}
