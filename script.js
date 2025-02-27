let tasks = [];

document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;

    if (!name || !dueDate) {
        alert('Preencha todos os campos');
        return;
    }

    tasks.push({
        id: Date.now(),
        name,
        dueDate,
        priority,
        completed: false,
        completionDate: null,
        isOnTime: null
    });

    renderTasks();
    e.target.reset();
});

function isOverdue(dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
}

function renderTasks() {
    const pendingList = document.getElementById('pendingList');
    const completedList = document.getElementById('completedList');
    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    const priorityOrder = {
        alta: 3,
        media: 2,
        baixa: 1
    };
    const now = new Date();


    const pendingTasks = tasks.filter(task => !task.completed);
    pendingTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    pendingTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        if (isOverdue(task.dueDate)) {
            li.classList.add('overdue');
        }

        li.addEventListener('click', () => {
            task.completed = true;
            task.completionDate = new Date();
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            const completionDate = new Date(task.completionDate);
            completionDate.setHours(0, 0, 0, 0);
            task.isOnTime = completionDate <= dueDate;
            renderTasks();
        });

        pendingList.appendChild(li);
    });


    const completedTasks = tasks.filter(task => task.completed);
    completedTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        const completionDate = task.completionDate.toLocaleDateString('pt-BR');
        const status = task.isOnTime ? 'no prazo' : 'atrasada';
        tooltip.textContent = `Concluída em: ${completionDate} (${status})`;

        li.appendChild(tooltip);
        completedList.appendChild(li);
    });
}

renderTasks();