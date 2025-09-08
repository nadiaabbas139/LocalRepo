
const API_BASE_URL = 'http://localhost:3000/api';

function getQueryParam(name) {
  const params=new URLSearchParams(window.location.search);
  return params.get(name);
}

async function fetchEventDetails(id) {

  const res =await fetch(`${API_BASE_URL}/events/${id}`);

  const json=await res.json();
  
  if (!json.success) throw new Error(json.message ||'Failed to load event');
  return json.data;
}

function createProgressBar(goal, progress) {
  const wrap=document.createElement('div');
  const label= document.createElement('div');
  label.className = 'meta';
  label.textContent= `Goal: $${goal.toFixed(2)} • Raised: $${progress.toFixed(2)}`;
  wrap.appendChild(label);

  const progressDiv =document.createElement('div');
  progressDiv.className= 'progress';
  const inner=document.createElement('i');
  const percent = goal > 0 ? Math.min(100, (progress / goal) * 100) : 0;
  inner.style.width = `${percent}%`;
  inner.title =  `${percent.toFixed(1)}%`;
  progressDiv.appendChild(inner);
  wrap.appendChild(progressDiv);
  return wrap;
}

document.addEventListener('DOMContentLoaded', async () => {
  const id =getQueryParam('id');
  const container =document.getElementById('eventDetail');
  if (!id) {
    container.innerHTML ='<h2>Error</h2><p>No event ID specified.</p>';
    return;
  }

  try {
    const ev =await fetchEventDetails(id);
    container.innerHTML ='';
    const img =document.createElement('img');
    img.src =ev.imageUrl ||  'assets/img/placeholder.png';
    img.style.width =  '100%';
    img.style.height ='300px';
    img.style.objectFit = 'cover';
    container.appendChild(img);

    const title=document.createElement('h2');
    title.textContent =ev.name;
    container.appendChild(title);

    const meta = document.createElement('div');
    meta.className ='meta';
    meta.innerHTML =`<span class="badge">Category :${ev.category}</span> 
    <p> Date and Time :${new Date(ev.eventDateTime).toLocaleString()}</p> 
    <p> Location: ${ev.location} </p>`;
    container.appendChild(meta);

    const desc = document.createElement('p');
    desc.textContent =`Full Discription: ${ ev.fullDescription || ev.shortDescription ||''}`;
    container.appendChild(desc);

    const ticket = document.createElement('div');
    ticket.className ='meta';
    ticket.textContent =ev.ticketPrice ===0 ? 'Free entry' :`Ticket price: $${ev.ticketPrice.toFixed(2)}`;
    container.appendChild(ticket);

    container.appendChild(createProgressBar(ev.goalAmount,ev.progressAmount));

    const registerBtn= document.createElement('button');
    registerBtn.className ='btn';
    registerBtn.textContent ='Register';
    registerBtn.style.marginTop ='12px';
    registerBtn.addEventListener('click', () => {
      alert('This feature is currently under construction.');
    });
    
    container.appendChild(registerBtn);

    const charityDiv =document.createElement('div');
    charityDiv.className ='meta';
    charityDiv.style.marginTop ='10px';
    charityDiv.innerHTML =  `<strong>Organiser:</strong> ${ev.charity || ''}`;
    container.appendChild(charityDiv);

  } catch (err) {
    console.error(err);
    container.innerHTML ='<h2>Error</h2><p>Event not found or suspended.</p>';
  }
});
