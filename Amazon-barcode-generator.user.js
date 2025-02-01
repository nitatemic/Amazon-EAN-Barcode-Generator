// ==UserScript==
// @name         Amazon EAN Barcode Generator
// @namespace    https://github.com/nitatemic
// @version      1.0
// @description  Automatically generates a barcode next to the EAN (ISBN) code on book pages on Amazon. And uses JsBarcode to render the barcode visually.
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
            background: white;
            padding: 10px;
            border: 1px solid #ccc;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 9999;
        }
        #barcode-close {
            cursor: pointer;
            float: right;
            font-weight: bold;
            margin-left: 10px;
        }
    `);

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

	function createBarcode(isbn) {
		const container = document.createElement('div');
		container.id = 'barcode-container';

		const closeButton = document.createElement('span');
		closeButton.id = 'barcode-close';
		closeButton.innerHTML = '×';
		closeButton.onclick = () => container.remove();

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.id = 'barcode';

		container.appendChild(closeButton);
		container.appendChild(svg);
		document.body.appendChild(container);

		JsBarcode(svg, isbn, {
			format: "EAN13",
			displayValue: true,
			fontSize: 12,
			margin: 5
		});
	}

	function init() {
		// Vous pouvez ajuster cette condition si l'ID 'dp' n'est plus présent sur les pages livres.
		if (!document.getElementById('dp') && !document.getElementById('rpi-attribute-book_details-isbn13')) return;

		const isbn = extractISBN();
		if (isbn) {
			console.log('ISBN trouvé:', isbn);
			createBarcode(isbn);
		}
	}

	window.addEventListener('load', init, false);
})();
