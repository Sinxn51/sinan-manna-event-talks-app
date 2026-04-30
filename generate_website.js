
// generate_website.js

const fs = require('fs');
const path = require('path');

// --- Placeholder Data ---
const talks = [
    {
        title: "The Future of AI in Software Development",
        speakers: ["Dr. Evelyn Reed"],
        category: ["AI", "Software Engineering"],
        duration: 60, // minutes
        description: "Explore how artificial intelligence is reshaping the landscape of software development, from automated code generation to intelligent debugging."
    },
    {
        title: "Advanced JavaScript Patterns for Web Performance",
        speakers: ["Carlos Rodriguez"],
        category: ["JavaScript", "Web Development", "Performance"],
        duration: 60,
        description: "Dive deep into modern JavaScript techniques and design patterns to build high-performance web applications."
    },
    {
        title: "Containerization with Docker and Kubernetes",
        speakers: ["Sarah Chen", "David Lee"],
        category: ["DevOps", "Containers", "Cloud Native"],
        duration: 60,
        description: "A practical guide to deploying and managing applications using Docker and Kubernetes for scalable and resilient systems."
    },
    {
        title: "Ethical Considerations in Data Science",
        speakers: ["Dr. Maya Sharma"],
        category: ["Data Science", "Ethics", "AI"],
        duration: 60,
        description: "Discuss the critical ethical implications and societal impact of data science and artificial intelligence."
    },
    {
        title: "Building Resilient Microservices with Node.js",
        speakers: ["Alex Foster"],
        category: ["Node.js", "Microservices", "Backend"],
        duration: 60,
        description: "Learn best practices for designing, building, and deploying fault-tolerant microservices using Node.js."
    },
    {
        title: "Frontend Frameworks: A Comparative Analysis",
        speakers: ["Emily White"],
        category: ["Frontend", "Web Development", "Frameworks"],
        duration: 60,
        description: "An in-depth comparison of popular frontend frameworks like React, Vue, and Angular, helping you choose the right one for your project."
    }
];

// --- Schedule Calculation ---
function calculateSchedule(talks, startTime, lunchDuration, transitionDuration) {
    const schedule = [];
    let currentTime = new Date(`2000/01/01 ${startTime}`); // Use a dummy date for time calculations

    talks.forEach((talk, index) => {
        const talkStartTime = new Date(currentTime);
        const talkEndTime = new Date(talkStartTime.getTime() + talk.duration * 60 * 1000);

        schedule.push({
            type: 'talk',
            ...talk,
            startTime: talkStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: talkEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        currentTime = talkEndTime;

        // Add transition if not the last talk
        if (index < talks.length - 1) {
            const transitionStartTime = new Date(currentTime);
            currentTime = new Date(currentTime.getTime() + transitionDuration * 60 * 1000);
            const transitionEndTime = new Date(currentTime);
            schedule.push({
                type: 'break',
                name: 'Transition',
                duration: transitionDuration,
                startTime: transitionStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: transitionEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }
    });

    // Insert lunch break - after the second talk in this case
    let lunchInsertIndex = 0;
    let talksCount = 0;
    for(let i=0; i<schedule.length; i++){
        if(schedule[i].type === 'talk'){
            talksCount++;
        }
        if(talksCount === 2){
            lunchInsertIndex = i + 1;
            break;
        }
    }

    const preLunchTime = new Date(`2000/01/01 ${schedule[lunchInsertIndex -1].endTime}`);
    const lunchStartTime = preLunchTime;
    const lunchEndTime = new Date(lunchStartTime.getTime() + lunchDuration * 60 * 1000);

    schedule.splice(lunchInsertIndex, 0, {
        type: 'break',
        name: 'Lunch Break',
        duration: lunchDuration,
        startTime: lunchStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: lunchEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // Adjust subsequent timings after lunch
    for (let i = lunchInsertIndex + 1; i < schedule.length; i++) {
        const previousItemEndTime = new Date(`2000/01/01 ${schedule[i - 1].endTime}`);
        const currentItemDuration = schedule[i].duration;
        const newStartTime = previousItemEndTime;
        const newEndTime = new Date(newStartTime.getTime() + currentItemDuration * 60 * 1000);
        schedule[i].startTime = newStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        schedule[i].endTime = newEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return schedule;
}

const eventStartTime = "10:00 AM";
const lunchBreakDuration = 60; // minutes
const talkTransitionDuration = 10; // minutes

const fullSchedule = calculateSchedule(talks, eventStartTime, lunchBreakDuration, talkTransitionDuration);

// --- HTML Template ---
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Talks Event Schedule</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f7f6;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 900px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .search-bar {
            margin-bottom: 30px;
            text-align: center;
        }
        .search-bar input[type="text"] {
            width: 70%;
            padding: 12px 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1em;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
            transition: border-color 0.3s;
        }
        .search-bar input[type="text"]:focus {
            border-color: #007bff;
            outline: none;
        }
        .schedule-list {
            list-style: none;
            padding: 0;
        }
        .schedule-item {
            background-color: #e9ecef;
            border: 1px solid #dee2e6;
            margin-bottom: 15px;
            padding: 20px;
            border-radius: 6px;
            display: flex;
            align-items: flex-start;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .schedule-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }
        .schedule-item.talk {
            background-color: #ffffff;
            border-left: 5px solid #007bff;
        }
        .schedule-item.break {
            background-color: #f0f8ff;
            border-left: 5px solid #6c757d;
            font-style: italic;
            color: #555;
        }
        .schedule-item-time {
            flex-shrink: 0;
            width: 120px;
            font-weight: bold;
            color: #007bff;
            font-size: 1.1em;
            margin-right: 20px;
        }
        .schedule-item.break .schedule-item-time {
            color: #6c757d;
        }
        .schedule-item-details {
            flex-grow: 1;
        }
        .schedule-item-details h2 {
            margin-top: 0;
            color: #0056b3;
            font-size: 1.5em;
            margin-bottom: 8px;
        }
        .schedule-item.break .schedule-item-details h2 {
            color: #555;
        }
        .schedule-item-details p {
            margin: 5px 0;
        }
        .schedule-item-details .speakers {
            font-weight: 600;
            color: #555;
            font-size: 0.95em;
        }
        .schedule-item-details .category {
            font-size: 0.85em;
            color: #007bff;
            background-color: #e0f0ff;
            padding: 3px 8px;
            border-radius: 12px;
            display: inline-block;
            margin-top: 5px;
        }
        .schedule-item-details .description {
            font-size: 0.9em;
            color: #666;
            margin-top: 10px;
        }
        @media (max-width: 600px) {
            .schedule-item {
                flex-direction: column;
                align-items: flex-start;
            }
            .schedule-item-time {
                margin-bottom: 10px;
                width: auto;
            }
            .search-bar input[type="text"] {
                width: 90%;
            }
            .container {
                padding: 15px;
                margin: 10px auto;
            }
            h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Tech Talks Event Schedule</h1>
        <div class="search-bar">
            <input type="text" id="categorySearch" placeholder="Search by category (e.g., AI, JavaScript)">
        </div>
        <ul id="scheduleList" class="schedule-list">
            <!-- Schedule items will be rendered here by JavaScript -->
        </ul>
    </div>

    <script>
        const fullScheduleData = ${JSON.stringify(fullSchedule, null, 2)};

        const scheduleList = document.getElementById('scheduleList');
        const categorySearchInput = document.getElementById('categorySearch');

        function renderSchedule(dataToRender) {
            scheduleList.innerHTML = ''; // Clear existing list
            dataToRender.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('schedule-item', item.type);

                const timeSpan = document.createElement('span');
                timeSpan.classList.add('schedule-item-time');
                timeSpan.textContent = \`\${item.startTime} - \${item.endTime}\`;
                li.appendChild(timeSpan);

                const detailsDiv = document.createElement('div');
                detailsDiv.classList.add('schedule-item-details');

                if (item.type === 'talk') {
                    const title = document.createElement('h2');
                    title.textContent = item.title;
                    detailsDiv.appendChild(title);

                    const speakers = document.createElement('p');
                    speakers.classList.add('speakers');
                    speakers.textContent = \`Speakers: \${item.speakers.join(', ')}\`;
                    detailsDiv.appendChild(speakers);

                    const category = document.createElement('p');
                    category.classList.add('category');
                    category.textContent = item.category.join(', ');
                    detailsDiv.appendChild(category);

                    const description = document.createElement('p');
                    description.classList.add('description');
                    description.textContent = item.description;
                    detailsDiv.appendChild(description);
                } else {
                    const name = document.createElement('h2');
                    name.textContent = item.name;
                    detailsDiv.appendChild(name);
                    const duration = document.createElement('p');
                    duration.textContent = \`Duration: \${item.duration} minutes\`;
                    detailsDiv.appendChild(duration);
                }
                li.appendChild(detailsDiv);
                scheduleList.appendChild(li);
            });
        }

        function filterSchedule() {
            const searchTerm = categorySearchInput.value.toLowerCase();
            if (!searchTerm) {
                renderSchedule(fullScheduleData); // If search term is empty, show full schedule
                return;
            }

            const filteredData = fullScheduleData.filter(item => {
                if (item.type === 'talk' && item.category) {
                    return item.category.some(cat => cat.toLowerCase().includes(searchTerm));
                }
                return false;
            });
            renderSchedule(filteredData);
        }

        // Initial render
        document.addEventListener('DOMContentLoaded', () => {
            renderSchedule(fullScheduleData);
            categorySearchInput.addEventListener('keyup', filterSchedule);
        });
    </script>
</body>
</html>
