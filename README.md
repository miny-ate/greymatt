# GREYMATT — Shopping Website

> *All accessories under one roof*

## 📁 Folder Structure

```
GREYMATT/
├── index.html              ← Main website file
├── css/
│   └── style.css           ← All styles
├── js/
│   └── main.js             ← WhatsApp ordering + interactions
├── images/
│   ├── watches/            ← Add watch images here
│   │   ├── watch1.jpg
│   │   ├── watch2.jpg
│   │   ├── watch3.jpg
│   │   └── watch4.jpg
│   ├── shoes/              ← Add shoe images here
│   │   ├── shoe1.jpg
│   │   ├── shoe2.jpg
│   │   ├── shoe3.jpg
│   │   └── shoe4.jpg
│   ├── electrical/         ← Add electrical appliance images here
│   │   ├── elec1.jpg
│   │   ├── elec2.jpg
│   │   ├── elec3.jpg
│   │   └── elec4.jpg
│   ├── clothing/           ← Add clothing images here
│   │   ├── cloth1.jpg
│   │   ├── cloth2.jpg
│   │   ├── cloth3.jpg
│   │   └── cloth4.jpg
│   └── stationery/         ← Add stationery images here
│       ├── stat1.jpg
│       ├── stat2.jpg
│       ├── stat3.jpg
│       └── stat4.jpg
└── README.md
```

---

## 🖼️ How to Add Images

1. Rename your product images to match the filenames above (e.g. `watch1.jpg`, `shoe1.jpg`)
2. Upload them to the matching folder in `images/`
3. The website will automatically display them

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`

---

## ✏️ How to Edit Product Names & Prices

Open `index.html` and find any product card. Edit these fields:

```html
<h3 class="product-name">Watch Name Here</h3>        ← Change product name
<p class="product-desc-text">Short description</p>   ← Change description
<span class="product-price">KSh ——</span>            ← Change price e.g. KSh 2,500
```

---

## ➕ How to Add More Products

Copy and paste a product card block inside any `.product-grid`:

```html
<div class="product-card">
  <div class="product-img-wrap">
    <img src="images/watches/watch5.jpg" alt="Watch 5" class="product-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="img-placeholder">📷 Add Image</div>
  </div>
  <div class="product-info">
    <h3 class="product-name">New Watch Name</h3>
    <p class="product-desc-text">Description of this watch.</p>
    <div class="product-footer">
      <span class="product-price">KSh 3,500</span>
      <button class="add-to-order" onclick="openOrder('New Watch Name')">Order</button>
    </div>
  </div>
</div>
```

---

## 📱 How Orders Work

When a customer clicks **Order** on any product:
1. A quick form pops up asking for their name, phone, and location
2. They click **Send via WhatsApp**
3. A pre-filled WhatsApp message is sent directly to **0725 462 559**
4. You receive the order details instantly on WhatsApp

The main **Order Now** form at the bottom also sends orders via WhatsApp with full details.

---

## 🚀 How to Host on GitHub Pages (Free)

1. Go to [github.com](https://github.com) and create a free account
2. Click **New Repository** → name it `greymatt` → set to **Public**
3. Upload all files (keep the folder structure)
4. Go to **Settings → Pages**
5. Under **Source**, select `main` branch → click **Save**
6. Your website will be live at: `https://yourusername.github.io/greymatt`

---

## 📞 Contact Info in Website

- **Email:** greymatt@gmail.com
- **Phone:** 0725 462 559
- **WhatsApp:** Linked to 0725 462 559

To change contact info, search for `greymatt@gmail.com` and `254725462559` in `index.html` and `js/main.js`.

---

*Built for GREYMATT — All accessories under one roof*
