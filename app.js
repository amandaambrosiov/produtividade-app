const taskList =
    document.getElementById("taskList");

const taskForm =
    document.getElementById("taskForm");

const modalOverlay =
    document.getElementById("modalOverlay");

const openModal =
    document.getElementById("openModal");

const closeModal =
    document.getElementById("closeModal");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const progressTitle =
    document.getElementById("progressTitle");

const pendingCount =
    document.getElementById("pendingCount");

const completedCount =
    document.getElementById("completedCount");

const searchInput =
    document.getElementById("searchInput");

const todayText =
    document.getElementById("todayText");

const taskCategorySelect =
    document.getElementById("taskCategorySelect");

const newCategoryBtn =
    document.getElementById("newCategoryBtn");

const newCategoryBox =
    document.getElementById("newCategoryBox");

const newCategoryName =
    document.getElementById("newCategoryName");

const repeatDays =
    document.getElementById("repeatDays");

const calendarModal =
    document.getElementById("calendarModal");

const openCalendar =
    document.getElementById("openCalendar");

const closeCalendar =
    document.getElementById("closeCalendar");

const calendarGrid =
    document.getElementById("calendarGrid");

const monthYear =
    document.getElementById("monthYear");

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");

const congratsModal =
    document.getElementById("congratsModal");

const congratsText =
    document.getElementById("congratsText");

const closeCongrats =
    document.getElementById("closeCongrats");

let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];

let categories =
    JSON.parse(
        localStorage.getItem("categories")
    ) || {};

let selectedDate =
    new Date();

let currentView = "day";

let editingTaskId = null;

/* ======================
   FORMAT DATE
====================== */

function formatDateLocal(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}

/* ======================
   TODAY
====================== */

todayText.innerHTML =
    selectedDate.toLocaleDateString(
        "pt-BR",
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    );

/* ======================
   SAVE
====================== */

function save() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "categories",
        JSON.stringify(categories)
    );

}

/* ======================
   OPEN MODAL
====================== */

openModal.onclick = () => {

    editingTaskId = null;

    taskForm.reset();

    modalOverlay.classList.add(
        "active"
    );

};

closeModal.onclick = () => {

    modalOverlay.classList.remove(
        "active"
    );

};

/* ======================
   CATEGORY MODAL
====================== */

newCategoryBtn.onclick = () => {

    newCategoryBox.classList.toggle(
        "active"
    );

};

/* ======================
   RENDER CATEGORIES
====================== */

function renderCategories() {

    taskCategorySelect.innerHTML =
        `
    <option value="">
      Selecionar categoria
    </option>
  `;

    Object.keys(categories)
        .forEach(category => {

            taskCategorySelect.innerHTML += `
      <option value="${category}">
        ${category}
      </option>
    `;

        });

}

/* ======================
   CALENDAR
====================== */

openCalendar.onclick = () => {

    calendarModal.classList.add(
        "active"
    );

    renderCalendar();

};

closeCalendar.onclick = () => {

    calendarModal.classList.remove(
        "active"
    );

};

prevMonth.onclick = () => {

    selectedDate.setMonth(
        selectedDate.getMonth() - 1
    );

    renderCalendar();

};

nextMonth.onclick = () => {

    selectedDate.setMonth(
        selectedDate.getMonth() + 1
    );

    renderCalendar();

};

function renderCalendar() {

    calendarGrid.innerHTML = "";

    const year =
        selectedDate.getFullYear();

    const month =
        selectedDate.getMonth();

    monthYear.innerHTML =
        selectedDate.toLocaleDateString(
            "pt-BR",
            {
                month: "long",
                year: "numeric"
            }
        );

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();

    const totalDays =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        calendarGrid.appendChild(
            empty
        );

    }

    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const div =
            document.createElement("div");

        div.className = "day";

        div.innerHTML = day;

        const currentDate =
            new Date(
                year,
                month,
                day
            );

        const currentFormatted =
            formatDateLocal(
                currentDate
            );

        const hasTask =
            tasks.some(
                t => t.date === currentFormatted
            );

        if (hasTask) {

            div.classList.add(
                "has-task"
            );

        }

        if (
            currentFormatted ===
            formatDateLocal(selectedDate)
        ) {

            div.classList.add(
                "active"
            );

        }

        div.onclick = () => {

            selectedDate =
                currentDate;

            renderTasks();

            updateDashboard();

            renderCalendar();

            calendarModal.classList.remove(
                "active"
            );

        };

        calendarGrid.appendChild(div);

    }

}

/* ======================
   VIEW BUTTONS
====================== */

document.querySelectorAll(
    ".view-btn"
).forEach(btn => {

    btn.onclick = () => {

        document
            .querySelectorAll(".view-btn")
            .forEach(
                b => b.classList.remove(
                    "active"
                )
            );

        btn.classList.add("active");

        currentView =
            btn.dataset.view;

        renderTasks();

        updateDashboard();

    };

});

/* ======================
   REPEAT
====================== */

document.getElementById(
    "toggleRepeat"
).onclick = () => {

    repeatDays.classList.toggle(
        "active"
    );

};

/* ======================
   CREATE / EDIT TASK
====================== */

taskForm.addEventListener(
    "submit",
    e => {

        e.preventDefault();

        const title =
            document.getElementById(
                "taskTitle"
            ).value;

        const description =
            document.getElementById(
                "taskDescription"
            ).value;

        const priority =
            document.getElementById(
                "taskPriority"
            ).value;

        const date =
            document.getElementById(
                "taskDate"
            ).value;

        let category =
            taskCategorySelect.value;

        if (
            newCategoryName.value
                .trim() !== ""
        ) {

            category =
                newCategoryName.value;

            const selectedColor =
                document.querySelector(
                    "input[name='color']:checked"
                ).value;

            categories[category] =
                selectedColor;

        }

        const color =
            categories[category];

        if (editingTaskId) {

            tasks = tasks.map(task =>

                task.id === editingTaskId
                    ? {
                        ...task,
                        title,
                        description,
                        priority,
                        category,
                        color,
                        date
                    }
                    : task

            );

        } else {

            const repeatSelected = [
                ...document.querySelectorAll(
                    "#repeatDays input:checked"
                )
            ].map(input => Number(input.value));

            // SEM REPETIÇÃO
            if (repeatSelected.length === 0) {

                tasks.push({
                    id: Date.now(),
                    title,
                    description,
                    priority,
                    category,
                    color,
                    date,
                    completed: false
                });

            } else {

                // DATA INICIAL
                const startDate =
                    new Date(date + "T00:00:00");

                // QUANTAS SEMANAS GERAR
                // (aqui gera 12 semanas)
                const weeksToGenerate = 12;

                for (let week = 0; week < weeksToGenerate; week++) {

                    repeatSelected.forEach(dayOfWeek => {

                        const repeatedDate =
                            new Date(startDate);

                        // início da semana
                        repeatedDate.setDate(
                            startDate.getDate()
                            -
                            startDate.getDay()
                            +
                            dayOfWeek
                            +
                            (week * 7)
                        );

                        // evita criar tarefa antes da data inicial
                        if (repeatedDate < startDate) {
                            return;
                        }

                        tasks.push({

                            id:
                                Date.now()
                                + Math.random(),

                            title,

                            description,

                            priority,

                            category,

                            color,

                            date: formatDateLocal(
                                repeatedDate
                            ),

                            completed: false

                        });

                    });

                }

            }

        }
        save();

        renderTasks();

        renderCalendar();

        updateDashboard();

        renderCategories();

        taskForm.reset();

        modalOverlay.classList.remove(
            "active"
        );

        newCategoryBox.classList.remove(
            "active"
        );

        editingTaskId = null;

    }
);

/* ======================
   FILTER TASKS
====================== */

function getFilteredTasks() {

    const search =
        searchInput.value.toLowerCase();

    return tasks.filter(task => {

        const taskDate =
            new Date(
                task.date + "T00:00:00"
            );

        const sameDay =
            formatDateLocal(taskDate)
            ===
            formatDateLocal(selectedDate);

        const startWeek =
            new Date(selectedDate);

        startWeek.setDate(
            selectedDate.getDate()
            -
            selectedDate.getDay()
        );

        startWeek.setHours(0, 0, 0, 0);

        const endWeek =
            new Date(startWeek);

        endWeek.setDate(
            startWeek.getDate() + 6
        );

        endWeek.setHours(
            23, 59, 59, 999
        );

        const sameWeek =
            taskDate >= startWeek
            &&
            taskDate <= endWeek;

        const sameMonth =
            taskDate.getMonth()
            ===
            selectedDate.getMonth()
            &&
            taskDate.getFullYear()
            ===
            selectedDate.getFullYear();

        let valid = false;

        if (currentView === "day") {
            valid = sameDay;
        }

        if (currentView === "week") {
            valid = sameWeek;
        }

        if (currentView === "month") {
            valid = sameMonth;
        }

        return (
            valid
            &&
            (
                task.title
                    .toLowerCase()
                    .includes(search)
                ||
                task.category
                    .toLowerCase()
                    .includes(search)
            )
        );

    });

}

/* ======================
   RENDER TASKS
====================== */

function renderTasks() {

    taskList.innerHTML = "";

    const filtered =
        getFilteredTasks();

    if (!filtered.length) {

        taskList.innerHTML =
            `
      <p
        style="
          text-align:center;
          color:#777;
          margin-top:30px;
        "
      >
        Nenhuma atividade encontrada
      </p>
    `;

        return;

    }

    if (currentView === "day") {

        createSection(
            "Atividades do dia",
            filtered
        );

    }

    if (currentView === "week") {

        const weekDays = [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado"
        ];

        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const day =
                new Date(selectedDate);

            day.setDate(
                selectedDate.getDate()
                -
                selectedDate.getDay()
                + i
            );

            const dayTasks =
                filtered.filter(
                    t =>
                        t.date ===
                        formatDateLocal(day)
                );

            createSection(
                weekDays[i],
                dayTasks
            );

        }

    }

    if (currentView === "month") {

        const grouped = {};

        filtered.forEach(task => {

            if (!grouped[task.date]) {

                grouped[task.date] = [];

            }

            grouped[task.date].push(task);

        });

        Object.keys(grouped)
            .sort()
            .forEach(date => {

                createSection(
                    new Date(
                        date + "T00:00:00"
                    ).toLocaleDateString(
                        "pt-BR",
                        {
                            day: "numeric",
                            month: "long"
                        }
                    ),
                    grouped[date]
                );

            });

    }

}

/* ======================
   CREATE SECTION
====================== */

function createSection(
    title,
    data
) {

    if (!data.length) {
        return;
    }

    const sectionTitle =
        document.createElement("h2");

    sectionTitle.className =
        "section-title";

    sectionTitle.innerHTML =
        title;

    taskList.appendChild(
        sectionTitle
    );

    data.forEach(task => {

        const card =
            document.createElement("div");

        card.className =
            `
      task-card
      ${task.completed
                ? "completed"
                : ""
            }
    `;

        card.innerHTML = `
      <div class="task-top">

        <h3 class="task-title">
          ${task.title}
        </h3>

      </div>

      <p>
        ${task.description || ""}
      </p>

      <div class="task-meta">

        <span
          class="
            badge
            priority-${task.priority}
          "
        >
          ${translatePriority(
            task.priority
        )}
        </span>

        <span
          class="badge"
          style="
            background:${task.color}
          "
        >
          ${task.category}
        </span>

      </div>

      <div class="task-actions">

        <button
          class="
            action-btn
            complete-btn
          "
        >
          <i class="
            fa-solid fa-check
          "></i>
        </button>

        <button
          class="
            action-btn
            edit-btn
          "
        >
          <i class="
            fa-solid fa-pen
          "></i>
        </button>

        <button
          class="
            action-btn
            delete-btn
          "
        >
          <i class="
            fa-solid fa-trash
          "></i>
        </button>

      </div>
    `;

        /* COMPLETE */

        card
            .querySelector(".complete-btn")
            .onclick = () => {

                toggleTask(task.id);

            };

        /* EDIT */

        card
            .querySelector(".edit-btn")
            .onclick = () => {

                editingTaskId =
                    task.id;

                document.getElementById(
                    "taskTitle"
                ).value =
                    task.title;

                document.getElementById(
                    "taskDescription"
                ).value =
                    task.description;

                document.getElementById(
                    "taskPriority"
                ).value =
                    task.priority;

                document.getElementById(
                    "taskDate"
                ).value =
                    task.date;

                taskCategorySelect.value =
                    task.category;

                modalOverlay.classList.add(
                    "active"
                );

            };

        /* DELETE */

        card
            .querySelector(".delete-btn")
            .onclick = () => {

                if (
                    confirm(
                        "Excluir atividade?"
                    )
                ) {

                    tasks = tasks.filter(
                        t => t.id !== task.id
                    );

                    save();

                    renderTasks();

                    updateDashboard();

                }

            };

        taskList.appendChild(card);

    });

}

/* ======================
   TOGGLE TASK
====================== */

function toggleTask(id) {

    tasks = tasks.map(task =>

        task.id === id
            ? {
                ...task,
                completed:
                    !task.completed
            }
            : task

    );

    save();

    renderTasks();

    updateDashboard();

    checkCongrats();

}

/* ======================
   PROGRESS
====================== */

function updateDashboard() {

    const filtered =
        getFilteredTasks();

    const completed =
        filtered.filter(
            t => t.completed
        ).length;

    const pending =
        filtered.filter(
            t => !t.completed
        ).length;

    pendingCount.innerHTML =
        pending;

    completedCount.innerHTML =
        completed;

    const total =
        filtered.length;

    const percent =
        total === 0
            ? 0
            : Math.round(
                completed
                / total
                * 100
            );

    progressFill.style.width =
        `${percent}%`;

    progressText.innerHTML =
        `${percent}%`;

    if (currentView === "day") {
        progressTitle.innerHTML =
            "Progresso diário";
    }

    if (currentView === "week") {
        progressTitle.innerHTML =
            "Progresso semanal";
    }

    if (currentView === "month") {
        progressTitle.innerHTML =
            "Progresso mensal";
    }

}

/* ======================
   CONGRATS
====================== */

function checkCongrats() {

    const filtered =
        getFilteredTasks();

    if (
        filtered.length
        &&
        filtered.every(
            t => t.completed
        )
    ) {

        let text = "";

        if (currentView === "day") {
            text =
                "Parabéns! Você concluiu todas as tarefas do dia 🎉";
        }

        if (currentView === "week") {
            text =
                "Semana finalizada com sucesso 🚀";
        }

        if (currentView === "month") {
            text =
                "Mês concluído com sucesso 🏆";
        }

        congratsText.innerHTML =
            text;

        congratsModal.classList.add(
            "active"
        );

    }

}

closeCongrats.onclick = () => {

    congratsModal.classList.remove(
        "active"
    );

};

/* ======================
   PRIORITY
====================== */

function translatePriority(p) {

    if (p === "high") {
        return "Alta";
    }

    if (p === "medium") {
        return "Média";
    }

    return "Baixa";

}

/* ======================
   SEARCH
====================== */

searchInput.addEventListener(
    "input",
    () => {

        renderTasks();

        updateDashboard();

    }
);

/* ======================
   INIT
====================== */

renderCategories();

renderCalendar();

renderTasks();

updateDashboard();