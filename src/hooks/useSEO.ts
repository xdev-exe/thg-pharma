import { useEffect } from 'react';
import { Product } from '../types';

interface SEOProps {
  product?: Product | null;
  lang?: 'ar' | 'en';
}

const DEFAULT_TITLE = 'THG 4 Pharma | مكملات دوبيل هيرز الألمانية الأصلية في مصر (Doppelherz Egypt) — شحن مجاني';
const DEFAULT_DESC = 'شركة THG 4 Pharma — المستورد المعتمد للمكملات الألمانية في مصر من إنتاج Queisser Pharma. احصل على مكملات دوبيل هيرز (Doppelherz Egypt): بيور 3 أوميجا 3 عالي التركيز، كولاجين 1000، حديد دايركت ميكروبيليتس، بيل هيرناكن للشعر. شحن مجاني لكافة محافظات مصر ومعاينة العبوة قبل الدفع.';
const BASE_URL = 'https://thg4pharma.com';

function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(url: string) {
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

export function useSEO({ product, lang = 'ar' }: SEOProps) {
  useEffect(() => {
    if (!product) {
      // Revert to Home Page SEO
      document.title = DEFAULT_TITLE;
      setMetaTag('name', 'description', DEFAULT_DESC);
      setMetaTag('property', 'og:title', DEFAULT_TITLE);
      setMetaTag('property', 'og:description', DEFAULT_DESC);
      setMetaTag('property', 'og:image', `${BASE_URL}/images/products/pure-3.jpg`);
      setMetaTag('property', 'og:url', `${BASE_URL}/`);
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('name', 'twitter:title', DEFAULT_TITLE);
      setMetaTag('name', 'twitter:description', DEFAULT_DESC);
      setMetaTag('name', 'twitter:image', `${BASE_URL}/images/products/pure-3.jpg`);
      setCanonical(`${BASE_URL}/`);

      // Remove specific product jsonld if exists
      const existingScript = document.getElementById('dynamic-product-jsonld');
      if (existingScript) existingScript.remove();
      return;
    }

    // Product-specific SEO
    const productName = lang === 'ar' ? product.name_ar : product.name_en;
    const productDesc = lang === 'ar' ? product.shortDesc_ar : product.shortDesc_en;
    const pageTitle = `${productName} | دوبيل هيرز مصر — THG 4 Pharma`;
    const productUrl = `${BASE_URL}/product/${product.id}`;
    const imageUrl = `${BASE_URL}/images/products/${product.id}.jpg`;

    document.title = pageTitle;
    setMetaTag('name', 'description', productDesc);
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', productDesc);
    setMetaTag('property', 'og:image', imageUrl);
    setMetaTag('property', 'og:image:width', '900');
    setMetaTag('property', 'og:image:height', '1125');
    setMetaTag('property', 'og:image:alt', productName);
    setMetaTag('property', 'og:url', productUrl);
    setMetaTag('property', 'og:type', 'product');
    setMetaTag('property', 'product:price:amount', product.price.toString());
    setMetaTag('property', 'product:price:currency', 'EGP');
    setMetaTag('property', 'product:availability', product.inStock ? 'instock' : 'outofstock');
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', productDesc);
    setMetaTag('name', 'twitter:image', imageUrl);
    setCanonical(productUrl);

    // Inject Product JSON-LD Schema
    let scriptTag = document.getElementById('dynamic-product-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-product-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productName,
      image: imageUrl,
      description: productDesc,
      brand: {
        '@type': 'Brand',
        name: 'Doppelherz aktiv (THG 4 Pharma)',
      },
      manufacturer: {
        '@type': 'Organization',
        name: 'Queisser Pharma GmbH & Co. KG Germany',
      },
      offers: {
        '@type': 'Offer',
        url: productUrl,
        priceCurrency: 'EGP',
        price: product.price.toString(),
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'THG 4 Pharma (True Health Goals)',
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: 'EGP',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'EG',
          },
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '128',
      },
    };

    scriptTag.textContent = JSON.stringify(schemaData);

    return () => {
      // Cleanup when unmounting product page
      const script = document.getElementById('dynamic-product-jsonld');
      if (script) script.remove();
    };
  }, [product, lang]);
}
