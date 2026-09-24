// Each task should have: name, status, execution count, and loading time

function createTask(name) {
    let count = 0;
    let status = "Waiting";
    let loadingTime = 0;

    function run() {
        count++;
        status = "Loading";

        loadingTime = Math.floor(
            Math.random() * 1501
        ) + 500;

        
        console.log(`${name} started`);
        console.log(`Loading time: ${loadingTime} ms`);

        return new Promise((resolve, reject) => {

            setTimeout(() => {
                const success= Math.random() > 0.3;
                if (success) {
                    resolve(`${name} Completed`);
                } else {
                    reject (`${name} Failed`);
   
                }
        }, loadingTime);

        });
    }

    function getName() {
        return name;
    }

    function getCount() {
        return count;
    }

    function getStatus() {
        return status
    }

    function getLoadingTime() {
        return loadingTime;
    }

    function reset() {
        count = 0;
        status = "Waiting";
        loadingTime = 0;
    }

    return {
        run, getName, getCount, getStatus, getLoadingTime, reset
    };
}

const tasks = [
    createTask("Load Users"),
    createTask("Load Posts"),
    createTask("Load Comments"),
];

const allTasksResult = document.getElementById("allTasksResult");
const runAllButton = document.getElementById("runAllButton");

function renderTasks() {
    const tasksContainer = document.getElementById("tasks");

    tasksContainer.innerHTML = "";
    
    tasks.forEach((task, index) => {
        const taskElement = document.createElement("div");
        taskElement.className = "task";
        taskElement.innerHTML = `
        <h3>${task.getName()}</h3>

        <p>
            Status:
            <span class="status">
                ${task.getStatus()}
            </span>
        </p>

        <p>
            Count: ${task.getCount()}
        </p>
        
        <p>
            Loading time:
            ${
                task.getLoadingTime() === 0
                ? "-" 
                : task.getLoadingTime() + "ms"
            }
        </p>

        <button class="run-button">
        Run
        </button>
        `;

        tasksContainer.appendChild(taskElement);
    });
    
}

function setupTaskButtons() {
        document.querySelectorAll(".run-button").forEach((button, index) => {
            button.addEventListener("click", () => {
                const promise = tasks[index].run();

                renderTasks();
                setupTaskButtons();

                promise 
                    .then(() => {
                        renderTasks();
                        setupTaskButtons();
                    }) 
                    .catch(() => {
                        renderTasks();
                        setupTaskButtons();
                    });

            });
        });
    }

async function runAllTasks() {
    allTasksResult.textContent = "Tasks are running...";

    const promises = tasks.map((task) => {
        return task.run();
    });

    renderTasks();
    setupTaskButtons();

    await Promise.allSettled(promises);

    allTasksResult.textContent = "All tasks finished";

    renderTasks();
    setupTaskButtons();
}


runAllButton.addEventListener("click", runAllTasks);

renderTasks();
setupTaskButtons();

// Sequential VS Cocurrent
const compareButton = document.getElementById("compareButton");
const comparison = document.getElementById("comparison");

compareButton.addEventListener("click", async () => {

    // sequential execution
    const sequentialStart = performance.now();

    await tasks[0].run().catch(() => {});
    await tasks[1].run().catch(() => {});
    await tasks[2].run().catch(() => {});

    const sequentialEnd = performance.now();
    const sequentialTime = sequentialEnd - sequentialStart;

    // concurrent executiin
    const concurrentStart = performance.now();
    const promises = tasks.map((task) => task.run());

    await Promise.allSettled(promises);
    const concurrentEnd = performance.now();
    const concurrentTime = concurrentEnd - concurrentStart;

    // Show result
    comparison.innerHTML = `
    <p>
        <strong> Sequential:</strong>
        ${sequentialTime.toFixed(0)} ms
    </p>

    <p> 
        <strong>Concurrent:</strong>
        ${concurrentTime.toFixed(0)} ms
    </p>
    `;
});

// explain why execution time are different
// Sequential execution runs each task one after another. The total execution time is approximately the sun of all task loading time. 
// Concurrent execution starts all tasks at the same time using Promises and the total time is the loading time of the longest task.


// Event Loop Demo
const eventLoopButton = document.getElementById("eventLoopButton");
const expectedOutput = document.getElementById("expectedOutput");
const actualOutput = document.getElementById("actualOutput");

async function asyncDemo() {
    console.log("Async function start");
    await Promise.resolve();
    console.log("Async function after await");
}

eventLoopButton.addEventListener("click", () => {
    const output = [];

    function log(message) {
        console.log(message);
        output.push(message);
    }


expectedOutput.textContent = `
1. Start
2. Async function start
3. End
4. Promise 1
5. Async function after await 
6. Promise 2
7. Timer 1 
8. Timer 2
`
log("Start");

setTimeout(() => {
    log("Timer 1");
}, 0);

setTimeout(() => {
    log("Timer 2");
}, 0);

Promise.resolve().then(() => {
    log("Promise 1");
});

asyncDemo();

Promise.resolve().then(() => {
    log("Promise 2");
});

log("End");

setTimeout(() => {
    actualOutput.textContent = output.join("\n");
}, 100);

});
// Call Stack → Microtask Queue → Task Queue → Event Loop
// The expected and actual execution order is the same. First, synchronus code is executed in the Call Stack. Start, Async function start and end appears first. 
// the Event Loop processes the Microtask Queue. Promise callbacks and the continuation aafter await are microtasks. Promise 1 and Async sunction after await and Promise 2 execute next. 
// Task Queue is processed, so the setTimeout callbacks Timer 1 and Timer 2 execute last. \
// This shows that microtasks have prority over time tasks. 