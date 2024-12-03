const divs = document.querySelectorAll(".target");
// Получаем все элементы с классом "target" на странице и сохраняем их в переменную divs в виде списка.

if (divs.length) {
    // Проверяем, есть ли хотя бы один элемент с классом "target" на странице.

    divs.forEach(div => {

        let isMoving = false;
        let isFixed = false;
        let offsetX, offsetY;
        let lastPosX = div.offsetLeft;
        let lastPosY = div.offsetTop;
        // Инициализируем переменные. 
        // isMoving - отвечает за текущее перемещение элемента.
        // isFixed - фиксирует элемент в определенной позиции после двойного клика.
        // offsetX и offsetY - смещение курсора от границы div при захвате.
        // lastPosX и lastPosY - запоминают последние позиции элемента.

        div.addEventListener('mousedown', (e) => {
            isMoving = true;
            offsetX = e.clientX - div.offsetLeft;
            offsetY = e.clientY - div.offsetTop;
            // При нажатии кнопки мыши элемент можно двигать, рассчитываем смещение курсора от позиции элемента.
            div.style.zIndex = 10;
            // Устанавливаем элементу высокий z-index, чтобы он оказался выше других элементов.
        });

        div.addEventListener('dblclick', (e) => {
            isFixed = true;
            offsetX = e.clientX - div.offsetLeft;
            offsetY = e.clientY - div.offsetTop;
            // Двойной клик фиксирует элемент, запоминаем его позицию.
            div.style.backgroundColor = 'blue';
            div.style.zIndex = 10;
            // Меняем цвет элемента на синий, повышаем z-index.
        });

        div.addEventListener('mousemove', (e) => {
            if (isMoving || isFixed) {
                div.style.left = `${e.clientX - offsetX}px`;
                div.style.top = `${e.clientY - offsetY}px`;
                // При движении мыши изменяем позицию элемента, если он перемещается или зафиксирован.
            }
        });

        div.addEventListener('mouseup', (e) => {
            isMoving = false;
            div.style.zIndex = '';
            // Остановка перемещения после отпускания кнопки мыши, сбрасываем z-index.
            lastPosX = div.offsetLeft;
            lastPosY = div.offsetTop;
            // Обновляем последнюю позицию элемента.
        });

        div.addEventListener('click', (e) => {
            div.style.backgroundColor = 'red';
            div.style.zIndex = '';
            isFixed = false;
            // Одиночный клик возвращает цвет элемента на красный и снимает фиксацию.
            lastPosX = div.offsetLeft;
            lastPosY = div.offsetTop;
        });

        document.addEventListener("keydown", (e) => {
            if (e.code == "Escape") {
                if (isFixed || isMoving) {
                    isFixed = false;
                    isMoving = false;
                    // При нажатии клавиши Escape отменяем перемещение и фиксацию элемента.
                    div.style.backgroundColor = 'red';
                    div.style.zIndex = '';
                    div.style.left = lastPosX + 'px';
                    div.style.top = lastPosY + 'px';
                    // Возвращаем элемент в последнюю зафиксированную позицию.
                }
            }
        });

        // Лабораторная работа 6. Дополнительная логика для работы с сенсорными устройствами.
        let lastTouchTime = 0;
        let isFollowing = false;
        let followMode = false;
        // Переменные для работы с сенсорными событиями: 
        // lastTouchTime — для измерения времени между касаниями;
        // isFollowing — отслеживает следование элемента за пальцем;
        // followMode — режим автоматического следования.

        function handleDoubleTap() {
            const now = new Date().getTime();
            const timeSinceLastTouch = now - lastTouchTime;
            // Рассчитываем время, прошедшее между последними касаниями.

            if (timeSinceLastTouch > 0 && timeSinceLastTouch < 300) {
                isFollowing = true;
                setTimeout(()=> { followMode = true;}, 800);
                // Если время между касаниями меньше 300 мс, активируем режим следования через 800 мс.
            }
            lastTouchTime = now;
            // Обновляем время последнего касания.
        }

        div.addEventListener("touchstart", (e) => {
            handleDoubleTap();
            isMoving = true;
            let touch = e.touches[0];
            offsetX = touch.clientX - div.offsetLeft;
            offsetY = touch.clientY - div.offsetTop;
            // Начало перемещения элемента при касании, расчет смещения курсора от элемента.
            div.style.zIndex = 10;
        });

        div.addEventListener("touchmove", (e) => {
            if (isMoving) {
                let touch = e.touches[0];
                div.style.left = `${touch.clientX - offsetX}px`;
                div.style.top = `${touch.clientY - offsetY}px`;
                // Обновляем позицию элемента при движении пальцем.
            }
        });

        div.addEventListener("touchend", (e) => {
            isMoving = false;
            div.style.zIndex = '';
            // Останавливаем перемещение после завершения касания.
            lastPosX = div.offsetLeft;
            lastPosY = div.offsetTop;
        });

        document.addEventListener("touchstart", (e) => {
            if (e.touches.length > 1) {
                isFollowing = false;
                isMoving = false;
                div.style.zIndex = '';
                div.style.left = lastPosX + 'px';
                div.style.top = lastPosY + 'px';
                // Если на экране более одного пальца, отменяем следование и возвращаем элемент на последнее место.
                return;
            }

            if (isFollowing) {
                let touch = e.touches[0];
                div.style.left = `${touch.clientX - offsetX}px`;
                div.style.top = `${touch.clientY - offsetY}px`;
                div.style.zIndex = 10;
                // Если активирован режим следования, элемент продолжает следовать за пальцем.
            }
        });

        document.addEventListener("touchmove", (e) => {
            if (isFollowing) {
                let touch = e.touches[0];
                div.style.left = `${touch.clientX - offsetX}px`;
                div.style.top = `${touch.clientY - offsetY}px`;
                // Продолжаем обновлять позицию элемента при перемещении пальцем, если активен режим следования.
            }
        });

        document.addEventListener("touchend", (e) => {
            if (isFollowing) {
                let distance = div.offsetLeft - lastPosX + div.offsetTop - lastPosY;
                if (distance === 0 && followMode) {
                    isFollowing = false;
                    followMode = false;
                    // Останавливаем следование, если элемент не изменил позицию и режим следования активен.
                }
                div.style.zIndex = '';
            }
        });
    });
}
