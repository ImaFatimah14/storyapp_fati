import HomePresenter from './home-presenter';

const HomePage = {
  async render() {
    return `
      <section class="content">
        <h2>Daftar Cerita</h2>
        <div id="storyList"></div>

        <h3>Lokasi Cerita</h3>
        <div id="storyMap" style="height: 400px; border-radius: 12px; margin-top: 1rem;"></div>
      </section>
    `;
  },

  async afterRender() {
    const token = localStorage.getItem('token');
    await HomePresenter.init({
      token,
      container: document.getElementById('storyList'),
      mapContainer: document.getElementById('storyMap'),
    });

    // ❌ Jangan tambahkan menu Peta lagi
    // (Baris di bawah ini DIBUANG)
    // const nav = document.querySelector('.main-header .nav-list');
    // if (nav && token && !nav.querySelector('a[href="#/map"]')) {
    //   nav.insertAdjacentHTML('beforeend', `
    //     <li><a href="#/map"><i class="fas fa-map-marked-alt"></i> Peta</a></li>
    //   `);
    // }
  },
};

export default HomePage;
