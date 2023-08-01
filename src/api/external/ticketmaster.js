// Methods for making external API calls to Ticketmaster API

// To Do: allow custom queries on location
async function getTicketmasterEvents() {
  const result = await fetch(`http://${import.meta.env.VITE_EXTERNAL_IP}/ticketmaster`);
  const data = await result.json();
  return data;
}

async function getTicketmasterEventById(id) {
  const result = await fetch(`http://${import.meta.env.VITE_EXTERNAL_IP}/ticketmaster/${id}`);
  const data = await result.json();
  return data;
}


async function getTicketmasterEventByCountry(countryCode) {
  const result = await fetch(`http://${import.meta.env.VITE_EXTERNAL_IP}/ticketmaster/country=${countryCode}`);
  const data = await result.json();
  return data;
}

async function getTicketmasterEventByLocation(city, countryCode) {
  const result = await fetch(`http://${import.meta.env.VITE_EXTERNAL_IP}/ticketmaster/country=${countryCode}&city=${city}`);
  const data = await result.json();
  return data;
}


export {
  getTicketmasterEvents,
  getTicketmasterEventById,
  getTicketmasterEventByCountry,
  getTicketmasterEventByLocation,
}

