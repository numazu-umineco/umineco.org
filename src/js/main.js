// import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'

import axios from 'axios';

window.addEventListener('load', async () => {
  try {
    const response = await axios.get('https://discord.com/api/v9/invites/8taubbJ5qD?with_counts=true&with_expiration=true');
    console.log(response.data);
    const memberCount = response.data.approximate_member_count;
    document.querySelectorAll('.member-count').forEach((element) => {
      element.textContent = `ただいま${memberCount}人が参加中`;
      const loader = element.parentElement.querySelector('.member-count-loader');
      if (loader) loader.classList.add('d-none');
    });
  } catch (err) {
    console.error(err);
  }
});
