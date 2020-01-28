const express = require('express');

const server = express();

server.use(express.json());

server.use((req, res, next) => {
    requestCount++;
    console.log(`Requests made so far: ${requestCount}`);
    return next();
});

function projectExists(req, res, next) {
    const project = projects.find(p => p.id === req.params.id);

    if (!project) {
        return res.status(400).json({ error: 'Project does not exist' });
    }

    req.project = project;

    return next();
}

const projects = [];
let requestCount = 0;

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.get('/projects/:id', projectExists, (req, res) => {
    return res.json(req.project);
});

server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const project = projects.find(p => p.id === id);

    if (project) {
        return res.status(400).json({
            error: 'A project with this id already exists'
        });
    }

    projects.push({ id, title, tasks: [] });

    return res.json(projects);
});

server.put('/projects/:id', projectExists, (req, res) => {
    const { title } = req.body;

    req.project.title = title;

    return res.json(projects);
});

server.delete('/projects/:id', projectExists, (req, res) => {
    projects.splice(projects.indexOf(req.project), 1);
    return res.json(projects);
});

server.post('/projects/:id/tasks', projectExists, (req, res) => {
    const { title } = req.body;

    req.project.tasks.push(title);

    return res.json(projects);
})

server.listen(3000);