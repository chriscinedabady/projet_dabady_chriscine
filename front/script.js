document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
  
    // Regex standard pour vérifier le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    form.addEventListener('submit', (event) => {
      // Empêche le rechargement de la page à la soumission
      event.preventDefault();
  
      // Réinitialisation préalable des styles et messages d'erreur
      clearErrors();
  
      let isValid = true;
  
      // 1. Récupération des éléments du formulaire
      const fields = {
        login: document.getElementById('login'),
        password: document.getElementById('password'),
        confirmedPassword: document.getElementById('confirmed_password'),
        lastname: document.getElementById('lastname'),
        firstname: document.getElementById('firstname'),
        address: document.getElementById('address'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        birthdate: document.getElementById('birthdate')
      };
  
      // 2. Vérification que tous les champs sont remplis
      Object.entries(fields).forEach(([key, input]) => {
        if (!input || input.value.trim() === '') {
          showError(input, 'Ce champ est requis.');
          isValid = false;
        }
      });
  
      // Si des champs requis sont vides, on arrête la validation détaillée
      if (!isValid) return;
  
      // 3. Vérification du format de l'email
      if (!emailRegex.test(fields.email.value.trim())) {
        showError(fields.email, 'Veuillez saisir une adresse email valide.');
        isValid = false;
      }
  
      // 4. Vérification de la correspondance des mots de passe
      if (fields.password.value !== fields.confirmedPassword.value) {
        showError(fields.confirmedPassword, 'Les mots de passe ne correspondent pas.');
        isValid = false;
      }
  
      // 5. Si tout est valide : masquer le formulaire et afficher le récapitulatif
      if (isValid) {
        displaySummary(fields);
      }
    });
  
    /**
     * Affiche un message d'erreur sous le champ concerné et applique la classe CSS .error
     */
    function showError(input, message) {
      if (!input) return;
      input.classList.add('error');
      const pError = input.nextElementSibling;
      if (pError && pError.tagName === 'P') {
        pError.textContent = message;
        pError.classList.add('error-message');
      }
    }
  
    /**
     * Réinitialise les erreurs précédentes sur tous les champs
     */
    function clearErrors() {
      const inputs = form.querySelectorAll('input');
      inputs.forEach((input) => {
        input.classList.remove('error');
        const pError = input.nextElementSibling;
        if (pError && pError.tagName === 'P') {
          pError.textContent = '';
          pError.classList.remove('error-message');
        }
      });
    }
  
    /**
     * Masque le formulaire et génère la carte récapitulative dans la même page
     */
    function displaySummary(fields) {
        // 1. Masquer le formulaire
        document.getElementById('registration-form').style.display = 'none';
      
        // 2. Formater la date en français
        const rawDate = fields.birthdate.value;
        const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('fr-FR') : rawDate;
      
        // 3. Remplir les champs du récapitulatif
        document.getElementById('res-login').textContent = fields.login.value;
        document.getElementById('res-lastname').textContent = fields.lastname.value;
        document.getElementById('res-firstname').textContent = fields.firstname.value;
        document.getElementById('res-address').textContent = fields.address.value;
        document.getElementById('res-email').textContent = fields.email.value;
        document.getElementById('res-phone').textContent = fields.phone.value;
        document.getElementById('res-birthdate').textContent = formattedDate;
      
        // 4. Afficher la carte de récapitulatif
        document.getElementById('summary-card').style.display = 'block';
      }
  
    /**
     * Sécurise les entrées utilisateur contre les injections XSS lors de l'affichage
     */
    function escapeHtml(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  });