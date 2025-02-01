# Amazon EAN Barcode Generator

![License](https://img.shields.io/badge/license-GPL%20v3.0-green)

## 📜 Description

This userscript automatically generates a barcode next to the EAN (ISBN) code on book pages on Amazon and uses [JsBarcode](https://github.com/lindell/JsBarcode) to render the barcode.


---

## 🚀 Features

- Automatically detects and extracts the EAN code on supported pages.
- Dynamically generates a barcode using the EAN code.
- Lightweight and fast.

---

## 🛠️ Installation

1. Install a userscript manager for your browser:
    - [ViolentMonkey](https://violentmonkey.github.io/)(Recommended)
    - [Tampermonkey](https://www.tampermonkey.net/)
    - [Greasemonkey](https://www.greasespot.net/)
    - ~~[AdGuard](https://adguard.com/fr/welcome.html)~~(Not working)

3. Click on the link below to install the script:
    - [Install the Script](https://github.com/nitatemic/Amazon-EAN-Barcode-Generator/raw/main/amazon-barcode-generator.user.js)

4. Visit a book page on Amazon (e.g., [Rent-a-Girlfriend Volume 3](https://www.amazon.fr/Rent-Girlfriend-T03-MIYAJIMA-REIJI/dp/2490676903)) to see it in action!

---

## 📄 How It Works

1. The script scans the page for the EAN (ISBN) code.
2. It generates a barcode using the `JsBarcode` library.
3. The barcode is displayed directly below the EAN code on the page.

---

## 🖥️ Development

### Prerequisites
- Basic knowledge of userscripts.
- A userscript manager (e.g., Tampermonkey).

### Modify the Script
1. Clone the repository:
   ```bash
   git clone https://github.com/nitatemic/Amazon-EAN-Barcode-Generator.git
   cd Amazon-EAN-Barcode-Generator
