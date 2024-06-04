document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('work-form');
    const worksList = document.getElementById('works-list');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const closeButton = document.getElementById('close-button');
    let worksData = [];
  
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
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
  
    searchButton.addEventListener('click', function () {
      const searchTerm = searchInput.value.toLowerCase();
      fetchWorks(searchTerm);
    });
  
    closeButton.addEventListener('click', function () {
      worksList.innerHTML = '';
      closeButton.style.display = 'none';
    });
  
    function fetchWorks(searchTerm) {
      fetch('/works')
        .then(response => response.json())
        .then(data => {
          worksData = data;
          const filteredWorks = worksData.filter(work =>
            work.title.toLowerCase().includes(searchTerm) ||
            work.description.toLowerCase().includes(searchTerm)
          );
          displayWorks(filteredWorks);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
    function displayWorks(works) {
      worksList.innerHTML = '';
      works.forEach(work => {
        const workItem = document.createElement('div');
        workItem.className = 'work-item';
        workItem.innerHTML = `
          <div class="workItemContainer">
            <h3 class="workTitle">${work.title}</h3>
            <p class="workDescription">${work.description}</p>
            <img class="workPhoto" src="/uploads/${work.photo}" alt="${work.title}">
            <button onclick="editWork(${work.id})">Redaguoti</button>
            <button onclick="deleteWork(${work.id})">Ištrinti</button>
          </div>
        `;
        worksList.appendChild(workItem);
      });
  
      closeButton.style.display = 'block';
    }
  
    window.editWork = function (id) {
      const work = worksData.find(work => work.id === id);
      if (work) {
        document.getElementById('form-title').innerText = 'Redaguoti darbą';
        document.getElementById('title').value = work.title;
        document.getElementById('description').value = work.description;
        form.dataset.id = id;
        document.getElementById('submit-button').innerText = 'Atnaujinti';
      }
    };
  
    window.deleteWork = function (id) {
      if (confirm('Ar tikrai norite ištrinti šį darbą?')) {
        fetch(`/works/${id}`, {
          method: 'DELETE'
        })
          .then(response => response.json())
          .then(data => {
            alert(data.message);
            fetchWorks(searchInput.value.toLowerCase());
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    };
  });
  