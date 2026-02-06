// Імітація клонів (в реальності — збереження в Firebase)
let clones = JSON.parse(localStorage.getItem('clones')) || [];

// Запис голосу
const recordBtn = document.getElementById('recordBtn');
const audioPreview = document.getElementById('audioPreview');
let mediaRecorder;
let audioChunks = [];

recordBtn.addEventListener('click', async () => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioPreview.src = URL.createObjectURL(audioBlob);
            audioPreview.classList.remove('hidden');
            audioChunks = [];
        };
        mediaRecorder.start();
        recordBtn.textContent = 'Стоп запис';
    } else {
        mediaRecorder.stop();
        recordBtn.textContent = 'Почати запис';
    }
});

// Створити клон (імітація)
document.getElementById('createClone').addEventListener('click', () => {
    const photos = document.getElementById('photos').files;
    if (photos.length < 1) return alert('Завантаж хоча б одне фото!');

    const clone = {
        id: Date.now(),
        name: `Клон ${clones.length + 1}`,
        created: new Date().toLocaleString()
    };
    clones.push(clone);
    localStorage.setItem('clones', JSON.stringify(clones));
    updateCloneSelect();
    alert('Клон створено! (імітація)');
});

// Оновлення списку клонів
function updateCloneSelect() {
    const select = document.getElementById('cloneSelect');
    select.innerHTML = '<option>Обери клона</option>';
    clones.forEach(clone => {
        const option = document.createElement('option');
        option.value = clone.id;
        option.textContent = clone.name;
        select.appendChild(option);
    });
}

// Генерація повідомлення (імітація)
document.getElementById('generateBtn').addEventListener('click', () => {
    const text = document.getElementById('textInput').value.trim();
    const cloneId = document.getElementById('cloneSelect').value;

    if (!text || !cloneId) return alert('Введи текст і обери клона!');

    // Імітація генерації
    alert(`Генерація відео/голосу для "${text}" від клона ${cloneId}... (імітація)`);

    // Показуємо результат (заглушка)
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('generatedVideo').src = 'https://via.placeholder.com/640x360?text=Deepfake+Video';
    document.getElementById('generatedAudio').src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
});
