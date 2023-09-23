<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>


    // Put DOM elements into variables
    const myForm = document.querySelector('#my-form');
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const msg = document.querySelector('.msg');
    const userList = document.querySelector('#users');

    // Base URL for the CRUD CRUD API
    const apiBaseUrl = 'http://localhost:3000/user/add-user'; // Replace 'your-api-key' with your actual API key

    // Function to delete a user from the API
    function deleteUser(key, li) {
        // Make a DELETE request to the API
        axios.delete(`${apiBaseUrl}/${key}`)
            .then(() => {
                // Remove the corresponding list item from the UI
                li.remove();
            })
            .catch(error => console.error(error));
    }

    // Function to edit a user
    function editUser(key, li) {
        // Retrieve the user object from the API using the key
        axios.get(`${apiBaseUrl}/${key}`)
            .then(response => {
                const user = response.data;
                // Prompt the user to enter the corrected email
                const correctedEmail = prompt('Enter the corrected email:', user.email);

                // Update the user object with the corrected email
                user.email = correctedEmail;

                // Store the updated user object back in the API using the key
                axios.put(`${apiBaseUrl}/${key}`, user)
                    .then(() => {
                        // Update the email in the UI
                        const userText = li.firstChild;
                        userText.textContent = `${user.name}: ${user.email}`;
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    }

    function onSubmit(e) {
        e.preventDefault();

        if (nameInput.value === '' || emailInput.value === '') {
            msg.classList.add('error');
            msg.innerHTML = 'Please enter all fields';
            setTimeout(() => msg.remove(), 3000);
        } else {
            const user = {
                name: nameInput.value,
                email: emailInput.value
            };

            // Make a POST request to the API to create a new user
            axios.post(apiBaseUrl, user)
                .then(response => {
                    const key = response.data._id; // Assuming the API returns an '_id' field for the newly created user

                    // Create new list item with user
                    const li = document.createElement('li');
                    li.appendChild(document.createTextNode(`${user.name}: ${user.email}`));

                    // Create an edit button
                    const editButton = document.createElement('button');
                    editButton.innerText = 'Edit';
                    editButton.addEventListener('click', () => editUser(key, li));

                    // Append the edit button to the list item
                    li.appendChild(editButton);

                    // Create a delete button
                    const deleteButton = document.createElement('button');
                    deleteButton.innerText = 'Delete';
                    deleteButton.addEventListener('click', () => deleteUser(key, li));

                    // Append the delete button to the list item
                    li.appendChild(deleteButton);

                    // Append the list item to the user list in the HTML
                    userList.appendChild(li);

                    nameInput.value = '';
                    emailInput.value = '';
                })
                .catch(error => console.error(error));
        }
    }

    // Listen for form submit
    myForm.addEventListener('submit', onSubmit);
