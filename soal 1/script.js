document.getElementById('registrationForm').addEventListener('submit', function(event) {;
    
    event.preventDefault();

    document.querySelectorAll('.error').forEach(error => {
        error.style.display = 'none';
    });

    document.getElementById('successMessage').style.display = 'none';

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let isValid = true;

    if (fullName === '') {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

    if (password.length < 8) {
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').style.display = 'block';
        isValid = false;
    }
    
    if (isValid) {
        document.getElementById('successMessage').style.display = 'block';
        
        document.getElementById('registrationForm').reset();
        
    }    
});