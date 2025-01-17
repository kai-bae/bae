document.addEventListener('DOMContentLoaded', function () {
	function preloadContent() {
		const components = [
			{ url: 'Components/header.html', id: 'header' },
			{ url: 'Components/footer.html', id: 'footer' }
		];
		components.forEach(component => {
			fetch(component.url)
				.then(response => response.text())
				.then(data => {
					document.getElementById(component.id).innerHTML = data;

					if (component.id === 'header') {
						attachHeaderEvents();
					}
				});
		});
	}

	// Attach the header events (navbar toggle, dropdown, and scroll effects)
	function attachHeaderEvents() {
		const navbarToggler = document.getElementById('navbar-toggler');
		const navbarCollapse = document.getElementById('navbarNav');
		const navbarNav = document.querySelector('.navbar-nav');
		const header = document.getElementById('header');
		let lastScrollY = window.scrollY; // Track the last scroll position
		let isScrollingDown = false; // Track scroll direction

		if (navbarToggler) {
			navbarToggler.addEventListener('click', function () {
				navbarCollapse.classList.toggle('show');
				navbarToggler.classList.toggle('change');
			});
		}

		const rotateButton = document.getElementById('rotateButton');
		if (rotateButton) {
			rotateButton.addEventListener('click', function (event) {
				event.preventDefault();  // 250116 additional
				event.stopPropagation(); // Prevent click from propagating to window click listener
				this.classList.toggle('rotate-180');
				const dropdown = document.getElementById('dropdownMenu');
				dropdown.classList.toggle('show');
			});
		}

		// Close the dropdown if the user clicks outside of the button or dropdown
		window.addEventListener('click', function (event) {
			const dropdown = document.getElementById('dropdownMenu');
			const button = document.getElementById('rotateButton');
			if (dropdown && button && !button.contains(event.target) && !dropdown.contains(event.target)) {
				dropdown.classList.remove('show');
				button.classList.remove('rotate-180');
			}
		});

		// Scroll effect: Hide header on scroll down, show on scroll up
		window.addEventListener('scroll', () => {
			if (window.scrollY > lastScrollY) {
				if (!isScrollingDown) {
					isScrollingDown = true;
					setTimeout(() => {
						if (isScrollingDown) header.classList.add('hidden');
					}, 200); // 200ms delay
				}
			} else {
				isScrollingDown = false;
				header.classList.remove('hidden');
			}
			lastScrollY = window.scrollY;
		});
	}

	preloadContent();

	// Populate the products section with dynamic content
	const $sec = document.getElementById("home-products");
	const $dir_path = "img/img-index/col_3_img-";
	const $data = [
		{ shop: 'Tooling & Die', file_name: 'tooling_die.jpg' },
		{ shop: 'Stamping', file_name: 'stamping.jpg' },
		{ shop: 'Welding', file_name: 'welding.jpg' },
		{ shop: 'Plating', file_name: 'plating.jpg' },
	];

	function populateArray() {
		let $parent = '<div class="row">';
		$data.forEach(value => {
			$parent += `
			<div class="col-md-3 col-6 p-1px">
				<a class="fill_tile pstn_rel_dis_blck" href="#home-products" title="${value.shop}">
					<img class="img-fluid" src="${$dir_path}${value.file_name}" alt="${value.shop}">
					<div>
						<h3>${value.shop}</h3>
					</div>
				</a>
			</div>
			`;
		});
		$parent += '</div>';
		$sec.innerHTML += $parent;
	}
	populateArray();

	const path_Pro_gal = "img/img-index/img-crsl-pro_gal/";
	const $arrProGal = [
		{ title: 'Parts1 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg` },
		{ title: 'Parts2 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg` },
		{ title: 'Parts3 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg` },
		{ title: 'Parts4 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg` },
		{ title: 'Parts5 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg` },
		{ title: 'Parts6 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg` },
		{ title: 'Parts7 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg` },
		{ title: 'Parts8 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg` },
		{ title: 'Parts9 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg` },
		{ title: 'Parts10 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg` },
		{ title: 'Parts11 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg` },
		{ title: 'Parts12 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.jpg` },
	];

	const path_Client = "img/img-index/img-crsl-client_gal/logo-";
	const $arrClient = [
		{ title: 'Mitsubishi Motors (Thailand) Co., Ltd.', file_name: `${ path_Client }MMTh.svg`, link_add: 'https://www.mitsubishi-motors.co.th/th?rd=true' },
		{ title: 'H-ONE Parts (Thailand) Co., Ltd.', file_name: `${ path_Client }H_one.png`, link_add: 'https://www.h1-co.jp/eng/' },
		{ title: 'Hitachi Consumer Products (Thailand) Ltd.', file_name: `${ path_Client }Hitachi.svg`, link_add: 'https://www.hitachi-homeappliances.com/th-en/' },
		{ title: 'NHK Spring (Thailand) Co., Ltd.', file_name: `${ path_Client }Nhk.svg`, link_add: 'https://www.nhkspg.co.th/th/' },
		{ title: 'Copeland (Thailand) Ltd.', file_name: `${ path_Client }Emerson.png`, link_add: 'https://www.copeland.com/en-th/tools-resources/facilities/thailand' },
		{ title: 'Magna Automotive Technology (Thailand) Co., Ltd.', file_name: `${ path_Client }Magna.svg`, link_add: 'https://www.magna.com/' },
		{ title: 'Walker Exhaust (Thailand) Co., Ltd.', file_name: `${ path_Client }Walker.svg`, link_add: 'https://www.walkerexhaust.com/' },
		{ title: 'MAHLE Engine Components (Thailand) Co., Ltd.', file_name: `${ path_Client }Mahle.svg`, link_add: 'https://www.mahle.com/en/about-mahle/locations/1166.jsp' },
		{ title: 'Techno Associe (Thailand) Co., Ltd.', file_name: `${ path_Client }Techno_associe.png`, link_add: 'https://www.technoassocie.co.jp/en/company/network/thailand/' },
		{ title: 'Thai Kokoku Rubber Co., Ltd.', file_name: `${ path_Client }Kokoku.png`, link_add: 'https://www.kokoku-intech.com/en/' },
		{ title: 'Innova Rubber Co., Ltd.', file_name: `${ path_Client }Innova_rubber.png`, link_add: 'https://www.ircthailand.com/th/home' },
		{ title: 'Prospira (Thailand) Co., Ltd.', file_name: `${ path_Client }Prospira.svg`, link_add: 'https://prospira.com/' },
	];

	function populateCarousel(carouselId, data) {
		const wrapper = document.getElementById(`${carouselId}-wrapper`);
		const container = document.getElementById(carouselId);

		container.innerHTML = '';

		data.forEach(value => {
			const itemDiv = document.createElement('div');
			itemDiv.classList.add('crsl-item');

			const linkElement = document.createElement('a');
			linkElement.href = value.link_add;

			// Check carousel type and handle target behavior
			if (carouselId === 'crsl-pro_gal') {
				linkElement.removeAttribute('target');
				linkElement.addEventListener('click', (event) => {
					event.preventDefault();
					openModal(value.file_name);
				});
			} else {
				linkElement.target = "_blank";
			}

			const imgElement = document.createElement('img');
			imgElement.src = value.file_name;
			imgElement.alt = value.title;

			const captionDiv = document.createElement('div');
			captionDiv.classList.add('caption');
			captionDiv.textContent = value.title;

			linkElement.appendChild(imgElement);
			linkElement.appendChild(captionDiv);
			itemDiv.appendChild(linkElement);

			container.appendChild(itemDiv);
		});

		const prevButton = document.createElement('button');
		prevButton.classList.add('crsl-prev');
		prevButton.innerHTML = '&#10094;';
		prevButton.onclick = () => moveSlide(-1, carouselId);

		const nextButton = document.createElement('button');
		nextButton.classList.add('crsl-next');
		nextButton.innerHTML = '&#10095;';
		nextButton.onclick = () => moveSlide(1, carouselId);

		wrapper.appendChild(prevButton);
		wrapper.appendChild(nextButton);
	}

	populateCarousel('crsl-pro_gal', $arrProGal);
	populateCarousel('crsl-client', $arrClient);

	// Initialize index for carousel movement
	let index1 = 0;

	function moveSlide(step, carouselId) {
		const slides = document.querySelectorAll(`#${carouselId} .crsl-item`);
		const totalSlides = slides.length;

		const slidesToShow = 4; // Show 4 items at a time

		// Calculate the new index
		index1 = (index1 + step + totalSlides) % totalSlides;

		// Adjust the container's transform property to show the correct slides
		const carouselContainer = document.querySelector(`#${carouselId}`);
		const slideWidth = 100 / slidesToShow; // 25% per slide
		carouselContainer.style.transform = `translateX(-${index1 * slideWidth}%)`; // Move the carousel
	}

	function openModal(src) {
		const modal = document.getElementById("imageModal");
		const modalImage = document.getElementById("modalImage");
		modalImage.src = src;
		modal.style.display = "flex"; // Show the modal
	}
	function closeModal() {
		const modal = document.getElementById("imageModal");
		modal.style.display = "none"; // Hide the modal
	}
	document.getElementById("closeModal").addEventListener("click", closeModal);
});
