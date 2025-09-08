
const API_BASE_URL = 'http://localhost:3000/api'; 

async function fetchEvents() {

  const url =`${API_BASE_URL}/events`; 

  const resp =await fetch(url);
  
  const data =await resp.json();

  if (!data.success) throw new Error('Failed to fetch events');
  return data.data;
}

function formatDateTime(isoString) {
  const d =new Date(isoString);
  return d.toLocaleString();
}

function createEventCard(event) {
  const card =document.createElement('div');
  card.className ='card';

  const img =document.createElement('img');
  img.src =event.imageUrl ||'assets/img/placeholder.png';
  img.alt =event.name;
  card.appendChild(img);

  const title =document.createElement('h3');
  title.textContent =event.name;
  card.appendChild(title);

  const meta = document.createElement('div');
  meta.className ='meta';
  meta.innerHTML =`<span class="badge"> Event category :  ${event.category || 'General'}</span>  
  <p>Date and time : ${formatDateTime(event.eventDateTime)} </p> <p>Location : ${event.location || ''} </p>`;
  card.appendChild(meta);

  const desc = document.createElement('p');
  desc.textContent =`Discription : ${event.shortDescription || ''}`;
  card.appendChild(desc);

  const btn = document.createElement('a');
  btn.href =`event.html?id=${event.id}`;
  btn.className ='btn';
  btn.textContent ='View event';
  btn.style.display ='inline-block';
  btn.style.marginTop ='10px';
  card.appendChild(btn);

  return card;
}

async function initHome() {
  try {
    const upcomingGrid = document.getElementById('upcomingGrid');
    const pastGrid = document.getElementById('pastGrid');
    const pastSection = document.getElementById('pastSection');

    upcomingGrid.innerHTML = 'Loading...';
    pastGrid.innerHTML = 'Loading...';

    const events = await fetchEvents();

    upcomingGrid.innerHTML = '';
    pastGrid.innerHTML = '';

    if (events.length === 0) {
      upcomingGrid.textContent = 'No events available.';
      pastSection.style.display = 'none'; 
      return;
    }

    const now = new Date();
    let hasPast = false;

    events.forEach(ev => {
      const card = createEventCard(ev);
      const evDate = new Date(ev.eventDateTime);

      if (evDate >= now) {

        upcomingGrid.appendChild(card);

      } else {
        const pastLabel = document.createElement('span');
        pastLabel.textContent = 'Past Event';
        pastLabel.className = 'badge past';
        card.insertBefore(pastLabel, card.firstChild);

        pastGrid.appendChild(card);
        hasPast = true;
      }
    });

    if (!hasPast) {
      pastSection.style.display = 'none';
    }

  } catch (err) {
    console.error(err);
    document.getElementById('upcomingGrid').textContent = 'Error loading events.';
    document.getElementById('pastGrid').textContent = 'Error loading events.';
  }
}


document.addEventListener('DOMContentLoaded', initHome);
