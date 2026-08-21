# Cell2U Catalogue Image Assets

The catalogue uses free representative smartphone photography collected from image-search results referencing Unsplash/Pexels-style stock sources. These images are visual placeholders for the listed device models; they are not official manufacturer product photography and should be replaced with owned or licensed model-specific images before commercial use.

| Local source | Intended use |
|---|---|
| `/home/ubuntu/upload/search_images/iuatRVxPX8f5.jpg` | Light device image set |
| `/home/ubuntu/upload/search_images/ExmbHWKJD47U.jpg` | Neutral phone image set |
| `/home/ubuntu/upload/search_images/w6ghw3liQ4Hb.jpg` | Dark device image set |
| `/home/ubuntu/upload/search_images/6zj0Ds2YwImx.jpeg` | Multi-device image set |
| `/home/ubuntu/upload/search_images/smbGLfGrGfH0.jpg` | Bright handset image set |

The package stores local copies under `images/catalogue/` and maps them in `data/products.json`.


## Verification

The managed homepage, shop page, and Huawei Y60 product page were visually checked after the JSON image mapping. Images load in the product grid and product detail view. Because these are representative brand-level assets rather than official model photography, the CMS guide explicitly recommends replacing them with owned or licensed model-specific images before commercial publication.


## User-supplied link audit

The Huawei Y90 link resolved to a product page and exposed a direct image URL in its extracted content: `https://welectronics.com/images/stories/virtuemart/product/HuaweinovaY90green39.jpg`.

The Huawei Y91 link redirected to a MobileStore page that returned a 404, so it should retain a renderable fallback while keeping the supplied URL as source metadata. The user-supplied image links for the remaining catalogue entries are treated as direct image URLs and will be stored exactly as supplied.


The supplied Huawei Nova 13i page exposed a direct image URL: `https://www.gsmarena.com.bd/images/products/Huawei-Nova-13i-Blue.webp`. The original page URL remains stored as `image_source` metadata.
