document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('work-form');
    const worksContainer = document.getElementById('works-container');
    const worksList = document.getElementById('works-list');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        fetch('/works', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert(data.message);
                form.reset();
                fetchWorks();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    function fetchWorks() {
        fetch('/works')
        .then(response => response.json())
        .then(data => {
            worksList.innerHTML = '';
            data.forEach(work => {
                const workItem = document.createElement('div');
                workItem.className = 'work-item';
                workItem.innerHTML = `
                    <h3>${work.title}</h3>
                    <p>${work.description}</p>
                    <img src="/uploads/${work.photo}" alt="${work.title}">
                    <button onclick="editWork(${work.id})">Edit</button>
                    <button onclick="deleteWork(${work.id})">Delete</button>
                `;
                worksList.appendChild(workItem);
            });
        });
    }

    window.editWork = function (id) {
        // Add edit functionality here
    };

    window.deleteWork = function (id) {
        if (confirm('Are you sure you want to delete this work?')) {
            fetch(`/works/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                fetchWorks();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };

    fetchWorks();
});
