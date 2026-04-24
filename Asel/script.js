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

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            emailBtn.href = `mailto:${userEmail}`;
            emailBtn.removeAttribute("target");
        } else {
            emailBtn.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${userEmail}`;
            emailBtn.target = "_blank";
        }
        
        // === НАСТРАИВАЕМ САЙТ ===
        if (person.website) {
            document.getElementById("btnWebsite").href = person.website;
        }

        // === НАСТРАИВАЕМ ИНСТАГРАМ (НОВОЕ) ===
        const instaBtn = document.getElementById("btnInstagram");
        if (instaBtn && person.instagram) {
            instaBtn.href = person.instagram;
        }

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
