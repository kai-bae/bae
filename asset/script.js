document.addEventListener('DOMContentLoaded', function () {
	// Function to preload common components like header and footer
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

					attachHeaderEvents();
					initializeLanguage();
					NavClickEvent();
					highlightActiveLink(window.location.pathname);
				})
				.catch(error => console.error(`Failed to load ${component.id}:`, error));
		});
	}
	
	// Function to handle navigation links and dynamically load page content
	function loadPageContent(pageUrl) {
		// Use fetch to load the new page's content (for simplicity, you can load the body of the page)
		fetch(pageUrl)
			.then(response => response.text())
			.then(data => {
				// Extract and update the body content
				const newContent = data.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
				document.body.innerHTML = newContent;

				// Reload header/footer content (since it's part of every page)
				preloadContent();
				// Update the history without reloading the page
				history.pushState({ path: pageUrl }, '', pageUrl);
				
				const pageName = pageUrl.split('/').pop().replace('.html', ''); // Extract page name
				document.body.setAttribute("data-page", pageName);

				// Reinitialize page-specific functions after content change
				initializePageSpecificFunctions();
				highlightActiveLink(pageUrl);
				
				setTimeout(() => {
					document.documentElement.scrollTop = 0; // For most browsers
					document.body.scrollTop = 0; // For Safari
					window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scrolling
				}, 10);
			})
			.catch(error => console.error('Error loading new page:', error));
	}
	function highlightActiveLink(pageUrl) {
		const navLinks = document.querySelectorAll('.nav-item > .nav-link');
		navLinks.forEach(link => link.classList.remove('active'));
		navLinks.forEach(link => {
			if (new URL(link.href, location.origin).pathname === pageUrl) {
				link.classList.add('active');
			}
		});
	}

	function initializeLanguage() {
		const savedLanguage = localStorage.getItem("language") || "en";

		// Set the <html> lang attribute
		document.documentElement.lang = savedLanguage;

		// Get the current page from the <body> data attribute
		const currentPage = document.body.getAttribute("data-page");

		loadLanguageScript(savedLanguage, (translations) => {
			updateContent(translations, currentPage);
			updateMeta(translations, currentPage);
		});

		const languageSelector = document.getElementById("lang-sel");
		if(languageSelector) {
			languageSelector.addEventListener("change", (event) => {
				const selectedLanguage = event.target.value;
				localStorage.setItem("language", selectedLanguage);

				// Update the <html> lang attribute
				document.documentElement.lang = selectedLanguage;

				loadLanguageScript(selectedLanguage, (translations) => {
					updateContent(translations, currentPage);
					updateMeta(translations, currentPage);
				});
			});
		}
	}
	function loadLanguageScript(language, callback) {
		const script = document.createElement("script");
		script.src = `locale/${language}.js`; // Load the correct language file (e.g., en.js, th.js)
		script.onload = () => {
			callback(window.currentTranslations); // Use the loaded translations
		};
		document.body.appendChild(script);
	}
	function updateContent(translations, page) {
		// Update common elements
		if(translations.common) {
			document.querySelectorAll("[lang-id]").forEach((element) => {
				const key = element.getAttribute("lang-id");
				if(translations.common[key]) {
					element.innerHTML = translations.common[key]; // Apply common translations
				}
			});
		}
		// Update page-specific elements
		if(translations[page]) {
			document.querySelectorAll("[lang-id]").forEach((element) => {
				const key = element.getAttribute("lang-id");
				if(translations[page][key]) {
					element.innerHTML = translations[page][key]; // Apply page-specific translations
				}
			});
		}
	}
	function updateMeta(translations, page) {
		if(translations[page]) {
			// Update the <title>
			if(translations[page].title) {
				document.title = translations[page].title;
			}

			// Update the <meta name="description">
			const metaDescription = document.querySelector('meta[name="description"]');
			if(metaDescription && translations[page].description) {
				metaDescription.setAttribute("content", translations[page].description);
			}
		}
	}
	function NavClickEvent() {
		const navbarToggler = document.getElementById('navbar-toggler');
		const navbarCollapse = document.getElementById('navbarNav');
		const navbarNav = document.querySelector('.navbar-nav');

		// Toggle mobile navigation on navbar toggler click
		if (navbarToggler) {
			navbarToggler.addEventListener('click', function () {
				navbarCollapse.classList.toggle('show');
				navbarToggler.classList.toggle('change'); // Hamburger icon animation
			});
		}

		// Handle the rotate button and dropdown menu visibility
		const rotateButton = document.getElementById('rotateButton');
		if (rotateButton) {
			rotateButton.addEventListener('click', function (event) {
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
	}
	// Attach events to navbar links for SPA-like behavior
	function attachHeaderEvents() {
		const navbarLinks = document.querySelectorAll('.nav-link');
		navbarLinks.forEach(link => {
			link.addEventListener('click', function (event) {
				event.preventDefault();
				const targetUrl = link.getAttribute('href');
				//Kai loadPageContent(targetUrl);
			});
		});
	}
	// Handle page changes when navigating via History API (back, forward)
	window.addEventListener('popstate', function () {
		const currentPath = window.location.pathname;
		loadPageContent(currentPath);
	});
	
/*	function handleHeaderScroll() {
		function handleHeaderScroll() {
		let ticking = false;

		// Use a cross-browser approach to get the scroll position
		function getScrollPosition() {
			return document.documentElement.scrollTop || document.body.scrollTop;
		}

		let lastScrollY = getScrollPosition(); // Get the initial scroll position
		const header = document.getElementById("header");

		window.addEventListener('scroll', () => {
			if(!ticking) {
				requestAnimationFrame(() => {
					let currentScrollY = getScrollPosition(); // Get updated scroll position

					if(currentScrollY > lastScrollY) {
						header.classList.add('hidden');
					} else {
						header.classList.remove('hidden');
					}

					lastScrollY = currentScrollY;
					ticking = false;
				});
				ticking = true;
			}
		});
	}
	} */
	
	preloadContent();
	
	const path_Pro_gal = "img/img-index/img-crsl-pro_gal/";
	const $arrProGal = [
		{ title: 'Parts1 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif` },
		{ title: 'Parts2 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif` },
		{ title: 'Parts3 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif` },
		{ title: 'Parts4 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif` },
		{ title: 'Parts5 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif` },
		{ title: 'Parts6 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif` },
		{ title: 'Parts7 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif` },
		{ title: 'Parts8 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif` },
		{ title: 'Parts9 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif` },
		{ title: 'Parts10 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif` },
		{ title: 'Parts11 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif` },
		{ title: 'Parts12 Catalytic Converter Bracket', file_name: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif`, link_add: `${ path_Pro_gal }s-Bracket Corner Sensor  E.avif` },
	];

	const path_Client = "img/img-index/img-crsl-client_gal/logo-";
	const $arrClient = [
		{ title: 'Mitsubishi Motors (Thailand) Co., Ltd.', file_name: `${ path_Client }MMTh.svg`, link_add: 'https://www.mitsubishi-motors.co.th/th?rd=true' },
		{ title: 'H-ONE Parts (Thailand) Co., Ltd.', file_name: `${ path_Client }H_one.svg`, link_add: 'https://www.h1-co.jp/eng/' },
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
	
	const $arrComProf1 = [
		["Company Name", "Brother Auto Parts & Engineering Co., Ltd.", "business"],
		["Registered date", "September 23, 1993", "event"],
		["Business/ Products", "<ul class='mb-0'><li>Tooling & Die: Design and Produce</li><li>Stamping</li><li>Welding: Arc and Spot</li><li>Plating: EDP, Zinc, Zinc-nickel </li></ul>", "precision_manufacturing"],
		["Certificates", "IATF16949:2016, ISO9001:2015, ISO14001:2015", "verified"],
		["Website", "<a href='http://www.brother-autoparts.com' target='_blank'>www.brother-autoparts.com</a>", "language"]
	];
	const $arrComProf2 = [
		["Factory 1 / HQ", "10 Soi Ramindra 117, Yeak 2, Ramindra Rd., <br>Minburi, Minburi, Bangkok", "factory"],
		["Area", "6,400 m²", "arrows_output"],
		["Employees", "95 persons", "group"],
		["", "", ""],
		["Factory 2", "77/7 Moo 13, Saladaeng, Bangnumpraew, <br>Chachoengsao", "factory"],
		["Area", "68,800 m²", "arrows_output"],
		["Employees", "95 persons", "group"],
	];
	
	const path_img_cert = "img/img-about/certificate/";
	const $arrCert = [
		{ title: 'IATF16949:2016 Factory 1', file_name: `${path_img_cert}IATF16949-2016_Factory_1.avif`, link_add: `${path_img_cert}IATF16949-2016_Factory_1.avif` },
		{ title: 'ISO9001:2015 Factory 1', file_name: `${path_img_cert}ISO9001-2015_Factory_1.avif`, link_add: `${path_img_cert}ISO9001-2015_Factory_1.avif` },
		{ title: 'IATF16949:2016 Factory 2', file_name: `${path_img_cert}IATF16949-2016_Factory_2.avif`, link_add: `${path_img_cert}IATF16949-2016_Factory_2.avif` },
		{ title: 'IATF16949:2016 Factory 2 (2)', file_name: `${path_img_cert}IATF16949-2016_Factory_2_(2).avif`, link_add: `${path_img_cert}IATF16949-2016_Factory_2_(2).avif` },
		{ title: 'ISO9001:2015 Factory 2', file_name: `${path_img_cert}ISO9001-2015_Factory_2.avif`, link_add: `${path_img_cert}ISO9001-2015_Factory_2.avif` },
		{ title: 'ISO14001:2015 Factory 2', file_name: `${path_img_cert}ISO14001-2015_Factory_2.avif`, link_add: `${path_img_cert}ISO14001-2015_Factory_2.avif` },
	];

	const $arrAwdMmth = [
		["Award of Quality", "2013, 2018"],
	];
	const $arrAwdBri = [
		["Best Quality Award", "2016"],
	];
	const $arrAwdHone = [
		["Best Quality Award", "2020, 2021, 2022, 2023"],
		["Best Delivery Award", "2012, 2018, 2021"],
		["Best Cost Award", "2021"],
		["Best Improvement Project", "2012"],
		["Cost Reduction Award", "2007, 2010"],
	];
	
	const path_img_icon = "img/common/icon/icon_";
	const $arrCapability = [
		{
			icon: `${ path_img_icon }die.svg`,
			title: "Tooling & Die",
			h_lang_id: "word_tool",
			items: ["Tooling & Die", "Checking Fixture", "Jig Assembly", "Maintenance Tools"],
			lang_id: "ul_tooling",
			url: "tooling.html"
		},
		{
			icon: `${ path_img_icon }stamping.svg`,
			title: "Stamping",
			h_lang_id: "word_stamp",
			items: ["45 - 600 ton", "Total 50 units", "Progressive 11 units", "Press Tending Robots"],
			lang_id: "ul_stamping",
			url: "stamping.html"
		},
		{
			icon: `${ path_img_icon }welding.svg`,
			title: "Welding",
			h_lang_id: "word_weld",
			items: ["Arc Welding Robots", "Spot Welding"],
			lang_id: "ul_welding",
			url: "welding.html"
		},
		{
			icon: `${ path_img_icon }plateing.svg`,
			title: "Plateing",
			h_lang_id: "word_plate",
			items: ["EDP", "Zinc (Zn)", "Nickel (Ni)", "Chromium (Cr3+, Cr6+)"],
			lang_id: "ul_plating",
			url: "plateing.html"
		}
	];

	
	initializePageSpecificFunctions();
	function initializePageSpecificFunctions() {
		const currentPage = document.body.dataset.page;

		switch (currentPage) {
			case 'index':
				populateHomeProducts();
				loadSVG('img/common/parts_mapping/parts_mapping.svg', 'parts_mapping_container');
				populateCarousel('crsl-pro_gal', $arrProGal);
				populateCarousel('crsl-client', $arrClient);
				Awrd_com_row();
				break;

			case 'about':
				generateTable('about-ComProf1', $arrComProf1);
				generateTable('about-ComProf2', $arrComProf2);
				populateCarousel('crsl-cert', $arrCert);
				loadSVG('img/img-about/org_chart.svg', 'org_ch_container');
				populateCarousel('crsl-client', $arrClient);
				generateTable('wrap_Awd-Mmth', $arrAwdMmth);
				generateTable('wrap_Awd-Bri', $arrAwdBri);
				generateTable('wrap_Awd-Hone', $arrAwdHone);
				
				break;
			
			case 'products':
				populateCard( "prod-sec1_card", $arrCapability );
				loadSVG('img/common/parts_mapping/parts_mapping.svg', 'parts_mapping_container');
				populateCarousel('crsl-pro_gal', $arrProGal);
				populateCarousel('crsl-client', $arrClient);
				
				break;

			// Add more cases for other pages if needed
		}
	}

	// Add any other functions like populateHomeProducts, loadSVG, etc.
	function setReadBtn(url, txt) {
		const readBtn = document.createElement("a");
		readBtn.href = url;
		readBtn.className = "read_btn";
		readBtn.target = "_blank";
		readBtn.textContent = txt;
		return readBtn;
	}
	
	function populateHomeProducts() {
		const $sec = document.getElementById("home-products");
		const $dir_path = "img/img-index/col_3_img-";
		const $data = [
			{ shop: 'Tooling & Die', file_name: 'tooling_die.avif', link: 'https://www.brother-autoparts.com/#/Tooling' },
			{ shop: 'Stamping', file_name: 'stamping.avif', link: 'https://www.brother-autoparts.com/#/Stamping&welding' },
			{ shop: 'Welding', file_name: 'welding.avif', link: 'https://www.brother-autoparts.com/#/Stamping&welding' },
			{ shop: 'Plating', file_name: 'plating.avif', link: 'https://www.brother-autoparts.com/#/PlatingProduct' },
		];

		let $parent = '<div class="row">';
		$data.forEach(value => {
			$parent += `
			<div class="col-md-3 col-6 p-1px">
				<a class="fill_tile pstn_rel_dis_blck" href="${value.link}" title="${value.shop}" target="_blank">
					<img class="img-fluid" src="${$dir_path}${value.file_name}" alt="${value.shop}">
					<div class="中心">
						<h3 class="h2_wh_shadow">${value.shop}</h3>
					</div>
				</a>
			</div>
			`;
		});
		$parent += '</div>';
		$sec.innerHTML += $parent;
	}
	
	// Lazy load function for SVG
	function loadSVG(svgPath, containerId) {
		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					fetch(svgPath)
						.then(response => response.text())
						.then(svgContent => {
							document.getElementById(containerId).innerHTML = svgContent;
							observer.disconnect(); // Stop observing once loaded
						})
						.catch(err => console.error('Failed to load SVG:', err));
				}
			});
		});

		// Observe the container
		const container = document.getElementById(containerId);
		if (container) {
			observer.observe(container);
		}
	}

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
			if (carouselId === 'crsl-client') {
				linkElement.target = "_blank";
			} else {
				linkElement.removeAttribute('target');
				linkElement.addEventListener('click', (event) => {
					event.preventDefault();
					openModal(value.file_name);
				});
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
	
	function Awrd_com_row(){
		const $container = document.getElementById('awrd_com_row');
		const path_Client = "img/img-index/img-crsl-client_gal/logo-";
		const $arrAwrd_com = [
			{ title: 'Mitsubishi Motors (Thailand) Co., Ltd.', file_name: `${path_Client}MMTh.svg`, link_add: 'https://www.mitsubishi-motors.co.th/th?rd=true' },
			{ title: 'H-ONE Parts (Thailand) Co., Ltd.', file_name: `${path_Client}H_one.svg`, link_add: 'https://www.h1-co.jp/eng/' },
			{ title: 'Bridgestone Tire Manufacturing (Thailand) Co., Ltd.', file_name: `${path_Client}Bridgestone.svg`, link_add: 'https://www.bridgestone.co.th/en' },
		];

		$arrAwrd_com.forEach(client => {
			const $innerHTML = `
				<div class="home-awd_com py-2">
					<a href="${client.link_add}" target="_blank">
						<img class="" src="${client.file_name}" alt="${client.title}">
						<div class="caption">${client.title}</div>
					</a>
				</div>
			`;
			$container.innerHTML += $innerHTML;
		});
	}
	
	function generateTable( tableWrapID, data ) {
		const $tableWrap = document.getElementById( tableWrapID );
		let table = document.createElement("table");
		table.setAttribute("border", "1");
		table.setAttribute("cellpadding", "5");
		let i = 1;

		data.forEach(rowData => {
			let tr = document.createElement("tr");

			let th = document.createElement("th");
			th.setAttribute("lang-id", `tr${i}_th`);
			if (tableWrapID.startsWith("about-ComProf")) {
				th.setAttribute("class", "font_blue");
				th.innerHTML = `<span class='material-symbols-outlined'>${rowData[2]}</span>&nbsp; ${rowData[0]}`;
			} else {
				th.innerHTML = rowData[0];
			}
			tr.appendChild(th);

			let td = document.createElement("td");
			td.setAttribute("lang-id", `tr${i}_td`);
			td.innerHTML = rowData[1];
			tr.appendChild(td);

			table.appendChild(tr);
			i++;
		});
		$tableWrap.appendChild(table);
	}
	
	function populateCard(wrapperId, dataArray) {

		const wrapper = document.getElementById(wrapperId);
		if(!wrapper) {
			console.error(`Element with ID '${wrapperId}' not found.`);
			return;
		}
		wrapper.innerHTML = "";

		dataArray.forEach((capability, index) => {
			const colDiv = document.createElement("div");
			colDiv.className = "col-6 col-md-3 py-3";

			const iconDiv = document.createElement("div");
			const img = document.createElement("img");
			img.src = capability.icon;
			img.alt = `Icon of ${capability.title}`;
			iconDiv.appendChild(img);

			const textDiv = document.createElement("div");
			textDiv.classList.add("py-3");
			const title = document.createElement("h5");
			title.textContent = capability.title;
			title.setAttribute("lang-id", capability.h_lang_id);
			title.classList.add("font_blue");

			const ul = document.createElement("ul");
			ul.setAttribute("lang-id", capability.lang_id);
			ul.classList.add("mx-auto");

			capability.items.forEach(item => {
				const li = document.createElement("li");
				li.textContent = item;
				ul.appendChild(li);
			});
			
			const readBtn = setReadBtn(capability.url, "Read More");
		
			textDiv.appendChild(title);
			textDiv.appendChild(ul);
			textDiv.appendChild(readBtn);
			
			colDiv.appendChild(iconDiv);
			colDiv.appendChild(textDiv);

			wrapper.appendChild(colDiv);
		});
	}
});



	

