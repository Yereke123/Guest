// Переменная для хранения данных текущего человека
let currentPerson = null;

async function loadContact() {
  try {
    const response = await fetch("contacts.json");
    if (!response.ok) throw new Error("Не удалось загрузить контакты");

    const contacts = await response.json();

    // БЕРЕМ ПЕРВОГО ЧЕЛОВЕКА ИЗ JSON (Игнорируем поиск по ID)
    const firstKey = Object.keys(contacts)[0]; 
    currentPerson = contacts[firstKey];

    if (!currentPerson) {
      document.getElementById("fullName").innerText = "Контакт не найден";
      return;
    }

    // 1. Заполняем Имя, Должность и Фото
    document.getElementById("fullName").innerText = `${currentPerson.firstName} ${currentPerson.lastName}`;
    document.getElementById("jobTitle").innerText = currentPerson.jobTitle;
    document.getElementById("userPhoto").src = currentPerson.photo;

    // 2. Настраиваем кнопку WhatsApp
    const cleanPhone = currentPerson.phone.replace(/\D/g, '');
    document.getElementById("btnWhatsapp").href = `https://wa.me/${cleanPhone}`;

    // 3. Настраиваем умную кнопку Email (Телефон / ПК)
    const emailBtn = document.getElementById("btnEmail");
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      emailBtn.href = `mailto:${currentPerson.email}`;
      emailBtn.removeAttribute("target");
    } else {
      emailBtn.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${currentPerson.email}`;
      emailBtn.target = "_blank";
    }

  } catch (error) {
    console.error("Ошибка:", error);
    document.getElementById("fullName").innerText = "Ошибка загрузки";
  }
}

// 4. Функция для кнопки "Добавить в контакты" (Скачивание файла .vcf)
function saveVCard(event) {
  event.preventDefault(); // Чтобы страница не прыгала вверх при клике

  if (!currentPerson) {
    alert("Данные еще не загрузились!");
    return;
  }

  const { firstName, lastName, phone, jobTitle, email } = currentPerson;
  const fullName = `${firstName} ${lastName}`.trim();

  // Формируем файл контакта
  const vcard = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${fullName}
TITLE:${jobTitle}
TEL;TYPE=CELL:${phone}
EMAIL:${email}
END:VCARD`;

  // Создаем файл и автоматически скачиваем его
  const blob = new Blob([vcard], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${fullName}.vcf`;
  a.click();

  URL.revokeObjectURL(url);
}

// Привязываем функцию сохранения к кнопке
document.getElementById("btnSaveContact").addEventListener("click", saveVCard);

// Запускаем загрузку данных сразу при открытии сайта
loadContact();