# Amazon EAN & ASIN Barcode Generator

![License](https://img.shields.io/badge/license-GPL%20v3.0-green)
![Version](https://img.shields.io/badge/version-2.0-blue)

## 📜 Description

This userscript automatically generates barcodes for books on Amazon, displaying both **EAN/ISBN** and **ASIN** codes with a modern and professional design. It uses [JsBarcode](https://github.com/lindell/JsBarcode) for barcode rendering.


---

## 🚀 Features

### ✨ Version 2.0 - New Features

- **Dual barcodes**: Simultaneous display of EAN/ISBN and ASIN codes
- **Modern interface**: Design with blue gradient and separate sections
- **Clear legends**: Visual identification of each code type
- **Displayed values**: Codes are visible below each barcode
- **Scan optimized**: Pure white background and optimal contrast

### 🔧 Core Features

- Automatic detection of EAN/ISBN and ASIN codes
- Dynamic barcode generation
- Robust extraction from URL and metadata
- Lightweight and fast
- Repositionable interface with close button

---

## 🛠️ Installation

1. Install a userscript manager for your browser:
   - [AdGuard](https://adguard.com/fr/welcome.html) (Recommended)
   - [ViolentMonkey](https://violentmonkey.github.io/)
   - [Tampermonkey](https://www.tampermonkey.net/)
   - [Greasemonkey](https://www.greasespot.net/)

2. Click on the link below to install the script:
   - [Install the Script](https://github.com/nitatemic/Amazon-EAN-Barcode-Generator/raw/refs/heads/master/Amazon-barcode-generator.user.js)

3. Visit a book page on Amazon (e.g., [Rent-a-Girlfriend Volume 3](https://www.amazon.fr/Rent-Girlfriend-T03-MIYAJIMA-REIJI/dp/2490676903)) to see it in action!

---

## 📄 How It Works

1. The script scans the page to detect EAN/ISBN and ASIN codes
2. It generates barcodes using the `JsBarcode` library
3. The barcodes are displayed in an elegant widget at the bottom left with:
   - **EAN/ISBN** in EAN13 format for books
   - **ASIN** in CODE128 format for Amazon identifier
   - Legends and values below each barcode
4. Modern interface with blue gradient background and white sections for optimal scanning

---

## 🎨 Preview

The widget displays:

- 📊 **Dual barcodes** with optimal formats
- 🏷️ **Clear legends** to identify each code
- 🎯 **Visible values** in monospace font
- 🎨 **Modern design** with blue gradient and shadows
- ❌ **Close button** to hide the widget

---

## 🖥️ Development

### Prerequisites

- Basic knowledge of userscripts
- A userscript manager (e.g., Tampermonkey)

### Modify the Script

1. Clone the repository:

   ```bash
   git clone https://github.com/nitatemic/Amazon-EAN-Barcode-Generator.git
   cd Amazon-EAN-Barcode-Generator
   ```

2. Modify the `Amazon-barcode-generator.user.js` file
3. Reload the script in your userscript manager

