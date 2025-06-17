const Navbar = () => {
  return `
    <nav class="navbar">
      <div class="logo">
        <i class="fas fa-book-open"></i> StoryApp
      </div>

      <input type="checkbox" id="menu-toggle" class="menu-toggle" />
      <label 
        for="menu-toggle" 
        class="menu-icon" 
        aria-label="Toggle navigation menu" 
        title="Buka/Tutup menu navigasi" 
        role="button"
      >
        <i class="fas fa-bars"></i>
      </label>

      <ul class="nav-links">
        <li><a href="#/home"><i class="fas fa-home"></i> Beranda</a></li>
        <li><a href="#/add"><i class="fas fa-plus"></i> Tambah Cerita</a></li>
        <li><a href="#/offline"><i class="fas fa-bookmark"></i> Tersimpan</a></li>
        <li><a href="#/about"><i class="fas fa-info-circle"></i> Tentang</a></li>
        <li><a href="#/login"><i class="fas fa-sign-in-alt"></i> Login</a></li>
        <li><a href="#/register"><i class="fas fa-user-plus"></i> Register</a></li>
        <li id="logout-li" style="display:none;">
          <a href="#" id="logout-link">
            <i class="fas fa-sign-out-alt"></i> Logout
          </a>
        </li>
      </ul>
    </nav>
  `;
};

document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = !!localStorage.getItem('token');
  const logoutLi = document.getElementById('logout-li');
  const logoutLink = document.getElementById('logout-link');

  if (logoutLi) {
    logoutLi.style.display = isLoggedIn ? 'list-item' : 'none';
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      window.location.href = '#/login';
    });
  }
});

export default Navbar;
