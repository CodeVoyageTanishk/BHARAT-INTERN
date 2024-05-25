document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      // Retrieve form data
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const studentId = document.getElementById('studentId').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const gender = document.getElementById('gender').value;
  
      // Send data to server
      fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          studentId,
          email,
          password,
          gender
        })
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message); // Display server response
        form.reset(); // Clear form fields after submission
      })
      .catch(error => console.error('Error:', error));
    });
  });
  