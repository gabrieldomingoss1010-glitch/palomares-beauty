const API_BASE = 'http://localhost:3000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('pb_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const api = {
  async getFiles() {
    const res = await fetch(`${API_BASE}/files`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Falha ao buscar arquivos');
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Falha ao buscar estatísticas');
    return res.json();
  },

  async uploadFile(file, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err.error || 'Erro no upload'));
          } catch {
            reject(new Error('Erro no upload'));
          }
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Erro de conexão')));
      xhr.addEventListener('abort', () => reject(new Error('Upload cancelado')));

      xhr.open('POST', `${API_BASE}/upload`);
      // Add auth header
      const token = localStorage.getItem('pb_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  },

  async deleteFile(id) {
    const res = await fetch(`${API_BASE}/files/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Falha ao deletar arquivo');
    return res.json();
  },

  getFileUrl(filePath) {
    return `http://localhost:3000/${filePath}`;
  }
};
