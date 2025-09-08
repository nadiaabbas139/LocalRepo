
const API_BASE_URL = 'http://localhost:3000/api';

async function fetchCategories() {

  const res =await fetch(`${API_BASE_URL}/categories`);

  const json=await res.json();

  if (!json.success) throw new Error('failed to load categories');
  return json.data;
}

async function searchEvents(filters) {

  const params = new URLSearchParams();
  
  if (filters.date) params.append('date', filters.date);
  if (filters.location) params.append('location',filters.location);
  if (filters.category) params.append('category', filters.category);

  const url =`${API_BASE_URL}/events/search?${params.toString()}`;

  const res =await fetch(url);
  const json = await res.json();
  if (!json.success) throw new Error('search failed');
  return json.data;
}

function clearResults() {
  const results = document.getElementById('results');
  results.innerHTML ='';
}

function createResultCard(ev) {

  const card = document.createElement('div');
  card.className ='card';
  card.innerHTML =  `
    <img src="${ev.imageUrl||'assets/img/placeholder.png'}" alt="${ev.name}" />
    <h3>${ev.name}</h3>
    <div class="meta"><span class="badge">Category: ${ev.category} </span> 
    <p> Date and Time : ${new Date(ev.eventDateTime).toLocaleString()} </p> 
    <p>Location :  ${ev.location}</p>
    <p> Discription: ${ev.shortDescription || ''}</p>
    </div>
   
    <a class="btn" href="event.html?id=${ev.id}"> View event </a>
  `;
  return card; 
}

document.addEventListener('DOMContentLoaded', async () => {
  const catSelect =document.getElementById('categorySelect');
  const searchForm =document.getElementById('searchForm');
  const clearBtn=document.getElementById('clearBtn');
  const errors =document.getElementById('searchErrors');

  try {
    const cats = await fetchCategories();
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value =c.id;
      opt.textContent =c.name;
      catSelect.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
    errors.textContent = 'failed to load categories';
  }

  searchForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    errors.textContent ='';
    clearResults();
    const filters ={
      date: document.getElementById('dateInput').value,
      location: document.getElementById('locationInput').value.trim(),
      category: document.getElementById('categorySelect').value
    };

    if (!filters.date && !filters.location && !filters.category) {
      errors.textContent = 'please provide at least one filter criterion';
      return;
    }

    try {
      const results = await searchEvents(filters);
      const resultsDiv = document.getElementById('results');
      if (results.length ===0) {
        resultsDiv.textContent = 'No events match your criteria';
        return;
      }
      resultsDiv.innerHTML ='';

      results.forEach(r => resultsDiv.appendChild(createResultCard(r)));

    } catch (err) {
      console.error(err);
      errors.textContent ='search failed, try again.';
    }
  });

  clearBtn.addEventListener('click', () => {
    document.getElementById('dateInput').value ='';
    document.getElementById('locationInput').value ='';
    document.getElementById('categorySelect').value ='';
    document.getElementById('searchErrors').textContent ='';
    clearResults();
  });
});
