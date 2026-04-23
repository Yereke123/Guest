// Функция для получения ID из ссылки (например, index.html?id=Gani)
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function loadContact() {
    // Если ID в ссылке не указан, по умолчанию загружаем "Gani"
    const id = getQueryParam("id") || "Gani";

    try {
        const response = await fetch("vizitka_data.json");
        
        if (!response.ok) {
            throw new Error("Файл данных не найден");
        }

        const contacts = await response.json();
        const person = contacts[id];

        if (!person) {
            document.getElementById("fullName").innerText = "Контакт не найден";
            return;
        }

        // 1. Заполняем текстовые данные
        document.getElementById("fullName").innerText = `${person.firstName} ${person.lastName}`;
        document.getElementById("jobTitle").innerText = person.jobTitle;
        
        // 2. Загружаем фото
        document.getElementById("userPhoto").src = person.photo;

        // 3. Настраиваем кнопку WhatsApp
        const cleanPhone = person.phone.replace(/\D/g, ''); 
        document.getElementById("btnWhatsapp").href = `https://wa.me/${cleanPhone}`;

       // === УМНАЯ НАСТРОЙКА КНОПКИ ПОЧТЫ ===
    const emailBtn = document.getElementById("btnEmail");
    const userEmail = person.email;

    // Проверяем устройство (телефон или планшет)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        // ЕСЛИ ТЕЛЕФОН: открываем встроенное приложение (Gmail, Apple Mail и т.д.)
        emailBtn.href = `mailto:${userEmail}`;
        emailBtn.removeAttribute("target"); // Открываем в том же окне
    } else {
        // ЕСЛИ КОМПЬЮТЕР: открываем Gmail прямо в браузере
        emailBtn.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${userEmail}`;
        emailBtn.target = "_blank"; // Открываем в новой вкладке, чтобы не закрыть визитку
        
        // ВАЖНО: Если большинство ваших клиентов пользуются Mail.ru, 
        // закомментируйте строку с Gmail (поставьте // в начале) 
        // и раскомментируйте строку ниже:
        // emailBtn.href = `https://e.mail.ru/compose/?to=${userEmail}`;
    }
    
      document.getElementById("btnWebsite").href = person.website;

    } catch (error) {
        console.error("Ошибка:", error);
        if (window.location.protocol === 'file:') {
            document.getElementById("fullName").innerText = "Ошибка CORS";
            document.getElementById("jobTitle").innerText = "Запустите через Live Server";
        }
    }
}

// Запускаем загрузку
loadContact();