// ==UserScript==
// @name         Amazon EAN Barcode Generator
// @namespace    https://github.com/nitatemic
// @version      2.0
// @description  Automatically generates both EAN (ISBN) and ASIN barcodes on Amazon book pages. Features dual barcode display with legends and enhanced styling.
// @author       Nitatemic
// @license      GPL-3.0-only
// @match        https://www.amazon.*/*
// @require      https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js
// @grant        GM_addStyle
// @homepageURL  https://github.com/nitatemic/Amazon-EAN-Barcode-Generator
// @supportURL   https://github.com/nitatemic/Amazon-EAN-Barcode-Generator/issues
// @updateURL    https://github.com/nitatemic/Amazon-EAN-Barcode-Generator/raw/main/Amazon-barcode-generator.user.js
// @downloadURL  https://github.com/nitatemic/Amazon-EAN-Barcode-Generator/raw/main/Amazon-barcode-generator.user.js
// ==/UserScript==

(function() {
	'use strict';

	GM_addStyle(`
        #barcode-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
            padding: 15px;
            border: 2px solid #4a90e2;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: Arial, sans-serif;
            min-width: 300px;
        }
        #barcode-close {
            cursor: pointer;
            float: right;
            font-weight: bold;
            margin-left: 10px;
            color: #666;
            font-size: 18px;
            line-height: 1;
        }
        #barcode-close:hover {
            color: #000;
        }
        .barcode-section {
            margin: 10px 0;
            text-align: center;
            padding: 10px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .barcode-label {
            font-size: 12px;
            font-weight: bold;
            color: #333;
            margin-top: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .barcode-value {
            font-size: 11px;
            color: #666;
            margin-top: 2px;
            font-family: monospace;
        }
        .barcode-title {
            text-align: center;
            color: #4a90e2;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 5px;
        }
    `);

	/**
	 * Extraction de l'ASIN à partir de l'URL ou des métadonnées de la page
	 */
	function extractASIN() {
		// Méthode 1: Extraire de l'URL
		const urlMatch = window.location.pathname.match(/\/([A-Z0-9]{10})(?:\/|$)/);
		if (urlMatch) {
			return urlMatch[1];
		}
		
		// Méthode 2: Chercher dans les métadonnées
		const metaElement = document.querySelector('meta[name="ASIN"]');
		if (metaElement) {
			return metaElement.content;
		}
		
		// Méthode 3: Chercher dans les attributs data-asin
		const asinElement = document.querySelector('[data-asin]');
		if (asinElement && asinElement.getAttribute('data-asin').match(/^[A-Z0-9]{10}$/)) {
			return asinElement.getAttribute('data-asin');
		}
		
		// Méthode 4: Chercher dans le texte de la page
		const textMatch = document.body.innerText.match(/ASIN[:\s]*([A-Z0-9]{10})/i);
		if (textMatch) {
			return textMatch[1];
		}
		
		return null;
	}

	/**
	 * Extraction de l'ISBN à partir de la nouvelle div.
	 * La structure HTML ressemble à :
	 *
	 * <div id="rpi-attribute-book_details-isbn13" ...>
	 *    <div class="... rpi-attribute-label"><span>ISBN-13</span></div>
	 *    <div class="..."><span class="rpi-icon book_details-isbn13"></span></div>
	 *    <div class="... rpi-attribute-value"><span>978-1648273629</span></div>
	 * </div>
	 */
	function extractISBN() {
		const isbnDiv = document.getElementById('rpi-attribute-book_details-isbn13');
		if (isbnDiv) {
			const span = isbnDiv.querySelector('.rpi-attribute-value span');
			if (span) {
				const isbn = span.textContent.replace(/[^0-9X]/gi, '');
				if (isbn.length >= 10) {
					return isbn;
				}
			}
		}
		// Si la structure personnalisée n'est pas trouvée, on peut envisager des sélecteurs de repli.
		const selectors = [
			'th:contains("ISBN-13") + td',
			'th:contains("ISBN-10") + td',
			'li:contains("ISBN-13") span',
			'li:contains("ISBN-10") span'
		];

		const findElement = (selector) => {
			// Attention : :contains n'est pas un sélecteur CSS valide en natif.
			// Vous pouvez adapter cette partie si nécessaire en parcourant tous les éléments.
			const [tag, containsText] = selector.split(':contains("');
			const content = containsText ? containsText.replace('")', '') : null;
			return Array.from(document.querySelectorAll(tag)).find(el => {
				return content ? el.textContent.includes(content) : true;
			});
		};

		for (let selector of selectors) {
			const element = findElement(selector);
			if (element) {
				const isbn = element.textContent.replace(/[^0-9X]/gi, '');
				if (isbn.length >= 10) return isbn;
			}
		}
		return null;
	}

	function createBarcodes(isbn, asin) {
		const container = document.createElement('div');
		container.id = 'barcode-container';

		const closeButton = document.createElement('span');
		closeButton.id = 'barcode-close';
		closeButton.innerHTML = '×';
		closeButton.onclick = () => container.remove();

		const title = document.createElement('div');
		title.className = 'barcode-title';
		title.textContent = 'Codes-barres Amazon';

		container.appendChild(closeButton);
		container.appendChild(title);

		// Section EAN/ISBN
		if (isbn) {
			const isbnSection = document.createElement('div');
			isbnSection.className = 'barcode-section';
			
			const isbnSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			isbnSvg.id = 'barcode-isbn';
			
			const isbnLabel = document.createElement('div');
			isbnLabel.className = 'barcode-label';
			isbnLabel.textContent = 'EAN/ISBN';
			
			const isbnValue = document.createElement('div');
			isbnValue.className = 'barcode-value';
			isbnValue.textContent = isbn;

			isbnSection.appendChild(isbnSvg);
			isbnSection.appendChild(isbnLabel);
			isbnSection.appendChild(isbnValue);
			container.appendChild(isbnSection);

			JsBarcode(isbnSvg, isbn, {
				format: "EAN13",
				displayValue: false,
				fontSize: 12,
				margin: 5,
				height: 60,
				background: "#ffffff",
				lineColor: "#000000"
			});
		}

		// Section ASIN
		if (asin) {
			const asinSection = document.createElement('div');
			asinSection.className = 'barcode-section';
			
			const asinSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			asinSvg.id = 'barcode-asin';
			
			const asinLabel = document.createElement('div');
			asinLabel.className = 'barcode-label';
			asinLabel.textContent = 'ASIN';
			
			const asinValue = document.createElement('div');
			asinValue.className = 'barcode-value';
			asinValue.textContent = asin;

			asinSection.appendChild(asinSvg);
			asinSection.appendChild(asinLabel);
			asinSection.appendChild(asinValue);
			container.appendChild(asinSection);

			JsBarcode(asinSvg, asin, {
				format: "CODE128",
				displayValue: false,
				fontSize: 12,
				margin: 5,
				height: 60,
				background: "#ffffff",
				lineColor: "#000000"
			});
		}

		document.body.appendChild(container);
	}

	function init() {
		// Vous pouvez ajuster cette condition si l'ID 'dp' n'est plus présent sur les pages livres.
		if (!document.getElementById('dp') && !document.getElementById('rpi-attribute-book_details-isbn13')) return;

		const isbn = extractISBN();
		const asin = extractASIN();
		
		if (isbn || asin) {
			console.log('Codes trouvés - ISBN:', isbn, 'ASIN:', asin);
			createBarcodes(isbn, asin);
		} else {
			console.log('Aucun code trouvé (ISBN ou ASIN)');
		}
	}

	window.addEventListener('load', init, false);
})();
