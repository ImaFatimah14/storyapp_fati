import AddPresenter from './add-presenter';
import { BASE_URL, VAPID_PUBLIC_KEY } from '../../config.js';

const AddPage = {
  async render() {
    return `
      <section class="add-page container">
        <h2 class="title">Tambah Cerita Baru</h2>
        <form id="addForm" class="add-form">
          <label for="description">Deskripsi Cerita (Wajib):</label>
          <textarea id="description" placeholder="Tulis deskripsi ceritamu di sini..." required></textarea>

          <label>Foto Cerita (Wajib, maks 1MB):</label>
          <div class="camera-buttons">
            <button type="button" id="closeCameraBtn" class="btn danger">❌ Tutup Kamera</button>
            <button type="button" id="startCameraBtn" class="btn warning">📷 Ambil Foto</button>
            <label for="imageInput" class="btn upload">📤 Unggah File</label>
            <input type="file" id="imageInput" name="photo" accept="image/*" hidden />
          </div>

          <video id="cameraPreview" autoplay playsinline style="display: none; width: 100%; border-radius: 10px; margin-top: 10px;"></video>
          <canvas id="canvasPreview" style="display: none;"></canvas>
          <img id="photoPreview" alt="Preview" style="display: none; width: 100%; border-radius: 10px; margin-top: 10px;" />

          <label>Lokasi Cerita (Opsional):</label>
          <div id="map" style="height: 300px; margin-top: 10px; border-radius: 8px;"></div>

          <input type="hidden" id="lat" />
          <input type="hidden" id="lon" />

          <button type="submit" class="btn submit-btn">📤 Unggah Cerita</button>
        </form>
        <p id="statusMessage" class="status-message"></p>
      </section>
    `;
  },

  async afterRender() {
    AddPresenter.init({
      form: document.getElementById('addForm'),
      mapId: 'map',
      latInput: document.getElementById('lat'),
      lonInput: document.getElementById('lon'),
      fileInput: document.getElementById('imageInput'),
      descriptionInput: document.getElementById('description'),
      statusElement: document.getElementById('statusMessage'),
    });

    const video = document.getElementById('cameraPreview');
    const canvas = document.getElementById('canvasPreview');
    const photoPreview = document.getElementById('photoPreview');
    const startCameraBtn = document.getElementById('startCameraBtn');
    const closeCameraBtn = document.getElementById('closeCameraBtn');

    let stream = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block';
        photoPreview.style.display = 'none';
      } catch (err) {
        console.error('Tidak bisa mengakses kamera:', err);
      }
    }

    function stopCamera() {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
        video.style.display = 'none';
      }
    }

    function takePhoto() {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageDataUrl = canvas.toDataURL('image/jpeg');
      photoPreview.src = imageDataUrl;
      photoPreview.style.display = 'block';

      stopCamera();
    }

    startCameraBtn.addEventListener('click', () => {
      if (!video.srcObject) {
        startCamera().then(() => {
          startCameraBtn.textContent = '📸 Ambil';
        });
      } else {
        takePhoto();
        startCameraBtn.textContent = '📷 Ambil Foto';
      }
    });

    closeCameraBtn.addEventListener('click', () => {
      stopCamera();
      startCameraBtn.textContent = '📷 Ambil Foto';
    });

    const form = document.getElementById('addForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const description = formData.get('description');
      const file = formData.get('photo');
      if (!description || !file || (file && file.size === 0)) {
        alert('Deskripsi dan foto wajib diisi!');
        return;
      }
      if (file && file.size > 1024 * 1024) {
        alert('Ukuran foto maksimal 1MB!');
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Anda harus login untuk menambah cerita!');
        return;
      }
      // Kirim data ke server
      const response = await fetch(`${BASE_URL}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Sukses:', result);

        // Tampilkan notifikasi browser setelah cerita berhasil ditambahkan
        if (Notification.permission === 'granted') {
          new Notification('Notifikasi Laporan!', {
            body: 'Cerita berhasil ditambahkan!',
            icon: '/icons/icon-192x192.png',
          });
        }

        // Reset form dan tampilan
        form.reset();
        photoPreview.style.display = 'none';
        canvas.style.display = 'none';
        video.style.display = 'none';
        startCameraBtn.textContent = '📷 Ambil Foto';

        // Panggil ulang inisialisasi presenter jika diperlukan
        AddPresenter.init({
          form: document.getElementById('addForm'),
          mapId: 'map',
          latInput: document.getElementById('lat'),
          lonInput: document.getElementById('lon'),
          fileInput: document.getElementById('imageInput'),
          descriptionInput: document.getElementById('description'),
          statusElement: document.getElementById('statusMessage'),
        });
      } else {
        let errorMessage = 'Gagal menambah cerita.';
        try {
          const errorJson = await response.json();
          if (errorJson && errorJson.message) errorMessage = errorJson.message;
        } catch (e) {
          errorMessage = await response.text();
        }
        document.getElementById('statusMessage').textContent = `Error: ${errorMessage}`;
        alert(`Gagal menambah cerita: ${errorMessage}`);
      }
    });
  },
};

export default AddPage;
