/**
 * ============================================
 * SCRIPT BOUTIQUE - Gestion de la page boutique
 * ============================================
 *
 * Ce fichier gère la logique spécifique à la page boutique :
 * - Redirection vers le formulaire de contact avec pré-remplissage
 * - Gestion des commandes
 * - Calcul du prix total selon la quantité
 */

// ============================================
// CONFIGURATION DES PRIX
// ============================================
// Définissez ici les prix unitaires des produits
// Mettez 0 pour "Prix sur demande"
const PRODUCT_PRICES = {
  'dessous-verres': 0, // Prix sur demande
  'dessous-table': 0 // Prix sur demande
}

// ============================================
// GESTION DU CALCUL DES PRIX
// ============================================

/**
 * Calcule et affiche le prix total pour un produit
 * @param {HTMLElement} shopItem - L'élément du produit
 */
function updateProductTotal(shopItem) {
  const quantityInput = shopItem.querySelector('.shop-item__quantity-input')
  const priceUnit = shopItem.querySelector('.shop-item__price-unit')
  const totalPrice = shopItem.querySelector('.shop-item__total-price')

  if (!quantityInput || !priceUnit || !totalPrice) return

  const productId = quantityInput.getAttribute('data-product')
  const unitPrice = PRODUCT_PRICES[productId] || 0
  const quantity = parseInt(quantityInput.value) || 1

  // Mettre à jour le prix unitaire si défini
  if (unitPrice > 0) {
    priceUnit.textContent = `${unitPrice.toFixed(2)} €`
    const total = unitPrice * quantity
    totalPrice.textContent = `${total.toFixed(2)} €`
  } else {
    // Si prix sur demande, afficher "Prix sur demande"
    const currentLang = document.documentElement.lang || 'fr'
    const priceText =
      currentLang === 'fr' ? 'Prix sur demande' : 'Price on request'
    priceUnit.textContent = priceText
    totalPrice.textContent = priceText
  }
}

/**
 * Initialise les gestionnaires d'événements pour les quantités
 */
function initQuantityHandlers() {
  const quantityInputs = document.querySelectorAll('.shop-item__quantity-input')

  quantityInputs.forEach((input) => {
    // Calculer le total quand la quantité change
    input.addEventListener('input', () => {
      const shopItem = input.closest('.shop-item')
      updateProductTotal(shopItem)
    })

    // Empêcher les valeurs négatives
    input.addEventListener('change', () => {
      if (parseInt(input.value) < 1) {
        input.value = 1
        const shopItem = input.closest('.shop-item')
        updateProductTotal(shopItem)
      }
    })
  })

  // Calculer les totaux initiaux
  document.querySelectorAll('.shop-item').forEach((item) => {
    updateProductTotal(item)
  })
}

// ============================================
// GESTION DES BOUTONS DE COMMANDE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialiser les gestionnaires de quantité
  initQuantityHandlers()

  // Attacher les event listeners pour les boutons "Commander"
  const orderButtons = document.querySelectorAll('.shop-item__btn')

  orderButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault()
      const shopItem = button.closest('.shop-item')
      const product = button.getAttribute('data-product')
      const productName = shopItem.querySelector('h3').textContent
      const quantityInput = shopItem.querySelector('.shop-item__quantity-input')
      const quantity = quantityInput ? quantityInput.value : '1'
      const totalPrice = shopItem.querySelector(
        '.shop-item__total-price'
      ).textContent

      // Rediriger vers le formulaire de contact avec le produit en paramètre
      const contactUrl = `index.html#contact?product=${encodeURIComponent(
        product
      )}&name=${encodeURIComponent(productName)}&quantity=${encodeURIComponent(
        quantity
      )}&price=${encodeURIComponent(totalPrice)}`
      window.location.href = contactUrl
    })
  })

  // Mise à jour de l'année dans le footer
  const yearEl = document.getElementById('year')
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear()
  }
})
