function generatePassword() {
    const passwordLength = document.getElementById('passwordLength').value;
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSpecialChars = document.getElementById('includeSpecialChars').checked;

    const generatedPassword = generateRandomPassword(passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSpecialChars);

    document.getElementById('generatedPassword').value = generatedPassword;
}

function exportPasswords() {
    const passwordsExport = [];
    
    // Iterate through local storage and gather password data
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const accountData = JSON.parse(localStorage.getItem(key));
        passwordsExport.push({ username: key, password: accountData.password });
    }

    // Convert the array to JSON
    const jsonExport = JSON.stringify(passwordsExport, null, 2);

    // Create a Blob and initiate download
    const blob = new Blob([jsonExport], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'passwords_export.json';
    a.click();
}

function importPasswords() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const importedData = JSON.parse(e.target.result);

                // Iterate through imported data and store in local storage
                importedData.forEach(item => {
                    localStorage.setItem(item.username, JSON.stringify({ username: item.username, password: item.password }));
                });

                // Update the password list
                updatePasswordList();
                alert('Passwords successfully imported!');
            } catch (error) {
                alert('Error parsing imported file. Please make sure it is a valid JSON file.');
            }
        };

        reader.readAsText(file);
    }
}

function generateRandomPassword(length, uppercase, lowercase, numbers, specialCharsEnabled) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()-_=+[]{}|;:\'",.<>?/`~';
    let allChars = '';

    if (uppercase) allChars += uppercaseChars;
    if (lowercase) allChars += lowercaseChars;
    if (numbers) allChars += numberChars;
    if (specialCharsEnabled) allChars += specialChars;

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars.charAt(randomIndex);
    }

    return password;
}

// ... (previous code)



function savePassword() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check password strength
    const strength = checkPasswordStrength(password);
    updatePasswordStrengthMeter(strength);

    // Hash the password before storing
    const hashedPassword = hashPassword(password);

    // Store hashed password in local storage
    const accountData = { username, password: hashedPassword };
    localStorage.setItem(username, JSON.stringify(accountData));

    // Clear form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    // Update the password list
    updatePasswordList();
}

function checkPasswordStrength(password) {
    // Implement a password strength check
    const length = password.length;
    if (length < 8) {
        return 'Weak';
    } else if (length < 12) {
        return 'Medium';
    } else {
        return 'Strong';
    }
}

function updatePasswordStrengthMeter(strength) {
    const meter = document.getElementById('passwordStrength');
    switch (strength) {
        case 'Weak':
            meter.value = 33;
            break;
        case 'Medium':
            meter.value = 66;
            break;
        case 'Strong':
            meter.value = 100;
            break;
        default:
            meter.value = 0;
            break;
    }
}

function hashPassword(password) {
    // Implement a secure password using hash function.
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = (hash << 5) - hash + char;
    }
    return hash.toString();
}

function updatePasswordList() {
    const passwordListContainer = document.getElementById('passwordList');
    passwordListContainer.innerHTML = '<h2>Passwords</h2>';

    // Iterate through local storage and display stored passwords
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const accountData = JSON.parse(localStorage.getItem(key));
        passwordListContainer.innerHTML += `<p><strong>${key}:</strong> ${accountData.password}</p>`;
    }
}
