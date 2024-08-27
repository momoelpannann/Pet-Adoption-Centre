function validateForm(formId, formFields) {
    let formValid = true;
    let errorMessage = "";

    formFields.forEach(field => {
        const fieldValue = document.getElementById(field).value.trim();
        if (fieldValue === "") {
            formValid = false;
            errorMessage = "Please fill out all fields.";
            document.getElementById(field).classList.add('error');
        } else {
            document.getElementById(field).classList.remove('error');
        }
    });

    const emailField = document.getElementById(formFields[formFields.length - 1]).value.trim();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(emailField)) {
        formValid = false;
        errorMessage = "Please enter a valid email address.";
        document.getElementById(formFields[formFields.length - 1]).classList.add('error');
    } else {
        document.getElementById(formFields[formFields.length - 1]).classList.remove('error');
    }

    if (formValid) {
        document.getElementById(formId).submit(); // Submit the form if valid
    } else {
        document.getElementById('error-message').textContent = errorMessage;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('searchForm')) {
        document.getElementById('searchForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const formFields = ['animal', 'breed', 'age', 'gender', 'location', 'email'];
            validateForm('searchForm', formFields);
        });
    }

    if (document.getElementById('giveAwayForm')) {
        document.getElementById('giveAwayForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const formFields = ['pet-type', 'pet-breed', 'pet-age', 'pet-gender', 'gets-along-dogs', 'gets-along-cats', 'suitable-for-children', 'comments', 'owner-name', 'owner-email'];
            validateForm('giveAwayForm', formFields);
        });
    }
});