// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Service selection system
let selectedServices = [];

// Service selection function
function selectService(serviceText) {
    // Parse service name and price
    const parts = serviceText.split(' - ');
    const serviceName = parts[0];
    const priceText = parts[1];
    
    // Check if service is already selected
    const existingIndex = selectedServices.findIndex(s => s.name === serviceName);
    
    if (existingIndex !== -1) {
        // Remove service if already selected
        selectedServices.splice(existingIndex, 1);
        event.currentTarget.classList.remove('selected');
    } else {
        // Add service to selection
        selectedServices.push({
            name: serviceName,
            price: priceText,
            fullText: serviceText
        });
        event.currentTarget.classList.add('selected');
    }
    
    // Update display
    updateSelectedServicesDisplay();
    updateServiceField();
}

// Update selected services display
function updateSelectedServicesDisplay() {
    const listContainer = document.getElementById('selectedServicesList');
    const totalFinal = document.getElementById('totalFinal');
    const clearButton = document.getElementById('clearSelection');
    
    // Check if we're on products page or services page
    const isProductsPage = document.getElementById('products') !== null;
    
    if (selectedServices.length === 0) {
        listContainer.innerHTML = `<p class="empty-selection">Aucun ${isProductsPage ? 'produit' : 'service'} sélectionné</p>`;
        totalFinal.textContent = '0 F';
        clearButton.style.display = 'none';
        return;
    }
    
    // Display selected services
    let html = '';
    let total = 0;
    
    selectedServices.forEach(service => {
        const price = parseInt(service.price.replace(/[^\d]/g, ''));
        total += price;
        
        html += `
            <div class="selected-service-item">
                <span class="selected-service-name">${service.name}</span>
                <span class="selected-service-price">${service.price}</span>
            </div>
        `;
    });
    
    listContainer.innerHTML = html;
    clearButton.style.display = 'block';
    
    // Check if we're on services page (with discount) or products page (no discount)
    if (!isProductsPage) {
        // Services page with discount
        const totalOriginal = document.getElementById('totalOriginal');
        const discountSection = document.getElementById('discountSection');
        const discountAmount = document.getElementById('discountAmount');
        
        totalOriginal.textContent = formatPrice(total);
        
        if (selectedServices.length >= 3) {
            const discount = Math.round(total * 0.1);
            const finalTotal = total - discount;
            
            discountSection.style.display = 'flex';
            discountAmount.textContent = formatPrice(discount);
            totalFinal.textContent = formatPrice(finalTotal);
        } else {
            discountSection.style.display = 'none';
            totalFinal.textContent = formatPrice(total);
        }
    } else {
        // Products page - no discount
        totalFinal.textContent = formatPrice(total);
    }
}

// Format price with proper spacing
function formatPrice(amount) {
    return amount.toLocaleString('fr-FR') + ' F';
}

// Update service field in form
function updateServiceField() {
    // This function is no longer needed for products page
    // The products are shown in the "Produits Sélectionnés" section above
    // and will be included in the WhatsApp message
    
    // Still keep it for services page
    const serviceField = document.getElementById('service');
    if (serviceField) {
        // Services page
        if (selectedServices.length === 0) {
            serviceField.value = '';
        } else {
            let serviceText = '';
            selectedServices.forEach((service, index) => {
                serviceText += `${index + 1}. ${service.name} - ${service.price}\n`;
            });
            serviceField.value = serviceText;
        }
    }
}

// Clear selection
document.addEventListener('DOMContentLoaded', function() {
    const clearButton = document.getElementById('clearSelection');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            selectedServices = [];
            document.querySelectorAll('.service-item').forEach(item => {
                item.classList.remove('selected');
            });
            updateSelectedServicesDisplay();
            updateServiceField();
        });
    }
});

// Form validation
function validateForm() {
    if (selectedServices.length === 0) {
        alert('Veuillez sélectionner au moins un service');
        return false;
    }
    return true;
}

// Form submission and WhatsApp integration
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up forms...');
    
    const bookingForm = document.getElementById('bookingForm');
    const orderForm = document.getElementById('orderForm');
    
    console.log('bookingForm found:', bookingForm);
    console.log('orderForm found:', orderForm);
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            console.log('Booking form submitted');
            e.preventDefault();
            submitForm('booking');
        });
    }
    
    if (orderForm) {
        console.log('Adding submit listener to order form');
        orderForm.addEventListener('submit', function(e) {
            console.log('Order form submitted');
            e.preventDefault();
            submitForm('order');
        });
    } else {
        console.log('Order form NOT found!');
    }
});

function submitForm(formType) {
    console.log('submitForm called with type:', formType);
    
    // Validate form
    if (!validateForm()) {
        console.log('Form validation failed');
        return;
    }
    
    // Better detection: check if we have address field (products page) or service field (services page)
    const hasAddress = document.getElementById('address') !== null;
    const hasService = document.getElementById('service') !== null;
    
    console.log('hasAddress:', hasAddress, 'hasService:', hasService);
    
    let formData;
    if (hasAddress) {
        // Products page
        formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };
        console.log('Products form data:', formData);
    } else if (hasService) {
        // Services page
        formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value
        };
        console.log('Services form data:', formData);
    } else {
        console.log('Unknown page type!');
        return;
    }
    
    console.log('Creating WhatsApp message...');
    
    // Create WhatsApp message
    let message;
    if (hasAddress) {
        message = `🛍️━━━━━━━━━━━━━━━━━━━━━━━━━━━━🛍️\n`;
        message += `       🏪 COMMANDE COMPLEXE MAME SODA 🏪\n`;
        message += `           👑 CHEZ YAMA KAYRÉ 👑\n`;
        message += `🛍️━━━━━━━━━━━━━━━━━━━━━━━━━━━━🛍️\n\n`;
        
        message += `👤 *INFORMATIONS CLIENT*\n`;
        message += `┌─────────────────────────────┐\n`;
        message += `│ 👤 Nom: ${formData.name}\n`;
        message += `│ 📞 Téléphone: ${formData.phone}\n`;
        message += `│ 🏠 Adresse: ${formData.address}\n`;
        message += `└─────────────────────────────┘\n\n`;
        
        message += `📦 *DÉTAILL DE LA COMMANDE*\n`;
        message += `┌─────────────────────────────┐\n`;
        selectedServices.forEach((service, index) => {
            message += `│ ${index + 1}. ${service.name.padEnd(25)} ${service.price}\n`;
        });
        message += `├─────────────────────────────┤\n`;
        message += `│ 💰 TOTAL À PAYER: ${document.getElementById('totalFinal').textContent.padEnd(12)}\n`;
        message += `└─────────────────────────────┘\n\n`;
        
        message += `🚚 *LIVRAISON À DOMICILE DISPONIBLE*\n`;
        message += `💳 *PAIEMENT À LA LIVRAISON*\n\n`;
        
        message += `📞 *Pour toute information: +221 77 534 36 09*\n`;
        message += `📍 *Disponible à DAKAR RUFISQUE*\n`;
        message += `⏰ *Ouvert 9h - 20h 7/7*\n\n`;
        
        message += `✨ *Merci pour votre confiance !* ✨\n`;
        message += `🛍️━━━━━━━━━━━━━━━━━━━━━━━━━━━━🛍️`;
        
    } else {
        message = `💇━━━━━━━━━━━━━━━━━━━━━━━━━━━━💇\n`;
        message += `       💅 RÉSERVATION COMPLEXE MAME SODA 💅\n`;
        message += `           👑 CHEZ YAMA KAYRÉ 👑\n`;
        message += `💇━━━━━━━━━━━━━━━━━━━━━━━━━━━━💇\n\n`;
        
        message += `👤 *INFORMATIONS CLIENT*\n`;
        message += `┌─────────────────────────────┐\n`;
        message += `│ 👤 Nom: ${formData.name}\n`;
        message += `│ 📞 Téléphone: ${formData.phone}\n`;
        message += `└─────────────────────────────┘\n\n`;
        
        message += `💇‍♀️ *RENDEZ-VOUS DEMANDÉ*\n`;
        message += `┌─────────────────────────────┐\n`;
        message += `│ 📅 Date: ${formData.date}\n`;
        message += `│ ⏰ Heure: ${formData.time}\n`;
        message += `└─────────────────────────────┘\n\n`;
        
        message += `💅 *SERVICES CHOISIS*\n`;
        message += `┌─────────────────────────────┐\n`;
        const serviceLines = formData.service.split('\n');
        serviceLines.forEach(line => {
            if (line.trim()) {
                message += `│ ${line}\n`;
            }
        });
        message += `├─────────────────────────────┤\n`;
        message += `│ 💰 TOTAL: ${document.getElementById('totalFinal').textContent.padEnd(20)}\n`;
        message += `└─────────────────────────────┘\n\n`;
        
        message += `📍 *Adresse: DAKAR RUFISQUE*\n`;
        message += `📞 *Contact: +221 77 534 36 09*\n`;
        message += `⏰ *Ouvert 9h - 20h 7/7*\n\n`;
        
        message += `✨ *Merci pour votre réservation !* ✨\n`;
        message += `💇━━━━━━━━━━━━━━━━━━━━━━━━━━━━💇`;
    }
    
    console.log('Message created, opening WhatsApp...');
    
    // Send to WhatsApp
    const phoneNumber = '221775343609';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    console.log('Opening URL:', whatsappUrl);
    window.open(whatsappUrl, '_blank');
}
